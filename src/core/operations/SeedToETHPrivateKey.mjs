/**
 * Derives an Ethereum private key from a seed along a BIP32 derivation path.
 *
 * @author dgoldenberg [virtualcurrency@mitre.org]
 * @copyright  MITRE 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { isHex } from "../lib/Bitcoin.mjs";
import forge from "node-forge";
import { BIP32Factory } from "bip32";
import ecc from "@bitcoinerlab/secp256k1";
import Utils from "../Utils.mjs";


/**
 * Sanity checks a derivation path.
 * @param {*} input
 * @returns {boolean}
 */
function verifyDerivationPath(input) {
    const splitResults = input.split("/");
    let startIndex = 0;
    // We skip the first index if its m, as that's common.
    if (splitResults[0] === "m") {
        startIndex = 1;
    }
    for (let i = startIndex; i < splitResults.length; i++) {
        const re = /^[0-9]{1,}[']{0,1}$/g;
        if (!re.test(splitResults[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Seed To ETH Private Key operation
 */
class SeedToETHPrivateKey extends Operation {

    /**
     * SeedToETHPrivateKey constructor
     */
    constructor() {
        super();

        this.name = "Seed To ETH Private Key";
        this.module = "Serialize";
        this.description = "Given a 64 byte seed, derives the Ethereum private key along the given BIP32 derivation path and address index, output as hex. The default derivation path m/44'/60'/0'/0 with index 0 gives the first address of the standard Ethereum HD wallet (BIP44), i.e. m/44'/60'/0'/0/0. To produce the seed from a seedphrase, use the Seedphrase To Seed Op. To get the associated public key or address, follow up with the Private EC Key to Public Key and Public Key To ETH Style Address ops.";
        this.infoURL = "https://github.com/ethereum/EIPs/issues/84";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Derivation Path",
                "type": "string",
                "value": "m/44'/60'/0'/0"
            },
            {
                "name": "Index",
                "type": "number",
                "value": 0
            }
        ];
        this.checks = [
            {
                "pattern": "^[0-9A-Fa-f]{128}$",
                "flags": "",
                "args": ["m/44'/60'/0'/0", 0]
            }
        ];
    }

    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        if (input.trim().length === 0) {
            return "";
        }
        input = input.trim();

        const [path, index] = args;
        if (!verifyDerivationPath(path)) {
            throw new OperationError("Invalid derivation path: " + path);
        }
        if (!Number.isInteger(index) || index < 0 || index >= 0x80000000) {
            throw new OperationError("Invalid index: " + index + ". Must be a non-negative integer less than 2^31.");
        }

        const isItHex = isHex(input);
        // Create the hmac.
        const hmac = forge.hmac.create();
        hmac.start("sha512", Utils.convertToByteString("Bitcoin seed", "UTF8"));
        if (isItHex) {
            hmac.update(Utils.convertToByteString(input, "hex"));
        } else {
            hmac.update(input);
        }
        const hexValue = hmac.digest().toHex();

        const bip32 = BIP32Factory(ecc);
        const masterNode = bip32.fromPrivateKey(
            Buffer.from(hexValue.slice(0, 64), "hex"),
            Buffer.from(hexValue.slice(64), "hex")
        );
        const fullPath = (path === "m" ? "m" : path.replace(/\/+$/, "")) + "/" + index;
        const child = masterNode.derivePath(fullPath);
        if (!child.privateKey) {
            throw new OperationError("Unable to derive a valid private key along path " + fullPath);
        }
        return Buffer.from(child.privateKey).toString("hex");
    }

}

export default SeedToETHPrivateKey;

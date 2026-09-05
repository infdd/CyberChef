/**
 * Turns a seed into the initial master private key.
 *
 * @author dgoldenberg [virtualcurrency@mitre.org]
 * @copyright  MITRE 2023
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { serializeExtendedKeyFunc, getExtendedKeyVersion, getVersions, isHex } from "../lib/Bitcoin.mjs";
import forge from "node-forge";
import { BIP32Factory } from "bip32";
import ecc from "@bitcoinerlab/secp256k1";
import Utils from "../Utils.mjs";

// Default ETH HD derivation path (BIP44 for Ethereum).
const ETH_DERIVATION_PATH = "m/44'/60'/0'/0";


/**
 * Changes the version of an extended key. This can help to see if two keys are equal.
 */
class SeedToMPK extends Operation {

    /**
     * Extract Seedphrases Constructor.
     */
    constructor() {
        super();

        this.name = "Seed To Master Key";
        this.module = "Serialize";
        this.description = "Given a 64 byte seed, we change the seed into the extended given master private key, with selected version. The ethpub and ethprv versions derive along the default Ethereum HD path m/44'/60'/0'/0 and output the compressed secp256k1 public key and the private key respectively, as hex. To produce the seed from a seedphrase, you can use the Seedphrase To Seed Op.";
        this.infoURL = "https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#Serialization_format";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Version Type",
                "type": "option",
                "value": ["ethpub", "ethprv"].concat(getVersions())
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

        if (args[0] === "ethpub" || args[0] === "ethprv") {
            const bip32 = BIP32Factory(ecc);
            const masterNode = bip32.fromPrivateKey(
                Buffer.from(hexValue.slice(0, 64), "hex"),
                Buffer.from(hexValue.slice(64), "hex")
            );
            const child = masterNode.derivePath(ETH_DERIVATION_PATH);
            if (!child.privateKey) {
                throw new OperationError("Unable to derive a valid private key along path " + ETH_DERIVATION_PATH);
            }
            if (args[0] === "ethprv") {
                return Buffer.from(child.privateKey).toString("hex");
            }
            return Buffer.from(child.publicKey).toString("hex");
        }

        const newVersion = getExtendedKeyVersion(args[0]);

        return serializeExtendedKeyFunc(newVersion, 0, "00000000", 0, hexValue.slice(64,), "00" + hexValue.slice(0, 64));
    }

}

export default SeedToMPK;

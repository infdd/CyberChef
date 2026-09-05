/**
 * Turns entropy into a BIP39 seedphrase.
 *
 * @author dgoldenberg [virtualcurrency@mitre.org]
 * @copyright  MITRE 2023 Wei Lu <luwei.here@gmail.com> and Daniel Cousens <email@dcousens.com> 2014
 * @license ISC
 */

import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import { bip39, entropyToMnemonic } from "../lib/Seedphrase.mjs";
import { isHex } from "../lib/Bitcoin.mjs";

/**
 * Entropy to Seedphrase Class.
 */
class EntropyToSeedphrase extends Operation {

    /**
     * EntropyToSeedphrase Constructor.
     */
    constructor() {
        super();

        this.name = "Entropy To Seedphrase";
        this.module = "Serialize";
        this.description = "Turns entropy, entered as hex, into a BIP39 seedphrase. The entropy must be 16, 20, 24, 28, or 32 bytes long. To go the other way, extract the entropy from a seedphrase by using the Extract Seedphrases Op.";
        this.infoURL = "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#generating-the-mnemonic";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [];
        this.checks = [
            {
                "pattern": "^[0-9A-Fa-f]{32}$",
                "flags": "",
                "args": []
            },
            {
                "pattern": "^[0-9A-Fa-f]{40}$",
                "flags": "",
                "args": []
            },
            {
                "pattern": "^[0-9A-Fa-f]{48}$",
                "flags": "",
                "args": []
            },
            {
                "pattern": "^[0-9A-Fa-f]{56}$",
                "flags": "",
                "args": []
            },
            {
                "pattern": "^[0-9A-Fa-f]{64}$",
                "flags": "",
                "args": []
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

        if (!isHex(input)) {
            throw new OperationError("Invalid entropy. The entropy must be an even length hex string.");
        }

        const entropyBytes = [];
        for (let i = 0; i < input.length; i += 2) {
            entropyBytes.push(parseInt(input.slice(i, i + 2), 16));
        }
        const entropy = Buffer.from(entropyBytes);

        try {
            return entropyToMnemonic(entropy, bip39.english);
        } catch (e) {
            throw new OperationError("Invalid entropy. The entropy must be 16, 20, 24, 28, or 32 bytes long.");
        }
    }
}

export default EntropyToSeedphrase;

/**
 * Entropy To Seedphrase tests.
 *
 * Test vectors taken from the official BIP39 test vectors:
 * https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki#test-vectors
 *
 * @license Apache-2.0
 */

import TestRegister from "../../lib/TestRegister.mjs";


TestRegister.addTests([
    {
        name: "Entropy To Seedphrase: 16 bytes, all zeroes",
        input: "00000000000000000000000000000000",
        expectedOutput: "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
    {
        name: "Entropy To Seedphrase: 16 bytes, all 7f",
        input: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
        expectedOutput: "legal winner thank year wave sausage worth useful legal winner thank yellow",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
    {
        name: "Entropy To Seedphrase: 24 bytes, all 80",
        input: "808080808080808080808080808080808080808080808080",
        expectedOutput: "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
    {
        name: "Entropy To Seedphrase: 32 bytes, all ff",
        input: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        expectedOutput: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
    {
        name: "Entropy To Seedphrase: 32 bytes, all 80",
        input: "8080808080808080808080808080808080808080808080808080808080808080",
        expectedOutput: "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
    {
        name: "Entropy To Seedphrase: blank input",
        input: "",
        expectedOutput: "",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            }
        ],
    },
]);

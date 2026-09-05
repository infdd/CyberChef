/**
 * Seed To ETH Private Key tests.
 *
 * The end-to-end test vector (zero entropy to ETH address) was verified against
 * the standard BIP44 Ethereum derivation m/44'/60'/0'/0/0.
 *
 * @license Apache-2.0
 */

import TestRegister from "../../lib/TestRegister.mjs";


TestRegister.addTests([
    {
        name: "Seed To ETH Private Key (default path and index)",
        input: "c766f48d3729a16249b5d0171c678d458d31454b2bb7791b61169b5541a130719714ebd41f22a2515246d013e9a4e978aee48dd5140b73a540108d58008c4aa9",
        expectedOutput: "70a917f44c6932e6ab4e70a64b13cfc680257e57e6a467bb0b7b02a593c755e9",
        recipeConfig: [
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/0'/0", 0]
            }
        ],
    },
    {
        name: "Seed To ETH Private Key (index 1)",
        input: "c766f48d3729a16249b5d0171c678d458d31454b2bb7791b61169b5541a130719714ebd41f22a2515246d013e9a4e978aee48dd5140b73a540108d58008c4aa9",
        expectedOutput: "b5752f42e362531dc08bedf55a2854d03607f0fa1d6aba1daefff7d437096eb7",
        recipeConfig: [
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/0'/0", 1]
            }
        ],
    },
    {
        name: "Seed To ETH Private Key (custom path)",
        input: "c766f48d3729a16249b5d0171c678d458d31454b2bb7791b61169b5541a130719714ebd41f22a2515246d013e9a4e978aee48dd5140b73a540108d58008c4aa9",
        expectedOutput: "05135f05f8d1dd400f90ae87492ce8da9c8f21114103a31f7a842f4aa0d80ad9",
        recipeConfig: [
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/1'/0", 0]
            }
        ],
    },
    {
        name: "Seed To ETH Private Key (invalid path)",
        input: "c766f48d3729a16249b5d0171c678d458d31454b2bb7791b61169b5541a130719714ebd41f22a2515246d013e9a4e978aee48dd5140b73a540108d58008c4aa9",
        expectedOutput: "Invalid derivation path: m/44'/60'/x",
        recipeConfig: [
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/x", 0]
            }
        ],
    },
    {
        name: "Seed To ETH Private Key (invalid index)",
        input: "c766f48d3729a16249b5d0171c678d458d31454b2bb7791b61169b5541a130719714ebd41f22a2515246d013e9a4e978aee48dd5140b73a540108d58008c4aa9",
        expectedOutput: "Invalid index: -1. Must be a non-negative integer less than 2^31.",
        recipeConfig: [
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/0'/0", -1]
            }
        ],
    },
    {
        // Full pipeline: entropy -> seedphrase -> seed -> ETH private key ->
        // public key -> ETH address. The all-zero entropy BIP39 vector
        // ("abandon" x23 + "art") derives the address below at m/44'/60'/0'/0/0.
        name: "Entropy To Seedphrase To Seed To ETH Private Key To ETH Address",
        input: "0000000000000000000000000000000000000000000000000000000000000000",
        expectedOutput: "0xf278cf59f82edcf871d630f28ecc8056f25c1cdb",
        recipeConfig: [
            {
                "op": "Entropy To Seedphrase",
                "args": []
            },
            {
                "op": "Seedphrase To Seed",
                "args": ["bip39", {"option": "UTF8", "string": ""}]
            },
            {
                "op": "Seed To ETH Private Key",
                "args": ["m/44'/60'/0'/0", 0]
            },
            {
                "op": "Private EC Key to Public Key",
                "args": [true]
            },
            {
                "op": "Public Key To ETH Style Address",
                "args": []
            }
        ],
    },
]);

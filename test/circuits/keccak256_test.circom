pragma circom 2.0.0;

include "../../circuits/keccak256.circom";

component main = Keccak(32*8);

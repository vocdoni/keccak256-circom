const chai = require("chai");
const path = require("path");
const crypto = require("crypto");
const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

const keccak256 = require("keccak256");

const wasm_tester = require("circom_tester").wasm;

// const printSignal = require("./helpers/printsignal");

function bytesToU64(byteArray) {
    var value = 0;
    for ( var i = byteArray.length - 1; i >= 0; i--) {
	value = (value * 256) + byteArray[i];
    }

    return value;
}
function u64ToBytes(long) {
    var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for ( var index = 0; index < byteArray.length; index ++ ) {
	var byte = long & 0xff;
	byteArray [ index ] = byte;
	long = (long - byte) / 256 ;
    }

    return byteArray;
}

function u64ToBits(a) {
    const aBytes = u64ToBytes(a);
    return bytesToBits(aBytes);
}
function bytesToBits(b) {
    const bits = [];
    for (let i = 0; i < b.length; i++) {
	for (let j = 0; j < 8; j++) {
	    if ((b[i]&(1<<j)) > 0) {
		bits.push(Fr.e(1));
	    } else {
		bits.push(Fr.e(0));
	    }
	}
    }
    return bits
}
function u64ArrayToBits(u) {
    let r = [];
    for (let i = 0; i < u.length; i++) {
	r = r.concat(u64ToBits(u[i]));
    }
    return r
}
function bitsToU64(b) {
    if (b.length != 64) {
	console.log("b.length = ", b.length, " max=64");
	return;
    }
    const by = bitsToBytes(b)
    return bytesToU64(by)
}
function bitsToBytes(a) {
    const b = [];

    for (let i=0; i<a.length; i++) {
	const p = Math.floor(i/8);
	if (b[p]==undefined) {
	    b[p] = 0;
	}
	if (a[i]==1) {
	    b[p] |= 1<<(i%8);
	}
    }
    return b;
}

function bitsToU64Array(b) {
    const r = [];
    for (let i = 0; i < b.length/64; i++) {
	r.push(bitsToU64(b.slice(i*64, i*64+64)));
    }
    return r
}

function intsToBigInts(a) {
    let b = [];
    for (let i=0; i<a.length; i++) {
	b[i] = Fr.e(a[i]);
    }
    return b;
}

describe("Utils test", function () {
    this.timeout(100000);

    it ("utils", async () => {
	let a = 3;
	let aBits = u64ToBits(a);
	let a2 = bitsToU64(aBits);
	assert.equal(a2, a);
	a = 12345;
	aBits = u64ToBits(a);
	a2 = bitsToU64(aBits);
	assert.equal(a2, a);

	a = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	aBits = u64ArrayToBits(a);
	a2 = bitsToU64Array(aBits);
	// console.log(a2, a);
	assert.deepEqual(a2, a);
    });
});


describe("Theta test", function () {
    this.timeout(100000);

    it ("Theta (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = [26,9,13,29,47,31,14,8,22,34,16,3,3,19,37,21,24,30,12,56,14,29,25,9,51];
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("RhoPi test", function () {
    this.timeout(100000);

    it ("RhoPi (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "rhopi_test.circom"));

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = [0, 105553116266496, 105553116266496, 37748736, 393216,
	    805306368, 9437184, 80, 562949953421312, 13835058055282163714,
	    2, 448, 436207616, 4864, 5242880, 536870912, 343597383680,
	    11264, 557056, 1657324662872342528, 9223372036854775808,
	    288230376151711744, 7696581394432, 32985348833280, 84];
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Chi test", function () {
    this.timeout(100000);

    it ("Chi (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "chi_test.circom"));

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = [2, 0, 6, 3, 5, 4, 14, 6, 12, 11, 14, 10, 14, 13, 15,
			14, 18, 16, 30, 3, 22, 20, 30, 19, 25];
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Iota test", function () {
    this.timeout(100000);

    it ("Iota 3 (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "iota3_test.circom"));

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = [9223372039002292224,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
    it ("Iota 10 (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "iota10_test.circom"));

	const input = [9223372039002292224,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = [9223372036854775817,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Keccak-Pad test", function () {
    this.timeout(100000);

    it ("Pad (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "pad_test.circom"));

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	const expectedOut = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128];

	const stateIn = bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(136*8));
	const stateOutBytes = bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
});


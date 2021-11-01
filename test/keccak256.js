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
    const len = Math.floor((a.length -1 )/8)+1;
    const b = [];

    for (let i=0; i<a.length; i++) {
	const p = Math.floor(i/8);
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
	// console.log("a", a);
	// console.log("a2", a2);
    
	assert.deepEqual(a2, a);
    });
});


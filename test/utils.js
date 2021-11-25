const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p =
    Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const chai = require("chai");
const assert = chai.assert;

module.exports = {
    bytesToU64,
    u64ToBytes,
    u64ToBits,
    bytesToBits,
    u64ArrayToBits,
    bitsToU64,
    bitsToBytes,
    bitsToU64Array,
    strsToBigInts,
    intsToBigInts,
    bigIntsToInts,
    bufferToBytes
};

function bytesToU64(byteArray) {
    // var value = 0;
    var value = Fr.e(0);
    for ( var i = byteArray.length - 1; i >= 0; i--) {
	// value = (value * 256) + byteArray[i];
	value = Fr.add(Fr.mul(Fr.e(value), Fr.e(256)), Fr.e(byteArray[i]));
    }

    return value;
}
function u64ToBytes(a) {
    var b = Fr.e(a);

    const buff = new Uint8Array(8);
    Scalar.toRprLE(buff, 0, b, 8);
    return buff;
}
function u64ToBits(a) {
    const aBytes = u64ToBytes(a);
    return bytesToBits(aBytes);
}
function bytesToBits(b) {
    const bits = [];
    for (let i = 0; i < b.length; i++) {
	for (let j = 0; j < 8; j++) {
	    if ((Number(b[i])&(1<<j)) > 0) {
		// bits.push(Fr.e(1));
		bits.push(1);
	    } else {
		// bits.push(Fr.e(0));
		bits.push(0);
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

function strsToBigInts(a) {
    let b = [];
    for (let i=0; i<a.length; i++) {
	b[i] = Fr.e(a[i]);
    }
    return b;
}
function intsToBigInts(a) {
    let b = [];
    for (let i=0; i<a.length; i++) {
	b[i] = Fr.e(a[i]);
    }
    return b;
}
function bigIntsToInts(a) {
    let b = [];
    for (let i=0; i<a.length; i++) {
	b[i] = Number(a[i]);
    }
    return b;
}
function bufferToBytes(buff) {
    const bytes = [];
    for (let i = 0; i < buff.length; i++) {
	bytes.push(buff[i]);
    }
    return bytes;
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

	a = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	aBits = u64ArrayToBits(a);
	a2 = bitsToU64Array(aBits);
	assert.deepEqual(a2, a);
    });
});


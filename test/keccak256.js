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
const c_tester = require("circom_tester").c;

// const printSignal = require("./helpers/printsignal");

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


describe("Theta test", function () {
    this.timeout(100000);

    it ("Theta (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = intsToBigInts([26,9,13,29,47,31,14,8,22,34,16,3,3,19,37,21,24,30,12,56,14,29,25,9,51]);
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
    it ("Theta (same test as previous, but using c_tester to ensure that circom_tester with c works as expected)", async () => {
	const cir = await c_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = intsToBigInts([26,9,13,29,47,31,14,8,22,34,16,3,3,19,37,21,24,30,12,56,14,29,25,9,51]);
	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("Theta (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "theta_test.circom"));
	// const cir = await c_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input = strsToBigInts(["26388279066651", "246290629787648", "26388279902208",
	    "25165850", "246290605457408", "7784628352", "844424965783552",
	    "2305843009213694083", "844432714760192", "2305843009249345539",
	    "637534226", "14848", "641204224", "14354", "3670528", "6308236288",
	    "2130304761856", "648518346341354496", "6309216256", "648520476645130240",
	    "4611706359392501763", "792677514882318336", "20340965113972",
	    "4611732197915754499", "792633534417207412"]);
	const expectedOut = strsToBigInts(["3749081831850030700", "1297317621190464868",
	    "10017560217643747862", "7854780639862409219", "13836147678645575967",
	    "3749090635727681271", "1297915755455157604", "12323429615135705749",
	    "7855062122598582297", "16141814766035214620", "3749090628446369381",
	    "1297071330560683876", "10017586606556924438", "7854780639837253643",
	    "13835971756788491039", "3749090634251287159", "1297070162329376100",
	    "9369068259580659222", "7854780645071013913", "14484490034407743775",
	    "8360757404916954740", "1801500877105239396", "10017570663003408994",
	    "3243123208712177690", "14628605291203076459"]);

	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });


});

describe("RhoPi test", function () {
    this.timeout(100000);

    it ("RhoPi (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "rhopi_test.circom"));

	const input = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = strsToBigInts(["0", "105553116266496", "105553116266496", "37748736", "393216",
	    "805306368", "9437184", "80", "562949953421312", "13835058055282163714",
	    "2", "448", "436207616", "4864", "5242880", "536870912", "343597383680",
	    "11264", "557056", "1657324662872342528", "9223372036854775808",
	    "288230376151711744", "7696581394432", "32985348833280", "84"]);
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

	const input = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = intsToBigInts([2, 0, 6, 3, 5, 4, 14, 6, 12, 11, 14, 10, 14, 13, 15,
	    14, 18, 16, 30, 3, 22, 20, 30, 19, 25]);
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

	const input = intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = strsToBigInts(["9223372039002292224",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
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

	const input = strsToBigInts(["9223372039002292224",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = strsToBigInts(["9223372036854775817",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
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

describe("keccakfRound test", function () {
    this.timeout(100000);

    // apt install nlohmann-json3-dev
    // apt install nasm

    it ("keccakfRound (testvector generated from go)", async () => {
	// const cir = await wasm_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakfRound0_test.circom"));
	await cir.loadConstraints();
	// console.log("n_constraints", cir.constraints.length);

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = strsToBigInts(["26388279066651", "246290629787648", "26388279902208", "25165850", "246290605457408", "7784628352", "844424965783552", "2305843009213694083", "844432714760192", "2305843009249345539", "637534226", "14848", "641204224", "14354", "3670528", "6308236288", "2130304761856", "648518346341354496", "6309216256", "648520476645130240", "4611706359392501763", "792677514882318336", "20340965113972", "4611732197915754499", "792633534417207412"]);

	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("keccakfRound 20 (testvector generated from go)", async () => {
	// const cir = await wasm_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakfRound20_test.circom"));
	await cir.loadConstraints();
	// console.log("n_constraints", cir.constraints.length);

	const input = strsToBigInts(["26388279066651", "246290629787648", "26388279902208", "25165850", "246290605457408", "7784628352", "844424965783552", "2305843009213694083", "844432714760192", "2305843009249345539", "637534226", "14848", "641204224", "14354", "3670528", "6308236288", "2130304761856", "648518346341354496", "6309216256", "648520476645130240", "4611706359392501763", "792677514882318336", "20340965113972", "4611732197915754499", "792633534417207412"]);
	const expectedOut = strsToBigInts(["17728382861289829725", "13654073086381141005", "9912591532945168756", "2030068283137172501", "5084683018496047808", "151244976540463006", "11718217461613725815", "11636071286320763433", "15039144509240642782", "11629028282864249197", "2594633730779457624", "14005558505838459171", "4612881094252610438", "2828009553220809993", "4838578484623267135", "1006588603063111352", "11109191860075454495", "1187545859779038208", "14661669042642437042", "5345317080454741069", "8196674451365552863", "635818354583088260", "13515759754032305626", "1708499319988748543", "7509292798507899312"]);

	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("keccakf test", function () {
    this.timeout(100000);

    it ("keccakf 1 (testvector generated from go)", async () => {
	// const cir = await wasm_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);

	const input = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = strsToBigInts(["9472389783892099349", "2159377575142921216", "17826682512249813373", "2325963263767348549", "15086930817298358378", "11661812091723830419", "3517755057770134847", "5223775837645169598", "933274647126506074", "3451250694486589320", "825065683101361807", "6192414258352188799", "14426505790672879210", "3326742392640380689", "16749975585634164134", "17847697619892908514", "11598434253200954839", "6049795840392747215", "8610635351954084385", "18234131770974529925", "15330347418010067760", "12047099911907354591", "4763389569697138851", "6779624089296570504", "15083668107635345971"]);

	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("keccakf 2 (testvector generated from go)", async () => {
	// const cir = await wasm_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);

	const input = strsToBigInts(["9472389783892099349", "2159377575142921216", "17826682512249813373", "2325963263767348549", "15086930817298358378", "11661812091723830419", "3517755057770134847", "5223775837645169598", "933274647126506074", "3451250694486589320", "825065683101361807", "6192414258352188799", "14426505790672879210", "3326742392640380689", "16749975585634164134", "17847697619892908514", "11598434253200954839", "6049795840392747215", "8610635351954084385", "18234131770974529925", "15330347418010067760", "12047099911907354591", "4763389569697138851", "6779624089296570504", "15083668107635345971"]);
	const expectedOut = strsToBigInts(["269318771259381490", "15892848561416382510", "12485559500958802382", "4360182510883008729", "14284025675983944434", "8800366419087562177", "7881853509112258378", "9503857914080778528", "17110477940977988953", "13825318756568052601", "11460650932194163315", "13272167288297399439", "13599957064256729412", "12730838251751851758", "13736647180617564382", "5651695613583298166", "15496251216716036782", "9748494184433838858", "3637745438296580159", "3821184813198767406", "15603239432236101315", "3726326332491237029", "7819962668913661099", "2285898735263816116", "13518516210247555620"]);

	const stateIn = u64ArrayToBits(input);
	const expectedOutBits = u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

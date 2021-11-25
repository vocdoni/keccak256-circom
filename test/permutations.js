const path = require("path");

const chai = require("chai");
const assert = chai.assert;

const wasm_tester = require("circom_tester").wasm;
const c_tester = require("circom_tester").c;

const utils = require("./utils");

describe("Theta test", function () {
    this.timeout(100000);

    it ("Theta (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input =
	    utils.intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut =
	    utils.intsToBigInts([26,9,13,29,47,31,14,8,22,34,16,3,3,19,37,21,24,30,12,56,14,29,25,9,51]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
    it ("Theta (same test as previous, but using c_tester to ensure that"+
	"circom_tester with c works as expected)", async () => {
	const cir = await c_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input =
		utils.intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut =
		utils.intsToBigInts([26,9,13,29,47,31,14,8,22,34,16,3,3,19,37,21,24,30,12,56,14,29,25,9,51]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("Theta (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "theta_test.circom"));
	// const cir = await c_tester(path.join(__dirname, "circuits", "theta_test.circom"));

	const input = utils.strsToBigInts(["26388279066651", "246290629787648",
	    "26388279902208", "25165850", "246290605457408", "7784628352",
	    "844424965783552", "2305843009213694083", "844432714760192",
	    "2305843009249345539", "637534226", "14848", "641204224", "14354",
	    "3670528", "6308236288", "2130304761856", "648518346341354496",
	    "6309216256", "648520476645130240", "4611706359392501763",
	    "792677514882318336", "20340965113972", "4611732197915754499",
	    "792633534417207412"]);
	const expectedOut = utils.strsToBigInts(["3749081831850030700",
	    "1297317621190464868", "10017560217643747862",
	    "7854780639862409219", "13836147678645575967",
	    "3749090635727681271", "1297915755455157604",
	    "12323429615135705749", "7855062122598582297",
	    "16141814766035214620", "3749090628446369381",
	    "1297071330560683876", "10017586606556924438",
	    "7854780639837253643", "13835971756788491039",
	    "3749090634251287159", "1297070162329376100",
	    "9369068259580659222", "7854780645071013913",
	    "14484490034407743775", "8360757404916954740",
	    "1801500877105239396", "10017570663003408994",
	    "3243123208712177690", "14628605291203076459"]);

	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });


});

describe("RhoPi test", function () {
    this.timeout(100000);

    it ("RhoPi (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "rhopi_test.circom"));

	const input =
	    utils.intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = utils.strsToBigInts(["0", "105553116266496",
	    "105553116266496", "37748736", "393216", "805306368", "9437184",
	    "80", "562949953421312", "13835058055282163714", "2", "448",
	    "436207616", "4864", "5242880", "536870912", "343597383680",
	    "11264", "557056", "1657324662872342528", "9223372036854775808",
	    "288230376151711744", "7696581394432", "32985348833280", "84"]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Chi test", function () {
    this.timeout(100000);

    it ("Chi (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "chi_test.circom"));

	const input =
	    utils.intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut = utils.intsToBigInts([2, 0, 6, 3, 5, 4, 14, 6, 12,
	    11, 14, 10, 14, 13, 15, 14, 18, 16, 30, 3, 22, 20, 30, 19, 25]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Iota test", function () {
    this.timeout(100000);

    it ("Iota 3 (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "iota3_test.circom"));

	const input =
	    utils.intsToBigInts([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut =
	    utils.strsToBigInts(["9223372039002292224",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
    it ("Iota 10 (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "iota10_test.circom"));

	const input =
	    utils.strsToBigInts(["9223372039002292224",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const expectedOut =
	    utils.strsToBigInts(["9223372036854775817",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]);
	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

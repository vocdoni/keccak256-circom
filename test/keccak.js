const path = require("path");

const chai = require("chai");
const assert = chai.assert;

const c_tester = require("circom_tester").c;

const utils = require("./utils");
const keccak256 = require("keccak256");

describe("Keccak full hash test", function () {
    this.timeout(100000);

    let cir;
    before(async () => {
	cir = await c_tester(path.join(__dirname, "circuits", "keccak256_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);
    });

    it ("Keccak 1 (testvector generated from go)", async () => {
	const input = [116, 101, 115, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const expectedOut = [37, 17, 98, 135, 161, 178, 88, 97, 125, 150, 143,
	    65, 228, 211, 170, 133, 153, 9, 88, 212, 4, 212, 175, 238, 249,
	    210, 214, 116, 170, 85, 45, 21];

	const inIn = utils.bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
    it ("Keccak 2 (testvector generated from go)", async () => {
	const input = [37, 17, 98, 135, 161, 178, 88, 97, 125, 150, 143, 65,
	    228, 211, 170, 133, 153, 9, 88, 212, 4, 212, 175, 238, 249, 210,
	    214, 116, 170, 85, 45, 21];
	const expectedOut = [182, 104, 121, 2, 8, 48, 224, 11, 238, 244, 73,
	    142, 67, 205, 166, 27, 10, 223, 142, 209, 10, 46, 171, 110, 239,
	    68, 111, 116, 164, 127, 103, 141];

	const inIn = utils.bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
    it ("Keccak 3 (testvector generated from go)", async () => {
	const input = [182, 104, 121, 2, 8, 48, 224, 11, 238, 244, 73, 142, 67,
	    205, 166, 27, 10, 223, 142, 209, 10, 46, 171, 110, 239, 68, 111,
	    116, 164, 127, 103, 141];
	const expectedOut = [191, 235, 249, 254, 70, 24, 106, 244, 212, 163,
	    52, 240, 1, 128, 235, 61, 158, 52, 138, 60, 197, 80, 113, 36, 44,
	    217, 55, 211, 97, 231, 26, 7];

	const inIn = utils.bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
    it ("Keccak 4 (testvector generated from go)", async () => {
	const input = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	const expectedOut = [41, 13, 236, 217, 84, 139, 98, 168, 214, 3, 69,
	    169, 136, 56, 111, 200, 75, 166, 188, 149, 72, 64, 8, 246, 54, 47,
	    147, 22, 14, 243, 229, 99];

	const inIn = utils.bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });

    describe("Keccak256 circuit check with js version", function () {
	this.timeout(100000);

	it ("Keccak256 circom-js 1", async () => {
	    let input, inputBits, expectedOut, witness, stateOut, stateOutBytes;
	    input = Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex");
	    for(let i=0; i<10; i++) {
		inputBits = utils.bytesToBits(input);

		let jsOutRaw = keccak256(input);
		expectedOut = utils.bufferToBytes(jsOutRaw);
		console.log(i, "in:", input.toString('hex'), "\n out:", jsOutRaw.toString('hex'));

		witness = await cir.calculateWitness({ "in": inputBits }, true);
		stateOut = witness.slice(1, 1+(32*8));
		stateOutBytes = utils.bitsToBytes(stateOut);
		assert.deepEqual(stateOutBytes, expectedOut);

		// assign output into input for next iteration
		input = jsOutRaw;
	    }
	});
    });
});

const path = require("path");

const chai = require("chai");
const assert = chai.assert;

const c_tester = require("circom_tester").c;

const utils = require("./utils");

describe("keccakfRound test", function () {
    this.timeout(100000);

    // apt install nlohmann-json3-dev
    // apt install nasm
    // apt install libgmp3-dev

    it ("keccakfRound (testvector generated from go)", async () => {
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakfRound0_test.circom"));
	await cir.loadConstraints();
	// console.log("n_constraints", cir.constraints.length);

	const input =
	    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = utils.strsToBigInts(["26388279066651",
	    "246290629787648", "26388279902208", "25165850", "246290605457408",
	    "7784628352", "844424965783552", "2305843009213694083",
	    "844432714760192", "2305843009249345539", "637534226", "14848",
	    "641204224", "14354", "3670528", "6308236288", "2130304761856",
	    "648518346341354496", "6309216256", "648520476645130240",
	    "4611706359392501763", "792677514882318336", "20340965113972",
	    "4611732197915754499", "792633534417207412"]);

	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("keccakfRound 20 (testvector generated from go)", async () => {
	const cir = await c_tester(path.join(__dirname, "circuits", "keccakfRound20_test.circom"));
	await cir.loadConstraints();
	// console.log("n_constraints", cir.constraints.length);

	const input = utils.strsToBigInts(["26388279066651", "246290629787648",
	    "26388279902208", "25165850", "246290605457408", "7784628352",
	    "844424965783552", "2305843009213694083", "844432714760192",
	    "2305843009249345539", "637534226", "14848", "641204224", "14354",
	    "3670528", "6308236288", "2130304761856", "648518346341354496",
	    "6309216256", "648520476645130240", "4611706359392501763",
	    "792677514882318336", "20340965113972", "4611732197915754499",
	    "792633534417207412"]);
	const expectedOut = utils.strsToBigInts(["17728382861289829725",
	    "13654073086381141005", "9912591532945168756",
	    "2030068283137172501", "5084683018496047808", "151244976540463006",
	    "11718217461613725815", "11636071286320763433",
	    "15039144509240642782", "11629028282864249197",
	    "2594633730779457624", "14005558505838459171",
	    "4612881094252610438", "2828009553220809993",
	    "4838578484623267135", "1006588603063111352",
	    "11109191860075454495", "1187545859779038208",
	    "14661669042642437042", "5345317080454741069",
	    "8196674451365552863", "635818354583088260",
	    "13515759754032305626", "1708499319988748543",
	    "7509292798507899312"]);

	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("keccakf test", function () {
    this.timeout(100000);

    let cir;
    before(async () => {
	cir = await c_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);
    });

    it ("keccakf 1 (testvector generated from go)", async () => {
	const input =
	    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
	const expectedOut = utils.strsToBigInts(["9472389783892099349",
	    "2159377575142921216", "17826682512249813373",
	    "2325963263767348549", "15086930817298358378",
	    "11661812091723830419", "3517755057770134847",
	    "5223775837645169598", "933274647126506074", "3451250694486589320",
	    "825065683101361807", "6192414258352188799",
	    "14426505790672879210", "3326742392640380689",
	    "16749975585634164134", "17847697619892908514",
	    "11598434253200954839", "6049795840392747215",
	    "8610635351954084385", "18234131770974529925",
	    "15330347418010067760", "12047099911907354591",
	    "4763389569697138851", "6779624089296570504",
	    "15083668107635345971"]);

	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("keccakf 2 (testvector generated from go)", async () => {
	const input = utils.strsToBigInts(["9472389783892099349",
	    "2159377575142921216", "17826682512249813373",
	    "2325963263767348549", "15086930817298358378",
	    "11661812091723830419", "3517755057770134847",
	    "5223775837645169598", "933274647126506074", "3451250694486589320",
	    "825065683101361807", "6192414258352188799",
	    "14426505790672879210", "3326742392640380689",
	    "16749975585634164134", "17847697619892908514",
	    "11598434253200954839", "6049795840392747215",
	    "8610635351954084385", "18234131770974529925",
	    "15330347418010067760", "12047099911907354591",
	    "4763389569697138851", "6779624089296570504",
	    "15083668107635345971"]);
	const expectedOut = utils.strsToBigInts(["269318771259381490",
	    "15892848561416382510", "12485559500958802382",
	    "4360182510883008729", "14284025675983944434",
	    "8800366419087562177", "7881853509112258378",
	    "9503857914080778528", "17110477940977988953",
	    "13825318756568052601", "11460650932194163315",
	    "13272167288297399439", "13599957064256729412",
	    "12730838251751851758", "13736647180617564382",
	    "5651695613583298166", "15496251216716036782",
	    "9748494184433838858", "3637745438296580159",
	    "3821184813198767406", "15603239432236101315",
	    "3726326332491237029", "7819962668913661099",
	    "2285898735263816116", "13518516210247555620"]);

	const stateIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

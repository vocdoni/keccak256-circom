const path = require("path");

const chai = require("chai");
const assert = chai.assert;

const wasm_tester = require("circom_tester").wasm;
const c_tester = require("circom_tester").c;

const utils = require("./utils");

describe("Keccak-Pad test", function () {
    this.timeout(100000);

    it ("Pad (testvector generated from go)", async () => {
	const cir = await wasm_tester(path.join(__dirname, "circuits", "pad_test.circom"));

	const input =
	    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	const expectedOut = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
	    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
	    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128];

	const stateIn = utils.bytesToBits(input);

	const witness = await cir.calculateWitness({ "in": stateIn }, true);

	const stateOut = witness.slice(1, 1+(136*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
});

describe("absorb test", function () {
    this.timeout(100000);

    let cir;
    before(async () => {
	// const cir = await wasm_tester(path.join(__dirname, "circuits", "keccakf_test.circom"));
	cir = await c_tester(path.join(__dirname, "circuits", "absorb_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);
    });

    it ("absorb 1 (testvector generated from go)", async () => {
	const s = utils.strsToBigInts(["0", "1", "2", "3", "4", "5", "6", "7",
	    "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18",
	    "19", "20", "21", "22", "23", "24"]);

	const block = utils.strsToBigInts(["0", "1", "2", "3", "4", "5", "6",
	    "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",
	    "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
	    "28","29", "30", "31", "1", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "128"]);

	const expectedOut = utils.strsToBigInts(["8342348566319207042",
	    "319359607942176202", "14410076088654599075",
	    "15666111399434436772", "9558421567405313402",
	    "3396178318116504023", "794353847439963108",
	    "12717011319735989377", "3503398863218919239",
	    "5517201702366862678", "15999361614129160496",
	    "1325524015888689985", "11971708408118944333",
	    "14874486179441062217", "12554876384974234666",
	    "11129975558302206043", "11257826431949606534",
	    "2740710607956478714", "15000019752453010167",
	    "15593606854132419294",
	    "2598425978562809333","8872504799797239246", "1212062965004664308",
	    "5443427421087086722", "10946808592826700411"]);

	const sIn = utils.u64ArrayToBits(s);
	const blockIn = utils.bytesToBits(block);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "s": sIn, "block": blockIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("absorb 2 (testvector generated from go)", async () => {
	const s = utils.strsToBigInts(["8342348566319207042",
	    "319359607942176202", "14410076088654599075",
	    "15666111399434436772", "9558421567405313402",
	    "3396178318116504023", "794353847439963108",
	    "12717011319735989377", "3503398863218919239",
	    "5517201702366862678", "15999361614129160496",
	    "1325524015888689985", "11971708408118944333",
	    "14874486179441062217", "12554876384974234666",
	    "11129975558302206043", "11257826431949606534",
	    "2740710607956478714", "15000019752453010167",
	    "15593606854132419294",
	    "2598425978562809333","8872504799797239246", "1212062965004664308",
	    "5443427421087086722", "10946808592826700411"]);

	const block = utils.strsToBigInts(["0", "1", "2", "3", "4", "5", "6",
	    "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17",
	    "18", "19", "20", "21", "22", "23", "24", "25", "26", "27",
	    "28","29", "30", "31", "1", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0","0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
	    "0", "0", "0", "128"]);

	const expectedOut = utils.strsToBigInts(["8909243822027471379",
	    "1111840847970088140", "12093072708540612559",
	    "11255033638786021658", "2082116894939842214",
	    "12821085060245261575", "6901785969834988344",
	    "3182430130277914993", "2164708585929408975",
	    "14402143231999718904", "16231444410553803968",
	    "1850945423480060493", "12856855675247400303",
	    "1137248620532111171", "7389129221921446308",
	    "12932467982741614601", "1350606937385760406",
	    "10983682292859713641", "10305595434820307765",
	    "13958651111365489854", "17206620388135196198",
	    "4238113785249530092", "7230868147643218103", "603011106238724524",
	    "16480095441097880488"]);

	const sIn = utils.u64ArrayToBits(s);
	const blockIn = utils.bytesToBits(block);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "s": sIn, "block": blockIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Keccak-Final test", function () {
    this.timeout(100000);

    let cir;
    before(async () => {
	cir = await c_tester(path.join(__dirname, "circuits", "final_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);
    });

    it ("Final 1 (testvector generated from go)", async () => {
	const input =
	    [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
	const expectedOut = utils.strsToBigInts(["16953415415620100490",
	    "7495738965189503699", "12723370805759944158",
	    "3295955328722933810", "12121371508560456016",
	    "174876831679863147", "15944933357501475584",
	    "7502339663607726274", "12048918224562833898",
	    "16715284461100269102", "15582559130083209842",
	    "1743886467337678829", "2424196198791253761",
	    "1116417308245482383", "10367365997906434042",
	    "1849801549382613906", "13294939539683415102",
	    "4478091053375708790", "2969967870313332958",
	    "14618962068930014237", "2721742233407503451",
	    "12003265593030191290", "8109318293656735684",
	    "6346795302983965746", "12210038122000333046"]);

	const inIn = utils.bytesToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });

    it ("Final 2 (testvector generated from go)", async () => {
	const input = utils.strsToBigInts(["254", "254", "254", "254", "254",
	    "254", "254", "254", "254", "254", "254", "254", "254", "254",
	    "254", "254", "254", "254", "254", "254", "254", "254", "254",
	    "254", "254", "254", "254", "254", "254", "254", "254", "254"]);
	const expectedOut = utils.strsToBigInts(["16852464862333879129",
	    "9588646233186836430", "693207875935078627", "6545910230963382296",
	    "3599194178366828471", "13130606490077331384",
	    "10374798023615518933", "7285576075118720444",
	    "4097382401500492461", "3968685317688314807",
	    "3350659309646210303", "640023485234837464", "2550030127986774041",
	    "8948768022010378840", "10678227883444996205",
	    "1395278318096830339", "2744077813166753978",
	    "13362598477502046010", "14601579319881128511",
	    "4070707967569603186", "16833768365875755098",
	    "1486295134719870048", "9161068934282437999",
	    "8245604251371175619", "8421994351908003183"]);

	const inIn = utils.bytesToBits(input);
	const expectedOutBits = utils.u64ArrayToBits(expectedOut);

	const witness = await cir.calculateWitness({ "in": inIn }, true);

	const stateOut = witness.slice(1, 1+(25*64));
	const stateOutU64 = utils.bitsToU64Array(stateOut);
	// console.log(stateOutU64, expectedOut);
	assert.deepEqual(stateOutU64, expectedOut);
    });
});

describe("Keccak-Squeeze test", function () {
    this.timeout(100000);

    let cir;
    before(async () => {
	cir = await c_tester(path.join(__dirname, "circuits", "squeeze_test.circom"));
	await cir.loadConstraints();
	console.log("n_constraints", cir.constraints.length);
    });

    it ("Squeeze 1 (testvector generated from go)", async () => {
	const input = utils.strsToBigInts(["16852464862333879129",
	    "9588646233186836430", "693207875935078627", "6545910230963382296",
	    "3599194178366828471", "13130606490077331384",
	    "10374798023615518933", "7285576075118720444",
	    "4097382401500492461", "3968685317688314807",
	    "3350659309646210303", "640023485234837464", "2550030127986774041",
	    "8948768022010378840", "10678227883444996205",
	    "1395278318096830339", "2744077813166753978",
	    "13362598477502046010", "14601579319881128511",
	    "4070707967569603186", "16833768365875755098",
	    "1486295134719870048", "9161068934282437999",
	    "8245604251371175619", "8421994351908003183"]);

	const expectedOut = [89, 195, 41, 13, 129, 251, 223, 233, 206, 31, 253,
	    61, 242, 182, 17, 133, 227, 8, 157, 240, 227, 196, 158, 9, 24, 232,
	    42, 96, 172, 190, 215, 90];

	const inIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.bytesToBits(expectedOut);

	const witness = await cir.calculateWitness({ "s": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
    it ("Squeeze 2 (testvector generated from go)", async () => {
	const input = utils.strsToBigInts(["16953415415620100490",
	    "7495738965189503699", "12723370805759944158",
	    "3295955328722933810", "12121371508560456016",
	    "174876831679863147", "15944933357501475584",
	    "7502339663607726274", "12048918224562833898",
	    "16715284461100269102", "15582559130083209842",
	    "1743886467337678829", "2424196198791253761",
	    "1116417308245482383", "10367365997906434042",
	    "1849801549382613906", "13294939539683415102",
	    "4478091053375708790", "2969967870313332958",
	    "14618962068930014237", "2721742233407503451",
	    "12003265593030191290", "8109318293656735684",
	    "6346795302983965746", "12210038122000333046"]);

	const expectedOut = [138, 225, 170, 89, 127, 161, 70, 235, 211, 170,
	    44, 237, 223, 54, 6, 104, 222, 165, 229, 38, 86, 126, 146, 176, 50,
	    24, 22, 164, 232, 149, 189, 45];

	const inIn = utils.u64ArrayToBits(input);
	const expectedOutBits = utils.bytesToBits(expectedOut);

	const witness = await cir.calculateWitness({ "s": inIn }, true);

	const stateOut = witness.slice(1, 1+(32*8));
	const stateOutBytes = utils.bitsToBytes(stateOut);
	// console.log(stateOutBytes, expectedOut);
	assert.deepEqual(stateOutBytes, expectedOut);
    });
});

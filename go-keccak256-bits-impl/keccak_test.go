package keccak

import (
	"encoding/hex"
	"fmt"
	"testing"

	"github.com/ethereum/go-ethereum/crypto"
	qt "github.com/frankban/quicktest"
)

func TestKeccak(t *testing.T) {
	testKeccak(t, []byte("test"), "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658")
	testKeccak(t, make([]byte, 32), "290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563")
	testKeccak(t, make([]byte, 100), "913fb9e1f6f1c6d910fd574a5cad8857aa43bfba24e401ada4f56090d4d997a7")
}

func testKeccak(t *testing.T, input []byte, expectedHex string) {
	expected := crypto.Keccak256(input)

	hBits := ComputeKeccak(bytesToBits(input))
	h := bitsToBytes(hBits)

	qt.Assert(t, h, qt.DeepEquals, expected)
	qt.Assert(t, hex.EncodeToString(h), qt.Equals, expectedHex)
}

func TestPad(t *testing.T) {
	b := make([]byte, 32)
	for i := 0; i < len(b); i++ {
		b[i] = byte(i)
	}
	fmt.Println(b)
	bBits := bytesToBits(b)
	fBits := pad(bBits)

	qt.Assert(t, bitsToBytes(fBits[:]), qt.DeepEquals,
		[]byte{0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128})
}

func TestFinal(t *testing.T) {
	b := make([]byte, 32)
	for i := 0; i < len(b); i++ {
		b[i] = byte(i)
	}
	fmt.Println(b)
	bBits := bytesToBits(b)
	fBits := final(bBits)

	qt.Assert(t, bitsToU64Array(fBits[:]), qt.DeepEquals,
		[]uint64{16953415415620100490, 7495738965189503699, 12723370805759944158, 3295955328722933810, 12121371508560456016, 174876831679863147, 15944933357501475584, 7502339663607726274, 12048918224562833898, 16715284461100269102, 15582559130083209842, 1743886467337678829, 2424196198791253761, 1116417308245482383, 10367365997906434042, 1849801549382613906, 13294939539683415102, 4478091053375708790, 2969967870313332958, 14618962068930014237, 2721742233407503451, 12003265593030191290, 8109318293656735684, 6346795302983965746, 12210038122000333046})
}

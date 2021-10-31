package keccak

import (
	"encoding/hex"
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

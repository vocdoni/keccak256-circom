package keccak

import (
	"encoding/json"
	"fmt"
	"testing"

	qt "github.com/frankban/quicktest"
)

func printS(n string, s []uint64) {
	jS, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}
	fmt.Printf("%s: %s\n", n, string(jS))
}
func newS() ([25 * 64]bool, [25]uint64) {
	var s [25 * 64]bool
	var sU64 [25]uint64
	for i := 0; i < len(s)/64; i++ {
		copy(s[i*64:i*64+64], u64ToBits(uint64(i)))
		sU64[i] = uint64(i)
	}
	return s, sU64
}

func TestTheta(t *testing.T) {
	s, sU64 := newS()

	s = theta(s)
	sU64 = thetaU64Version(sU64)

	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals,
		[]uint64{26, 9, 13, 29, 47, 31, 14, 8, 22, 34, 16, 3, 3,
			19, 37, 21, 24, 30, 12, 56, 14, 29, 25, 9, 51})

	// compute again theta on the current state
	s = theta(s)
	sU64 = thetaU64Version(sU64)
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
}

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

func TestRhoPi(t *testing.T) {
	s, sU64 := newS()

	s = rhopi(s)
	sU64 = rhopiU64Version(sU64)

	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals,
		[]uint64{0, 105553116266496, 105553116266496, 37748736, 393216,
			805306368, 9437184, 80, 562949953421312, 13835058055282163714,
			2, 448, 436207616, 4864, 5242880, 536870912, 343597383680,
			11264, 557056, 1657324662872342528, 9223372036854775808,
			288230376151711744, 7696581394432, 32985348833280, 84})

	// compute again rhopi on the current state
	s = rhopi(s)
	sU64 = rhopiU64Version(sU64)
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
}

func TestChi(t *testing.T) {
	s, sU64 := newS()

	s = chi(s)
	sU64 = chiU64Version(sU64)

	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals,
		[]uint64{2, 0, 6, 3, 5, 4, 14, 6, 12, 11, 14, 10, 14, 13, 15,
			14, 18, 16, 30, 3, 22, 20, 30, 19, 25})

	// compute again theta on the current state
	s = rhopi(s)
	sU64 = rhopiU64Version(sU64)
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	s = chi(s)
	sU64 = chiU64Version(sU64)
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
}

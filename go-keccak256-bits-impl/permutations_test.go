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

func TestTheta2(t *testing.T) {
	input := []uint64{26388279066651, 246290629787648, 26388279902208, 25165850, 246290605457408, 7784628352, 844424965783552, 2305843009213694083, 844432714760192, 2305843009249345539, 637534226, 14848, 641204224, 14354, 3670528, 6308236288, 2130304761856, 648518346341354496, 6309216256, 648520476645130240, 4611706359392501763, 792677514882318336, 20340965113972, 4611732197915754499, 792633534417207412}
	var s [25 * 64]bool
	var sU64 [25]uint64
	copy(s[:], u64ArrayToBits(input))
	copy(sU64[:], input)

	s = theta(s)
	sU64 = thetaU64Version(sU64)

	// fmt.Println(bitsToU64Array(s[:]))
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals,
		[]uint64{3749081831850030700, 1297317621190464868, 10017560217643747862, 7854780639862409219, 13836147678645575967, 3749090635727681271, 1297915755455157604, 12323429615135705749, 7855062122598582297, 16141814766035214620, 3749090628446369381, 1297071330560683876, 10017586606556924438, 7854780639837253643, 13835971756788491039, 3749090634251287159, 1297070162329376100, 9369068259580659222, 7854780645071013913, 14484490034407743775, 8360757404916954740, 1801500877105239396, 10017570663003408994, 3243123208712177690, 14628605291203076459})
	// fmt.Println(bitsToU64(s[1*64:2*64]), s[1*64:2*64])

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

func TestIota(t *testing.T) {
	s, sU64 := newS()

	s = iot(s, 3)
	sU64 = iotU64Version(sU64, 3)

	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
	qt.Assert(t, bitsToU64(s[0:64]), qt.Equals, uint64(9223372039002292224))

	// compute again theta on the current state
	s = iot(s, 10)
	sU64 = iotU64Version(sU64, 10)
	qt.Assert(t, bitsToU64Array(s[:]), qt.DeepEquals, sU64[:])
}

package keccak

import (
	"encoding/binary"
	"testing"

	qt "github.com/frankban/quicktest"
)

func TestUtilsBytesToBool(t *testing.T) {
	b := []byte{0, 1, 2, 3, 255, 254, 253}
	bits := bytesToBits(b)
	// for i := 0; i < len(b); i++ {
	//         fmt.Println(i*8, i*8+8, b[i], bits[i*8:i*8+8])
	// }
	qt.Assert(t, bits[0:8], qt.DeepEquals,
		[]bool{false, false, false, false, false, false, false, false})
	qt.Assert(t, bits[8:16], qt.DeepEquals,
		[]bool{true, false, false, false, false, false, false, false})
	qt.Assert(t, bits[16:24], qt.DeepEquals,
		[]bool{false, true, false, false, false, false, false, false})
	qt.Assert(t, bits[24:32], qt.DeepEquals,
		[]bool{true, true, false, false, false, false, false, false})
	qt.Assert(t, bits[32:40], qt.DeepEquals,
		[]bool{true, true, true, true, true, true, true, true})
	qt.Assert(t, bits[40:48], qt.DeepEquals,
		[]bool{false, true, true, true, true, true, true, true})
	qt.Assert(t, bits[48:56], qt.DeepEquals,
		[]bool{true, false, true, true, true, true, true, true})
}

func TestUtilsBitsToBytes(t *testing.T) {
	b := []byte{0, 1, 2, 3, 255, 254, 253}
	bits := bytesToBits(b)
	b2 := bitsToBytes(bits)
	qt.Assert(t, b2, qt.DeepEquals, b)
}

func TestUtilsU64(t *testing.T) {
	u := uint64(100)
	b := make([]byte, 8)
	binary.LittleEndian.PutUint64(b, u)

	// toUint64
	// with bytes
	uRes := bytesToU64(b)
	qt.Assert(t, uRes, qt.Equals, u)

	// with bits
	uRes = bitsToU64(bytesToBits(b))
	qt.Assert(t, uRes, qt.Equals, u)

	// fromUint64
	// with bytes
	bRes := u64ToBytes(u)
	qt.Assert(t, bRes, qt.DeepEquals, b)

	// with bits
	bResBits := u64ToBits(u)
	qt.Assert(t, bResBits, qt.DeepEquals, bytesToBits(b))
}

func TestUtilsLeftShift(t *testing.T) {
	u := uint64(2)
	bits := u64ToBits(u)
	r := leftShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u<<1)

	u = uint64(9)
	bits = u64ToBits(u)
	r = leftShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u<<1)

	u = uint64(14)
	bits = u64ToBits(u)
	r = leftShift(bits, 63)
	qt.Assert(t, bitsToU64(r), qt.Equals, u<<63)

	u = uint64(123456)
	bits = u64ToBits(u)
	r = leftShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u<<1)
}
func TestUtilsRightShift(t *testing.T) {
	u := uint64(2)
	bits := u64ToBits(u)
	r := rightShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u>>1)

	u = uint64(9)
	bits = u64ToBits(u)
	r = rightShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u>>1)

	u = uint64(14)
	bits = u64ToBits(u)
	r = rightShift(bits, 63)
	qt.Assert(t, bitsToU64(r), qt.Equals, u>>63)

	u = uint64(123456)
	bits = u64ToBits(u)
	r = rightShift(bits, 1)
	qt.Assert(t, bitsToU64(r), qt.Equals, u>>1)
}

package keccak

import (
	"encoding/binary"
	"fmt"
	"math"
)

func bytesToU64(v []byte) uint64 {
	return uint64(v[0]) |
		uint64(v[1])<<8 |
		uint64(v[2])<<16 |
		uint64(v[3])<<24 |
		uint64(v[4])<<32 |
		uint64(v[5])<<40 |
		uint64(v[6])<<48 |
		uint64(v[7])<<56
}
func u64ToBytes(x uint64) []byte {
	v := make([]byte, 8)
	v[0] = byte(x)
	v[1] = byte(x >> 8)
	v[2] = byte(x >> 16)
	v[3] = byte(x >> 24)
	v[4] = byte(x >> 32)
	v[5] = byte(x >> 40)
	v[6] = byte(x >> 48)
	v[7] = byte(x >> 56)
	return v
}

func bitsToU64Array(b []bool) []uint64 {
	r := make([]uint64, len(b)/64)
	for i := 0; i < len(b)/64; i++ {
		r[i] = bitsToU64(b[i*64 : i*64+64])
	}
	return r
}
func u64ArrayToBits(u []uint64) []bool {
	r := make([]bool, len(u)*64)
	for i := 0; i < len(u); i++ {
		copy(r[i*64:i*64+64], u64ToBits(u[i]))
	}
	return r
}
func bitsToU64(b []bool) uint64 {
	if len(b) != 64 {
		panic(fmt.Errorf("len(b)=%d, max=64", len(b)))
	}
	by := bitsToBytes(b)
	return binary.LittleEndian.Uint64(by)
}
func u64ToBits(u uint64) []bool {
	by := u64ToBytes(u)
	return bytesToBits(by)
}
func byteToBits(b byte) []bool {
	var bits []bool
	for j := 0; j < 8; j++ {
		bits = append(bits, b&(1<<j) > 0)
	}
	return bits
}
func bytesToBits(b []byte) []bool {
	var bits []bool
	for i := 0; i < len(b); i++ {
		for j := 0; j < 8; j++ {
			bits = append(bits, b[i]&(1<<j) > 0)
		}
	}
	return bits
}
func bitsToBytes(bits []bool) []byte {
	bytesLen := int(math.Ceil(float64(len(bits)) / 8))
	b := make([]byte, bytesLen)
	for i := 0; i < len(bits); i++ {
		if bits[i] {
			b[i/8] |= 1 << (i % 8)
		}
	}
	return b
}

func leftShift(a []bool, n int) []bool {
	c := make([]bool, len(a))
	copy(c[n:], a[:])
	// c[0] = a[0]
	// for i := 1; i < len(a); i++ {
	//         if i < n {
	//                 c[i] = a[i]
	//         } else {
	//                 c[i] = a[i-1]
	//         }
	// }
	return c
}

func rightShift(a []bool, n int) []bool {
	c := make([]bool, len(a))
	copy(c[:], a[n:])
	// for i := len(a) - 1 - n; i >= 0; i-- {
	//         c[i] = a[i+1]
	// }
	return c
}

// TODO add unit tests
func xorSingle(a []bool) []bool {
	c := make([]bool, len(a))
	for i := 0; i < len(a); i++ {
		c[i] = !a[i]
	}
	return c
}
func xor(a, b []bool) []bool {
	c := make([]bool, len(a))
	for i := 0; i < len(a); i++ {
		if a[i] != b[i] { // XOR
			c[i] = true
		}
	}
	return c
}
func or(a, b []bool) []bool {
	c := make([]bool, len(a))
	for i := 0; i < len(a); i++ {
		if a[i] == false && b[i] == false { // OR
			c[i] = false
		} else {
			c[i] = true
		}
	}
	return c
}
func and(a, b []bool) []bool {
	c := make([]bool, len(a))
	for i := 0; i < len(a); i++ {
		if a[i] == true && b[i] == true {
			c[i] = true
		}
	}
	return c
}

package keccak

import "fmt"

var roundConstantsU64 = []uint64{
	0x0000000000000001, 0x0000000000008082, 0x800000000000808A,
	0x8000000080008000, 0x000000000000808B, 0x0000000080000001,
	0x8000000080008081, 0x8000000000008009, 0x000000000000008A,
	0x0000000000000088, 0x0000000080008009, 0x000000008000000A,
	0x000000008000808B, 0x800000000000008B, 0x8000000000008089,
	0x8000000000008003, 0x8000000000008002, 0x8000000000000080,
	0x000000000000800A, 0x800000008000000A, 0x8000000080008081,
	0x8000000000008080, 0x0000000080000001, 0x8000000080008008,
}

var roundConstants = u64ArrayToBits(roundConstantsU64)

const (
	rounds    = 24
	size      = 32
	blockSize = 136
	domain    = 0x01
)

func ComputeKeccak(b []bool) []bool {
	if len(b) >= blockSize*8 {
		// TODO absorb
	}
	s := final(b)
	b = squeeze(s)

	return b
}

func final(b []bool) [25 * 64]bool {
	last := pad(b)
	var s [25 * 64]bool
	s = absorb(s, last)
	return s
}
func pad(b []bool) []bool {
	padded := make([]bool, blockSize*8)
	copy(padded, b)
	copy(padded[len(b):len(b)+8], byteToBits(domain))
	copy(padded[(len(padded)-8):],
		or(padded[(len(padded)-8):], byteToBits(0x80)))
	return padded
}
func absorb(s [25 * 64]bool, block []bool) [25 * 64]bool {
	if len(block) != blockSize*8 {
		panic(fmt.Errorf("absorb: invalid block size: %d, expected: %d",
			len(block), blockSize*8))
	}

	for i := 0; i < blockSize/8; i++ {
		copy(s[i*64:i*64+64], xor(s[i*64:i*64+64], block[i*64:i*64+64]))
	}
	newS := keccakf(s)
	return newS
}

func squeeze(s [25 * 64]bool) []bool {
	b := make([]bool, 8*8*len(s))
	n := size * 8
	for i := 0; i < len(s)/64; i++ {
		copy(b[i*8*8:i*8*8+64], s[i*64:i*64+64])
	}
	return b[:n]
}

func keccakf(s [25 * 64]bool) [25 * 64]bool {
	for r := 0; r < rounds; r++ {
		s = theta(s)
		s = rhopi(s)
		s = chi(s)
		s = iot(s, r)
	}
	return s
}

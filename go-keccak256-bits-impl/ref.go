/*
This file contains the byte & uint64 implementations that are used as reference
to test the bits implementations of the other files.
The methods in this file are modifyied versions of methods from: https://github.com/ebfe/keccak
*/
package keccak

func thetaU64Version(a [25]uint64) [25]uint64 {
	var c0, c1, c2, c3, c4, d uint64
	var r [25]uint64
	c0 = a[0] ^ a[5] ^ a[10] ^ a[15] ^ a[20]
	c1 = a[1] ^ a[6] ^ a[11] ^ a[16] ^ a[21]
	c2 = a[2] ^ a[7] ^ a[12] ^ a[17] ^ a[22]
	c3 = a[3] ^ a[8] ^ a[13] ^ a[18] ^ a[23]
	c4 = a[4] ^ a[9] ^ a[14] ^ a[19] ^ a[24]

	d = c4 ^ (c1<<1 | c1>>(64-1))
	r[0] = a[0] ^ d
	r[5] = a[5] ^ d
	r[10] = a[10] ^ d
	r[15] = a[15] ^ d
	r[20] = a[20] ^ d

	d = c0 ^ (c2<<1 | c2>>(64-1))
	r[1] = a[1] ^ d
	r[6] = a[6] ^ d
	r[11] = a[11] ^ d
	r[16] = a[16] ^ d
	r[21] = a[21] ^ d

	d = c1 ^ (c3<<1 | c3>>(64-1))
	r[2] = a[2] ^ d
	r[7] = a[7] ^ d
	r[12] = a[12] ^ d
	r[17] = a[17] ^ d
	r[22] = a[22] ^ d

	d = c2 ^ (c4<<1 | c4>>(64-1))
	r[3] = a[3] ^ d
	r[8] = a[8] ^ d
	r[13] = a[13] ^ d
	r[18] = a[18] ^ d
	r[23] = a[23] ^ d

	d = c3 ^ (c0<<1 | c0>>(64-1))
	r[4] = a[4] ^ d
	r[9] = a[9] ^ d
	r[14] = a[14] ^ d
	r[19] = a[19] ^ d
	r[24] = a[24] ^ d
	return r
}

func rhopiU64Version(a [25]uint64) [25]uint64 {
	var t uint64
	t = a[1]
	t, a[10] = a[10], t<<1|t>>(64-1)
	t, a[7] = a[7], t<<3|t>>(64-3)
	t, a[11] = a[11], t<<6|t>>(64-6)
	t, a[17] = a[17], t<<10|t>>(64-10)
	t, a[18] = a[18], t<<15|t>>(64-15)
	t, a[3] = a[3], t<<21|t>>(64-21)
	t, a[5] = a[5], t<<28|t>>(64-28)
	t, a[16] = a[16], t<<36|t>>(64-36)
	t, a[8] = a[8], t<<45|t>>(64-45)
	t, a[21] = a[21], t<<55|t>>(64-55)
	t, a[24] = a[24], t<<2|t>>(64-2)
	t, a[4] = a[4], t<<14|t>>(64-14)
	t, a[15] = a[15], t<<27|t>>(64-27)
	t, a[23] = a[23], t<<41|t>>(64-41)
	t, a[19] = a[19], t<<56|t>>(64-56)
	t, a[13] = a[13], t<<8|t>>(64-8)
	t, a[12] = a[12], t<<25|t>>(64-25)
	t, a[2] = a[2], t<<43|t>>(64-43)
	t, a[20] = a[20], t<<62|t>>(64-62)
	t, a[14] = a[14], t<<18|t>>(64-18)
	t, a[22] = a[22], t<<39|t>>(64-39)
	t, a[9] = a[9], t<<61|t>>(64-61)
	t, a[6] = a[6], t<<20|t>>(64-20)
	a[1] = t<<44 | t>>(64-44)
	return a
}

func chiU64Version(a [25]uint64) [25]uint64 {
	var bc0, bc1, bc2, bc3, bc4 uint64
	bc0 = a[0]
	bc1 = a[1]
	bc2 = a[2]
	bc3 = a[3]
	bc4 = a[4]
	a[0] ^= (^bc1) & bc2
	a[1] ^= (^bc2) & bc3
	a[2] ^= (^bc3) & bc4
	a[3] ^= (^bc4) & bc0
	a[4] ^= (^bc0) & bc1
	bc0 = a[5]
	bc1 = a[6]
	bc2 = a[7]
	bc3 = a[8]
	bc4 = a[9]
	a[5] ^= (^bc1) & bc2
	a[6] ^= (^bc2) & bc3
	a[7] ^= (^bc3) & bc4
	a[8] ^= (^bc4) & bc0
	a[9] ^= (^bc0) & bc1
	bc0 = a[10]
	bc1 = a[11]
	bc2 = a[12]
	bc3 = a[13]
	bc4 = a[14]
	a[10] ^= (^bc1) & bc2
	a[11] ^= (^bc2) & bc3
	a[12] ^= (^bc3) & bc4
	a[13] ^= (^bc4) & bc0
	a[14] ^= (^bc0) & bc1
	bc0 = a[15]
	bc1 = a[16]
	bc2 = a[17]
	bc3 = a[18]
	bc4 = a[19]
	a[15] ^= (^bc1) & bc2
	a[16] ^= (^bc2) & bc3
	a[17] ^= (^bc3) & bc4
	a[18] ^= (^bc4) & bc0
	a[19] ^= (^bc0) & bc1
	bc0 = a[20]
	bc1 = a[21]
	bc2 = a[22]
	bc3 = a[23]
	bc4 = a[24]
	a[20] ^= (^bc1) & bc2
	a[21] ^= (^bc2) & bc3
	a[22] ^= (^bc3) & bc4
	a[23] ^= (^bc4) & bc0
	a[24] ^= (^bc0) & bc1
	return a
}

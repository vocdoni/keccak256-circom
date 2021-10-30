/*
This file contains the byte & uint64 implementations that are used to test the
bits implementations.
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

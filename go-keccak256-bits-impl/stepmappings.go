package keccak

func theta(a [25 * 64]bool) [25 * 64]bool {
	var c0, c1, c2, c3, c4, d [64]bool
	var r [25 * 64]bool

	copy(c0[:], xor(xor(xor(xor(a[0:1*64], a[5*64:6*64]), a[10*64:11*64]), a[15*64:16*64]), a[20*64:21*64]))
	copy(c1[:], xor(xor(xor(xor(a[1*64:2*64], a[6*64:7*64]), a[11*64:12*64]), a[16*64:17*64]), a[21*64:22*64]))
	copy(c2[:], xor(xor(xor(xor(a[2*64:3*64], a[7*64:8*64]), a[12*64:13*64]), a[17*64:18*64]), a[22*64:23*64]))
	copy(c3[:], xor(xor(xor(xor(a[3*64:4*64], a[8*64:9*64]), a[13*64:14*64]), a[18*64:19*64]), a[23*64:24*64]))
	copy(c4[:], xor(xor(xor(xor(a[4*64:5*64], a[9*64:10*64]), a[14*64:15*64]), a[19*64:20*64]), a[24*64:25*64]))

	copy(d[:], xor(c4[:], or(leftShift(c1[:], 1), rightShift(c1[:], (64-1)))))
	copy(r[0:1*64], xor(a[0:1*64], d[:]))
	copy(r[5*64:6*64], xor(a[5*64:6*64], d[:]))
	copy(r[10*64:11*64], xor(a[10*64:11*64], d[:]))
	copy(r[15*64:16*64], xor(a[15*64:16*64], d[:]))
	copy(r[20*64:21*64], xor(a[20*64:21*64], d[:]))

	copy(d[:], xor(c0[:], or(leftShift(c2[:], 1), rightShift(c2[:], (64-1)))))
	copy(r[1*64:2*64], xor(a[1*64:2*64], d[:]))
	copy(r[6*64:7*64], xor(a[6*64:7*64], d[:]))
	copy(r[11*64:12*64], xor(a[11*64:12*64], d[:]))
	copy(r[16*64:17*64], xor(a[16*64:17*64], d[:]))
	copy(r[21*64:22*64], xor(a[21*64:22*64], d[:]))

	copy(d[:], xor(c1[:], or(leftShift(c3[:], 1), rightShift(c3[:], (64-1)))))
	copy(r[2*64:3*64], xor(a[2*64:3*64], d[:]))
	copy(r[7*64:8*64], xor(a[7*64:8*64], d[:]))
	copy(r[12*64:13*64], xor(a[12*64:13*64], d[:]))
	copy(r[17*64:18*64], xor(a[17*64:18*64], d[:]))
	copy(r[22*64:23*64], xor(a[22*64:23*64], d[:]))

	copy(d[:], xor(c2[:], or(leftShift(c4[:], 1), rightShift(c4[:], (64-1)))))
	copy(r[3*64:4*64], xor(a[3*64:4*64], d[:]))
	copy(r[8*64:9*64], xor(a[8*64:9*64], d[:]))
	copy(r[13*64:14*64], xor(a[13*64:14*64], d[:]))
	copy(r[18*64:19*64], xor(a[18*64:19*64], d[:]))
	copy(r[23*64:24*64], xor(a[23*64:24*64], d[:]))

	copy(d[:], xor(c3[:], or(leftShift(c0[:], 1), rightShift(c0[:], (64-1)))))
	copy(r[4*64:5*64], xor(a[4*64:5*64], d[:]))
	copy(r[9*64:10*64], xor(a[9*64:10*64], d[:]))
	copy(r[14*64:15*64], xor(a[14*64:15*64], d[:]))
	copy(r[19*64:20*64], xor(a[19*64:20*64], d[:]))
	copy(r[24*64:25*64], xor(a[24*64:25*64], d[:]))
	return r
}

func rhopi(a [25 * 64]bool) [25 * 64]bool {
	var r [25 * 64]bool

	copy(r[0:1*64], a[0:1*64])

	copy(r[10*64:11*64], or(leftShift(a[1*64:2*64], 1), rightShift(a[1*64:2*64], 64-1)))

	copy(r[7*64:8*64], or(leftShift(a[10*64:11*64], 3), rightShift(a[10*64:11*64], 64-3)))

	copy(r[11*64:12*64], or(leftShift(a[7*64:8*64], 6), rightShift(a[7*64:8*64], 64-6)))

	copy(r[17*64:18*64], or(leftShift(a[11*64:12*64], 10), rightShift(a[11*64:12*64], 64-10)))

	copy(r[18*64:19*64], or(leftShift(a[17*64:18*64], 15), rightShift(a[17*64:18*64], 64-15)))

	copy(r[3*64:4*64], or(leftShift(a[18*64:19*64], 21), rightShift(a[18*64:19*64], 64-21)))

	copy(r[5*64:6*64], or(leftShift(a[3*64:4*64], 28), rightShift(a[3*64:4*64], 64-28)))

	copy(r[16*64:17*64], or(leftShift(a[5*64:6*64], 36), rightShift(a[5*64:6*64], 64-36)))

	copy(r[8*64:9*64], or(leftShift(a[16*64:17*64], 45), rightShift(a[16*64:17*64], 64-45)))

	copy(r[21*64:22*64], or(leftShift(a[8*64:9*64], 55), rightShift(a[8*64:9*64], 64-55)))

	copy(r[24*64:25*64], or(leftShift(a[21*64:22*64], 2), rightShift(a[21*64:22*64], 64-2)))

	copy(r[4*64:5*64], or(leftShift(a[24*64:25*64], 14), rightShift(a[24*64:25*64], 64-14)))

	copy(r[15*64:16*64], or(leftShift(a[4*64:5*64], 27), rightShift(a[4*64:5*64], 64-27)))

	copy(r[23*64:24*64], or(leftShift(a[15*64:16*64], 41), rightShift(a[15*64:16*64], 64-41)))

	copy(r[19*64:20*64], or(leftShift(a[23*64:24*64], 56), rightShift(a[23*64:24*64], 64-56)))

	copy(r[13*64:14*64], or(leftShift(a[19*64:20*64], 8), rightShift(a[19*64:20*64], 64-8)))

	copy(r[12*64:13*64], or(leftShift(a[13*64:14*64], 25), rightShift(a[13*64:14*64], 64-25)))

	copy(r[2*64:3*64], or(leftShift(a[12*64:13*64], 43), rightShift(a[12*64:13*64], 64-43)))

	copy(r[20*64:21*64], or(leftShift(a[2*64:3*64], 62), rightShift(a[2*64:3*64], 64-62)))

	copy(r[14*64:15*64], or(leftShift(a[20*64:21*64], 18), rightShift(a[20*64:21*64], 64-18)))

	copy(r[22*64:23*64], or(leftShift(a[14*64:15*64], 39), rightShift(a[14*64:15*64], 64-39)))

	copy(r[9*64:10*64], or(leftShift(a[22*64:23*64], 61), rightShift(a[22*64:23*64], 64-61)))

	copy(r[6*64:7*64], or(leftShift(a[9*64:10*64], 20), rightShift(a[9*64:10*64], 64-20)))

	copy(r[1*64:2*64], or(leftShift(a[6*64:7*64], 44), rightShift(a[6*64:7*64], 64-44)))
	return r
}

func chi(a [25 * 64]bool) [25 * 64]bool {
	var r [25 * 64]bool

	copy(r[0:1*64], xor(a[0:1*64], and(xorSingle(a[1*64:2*64]), a[2*64:3*64])))
	copy(r[1*64:2*64], xor(a[1*64:2*64], and(xorSingle(a[2*64:3*64]), a[3*64:4*64])))
	copy(r[2*64:3*64], xor(a[2*64:3*64], and(xorSingle(a[3*64:4*64]), a[4*64:5*64])))
	copy(r[3*64:4*64], xor(a[3*64:4*64], and(xorSingle(a[4*64:5*64]), a[0:1*64])))
	copy(r[4*64:5*64], xor(a[4*64:5*64], and(xorSingle(a[0:1*64]), a[1*64:2*64])))

	copy(r[5*64:6*64], xor(a[5*64:6*64], and(xorSingle(a[6*64:7*64]), a[7*64:8*64])))
	copy(r[6*64:7*64], xor(a[6*64:7*64], and(xorSingle(a[7*64:8*64]), a[8*64:9*64])))
	copy(r[7*64:8*64], xor(a[7*64:8*64], and(xorSingle(a[8*64:9*64]), a[9*64:10*64])))
	copy(r[8*64:9*64], xor(a[8*64:9*64], and(xorSingle(a[9*64:10*64]), a[5*64:6*64])))
	copy(r[9*64:10*64], xor(a[9*64:10*64], and(xorSingle(a[5*64:6*64]), a[6*64:7*64])))

	copy(r[10*64:11*64], xor(a[10*64:11*64], and(xorSingle(a[11*64:12*64]), a[12*64:13*64])))
	copy(r[11*64:12*64], xor(a[11*64:12*64], and(xorSingle(a[12*64:13*64]), a[13*64:14*64])))
	copy(r[12*64:13*64], xor(a[12*64:13*64], and(xorSingle(a[13*64:14*64]), a[14*64:15*64])))
	copy(r[13*64:14*64], xor(a[13*64:14*64], and(xorSingle(a[14*64:15*64]), a[10*64:11*64])))
	copy(r[14*64:15*64], xor(a[14*64:15*64], and(xorSingle(a[10*64:11*64]), a[11*64:12*64])))

	copy(r[15*64:16*64], xor(a[15*64:16*64], and(xorSingle(a[16*64:17*64]), a[17*64:18*64])))
	copy(r[16*64:17*64], xor(a[16*64:17*64], and(xorSingle(a[17*64:18*64]), a[18*64:19*64])))
	copy(r[17*64:18*64], xor(a[17*64:18*64], and(xorSingle(a[18*64:19*64]), a[19*64:20*64])))
	copy(r[18*64:19*64], xor(a[18*64:19*64], and(xorSingle(a[19*64:20*64]), a[15*64:16*64])))
	copy(r[19*64:20*64], xor(a[19*64:20*64], and(xorSingle(a[15*64:16*64]), a[16*64:17*64])))

	copy(r[20*64:21*64], xor(a[20*64:21*64], and(xorSingle(a[21*64:22*64]), a[22*64:23*64])))
	copy(r[21*64:22*64], xor(a[21*64:22*64], and(xorSingle(a[22*64:23*64]), a[23*64:24*64])))
	copy(r[22*64:23*64], xor(a[22*64:23*64], and(xorSingle(a[23*64:24*64]), a[24*64:25*64])))
	copy(r[23*64:24*64], xor(a[23*64:24*64], and(xorSingle(a[24*64:25*64]), a[20*64:21*64])))
	copy(r[24*64:25*64], xor(a[24*64:25*64], and(xorSingle(a[20*64:21*64]), a[21*64:22*64])))
	return r
}

func iot(a [25 * 64]bool, r int) [25 * 64]bool {
	// iota
	copy(a[0:64], xor(a[0:64], roundConstants[r*64:r*64+64]))
	return a
}

pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/gates.circom";
include "../node_modules/circomlib/circuits/sha256/xor3.circom";
include "../node_modules/circomlib/circuits/sha256/shift.circom"; // contains ShiftRight

template Xor5(n) {
    signal input a[n];
    signal input b[n];
    signal input c[n];
    signal input d[n];
    signal input e[n];
    signal output out[n];
    var i;
    
    component xor3 = Xor3(n);
    for (i=0; i<n; i++) {
        xor3.a[i] <== a[i];
        xor3.b[i] <== b[i];
        xor3.c[i] <== c[i];
    }
    component xor4 = XorArray(n);
    for (i=0; i<n; i++) {
        xor4.a[i] <== xor3.out[i];
        xor4.b[i] <== d[i];
    }
    component xor5 = XorArray(n);
    for (i=0; i<n; i++) {
        xor5.a[i] <== xor4.out[i];
        xor5.b[i] <== e[i];
    }
    for (i=0; i<n; i++) {
        out[i] <== xor5.out[i];
    }
}
template XorArray(n) {
    signal input a[n];
    signal input b[n];
    signal output out[n];
    var i;

    component aux[n];
    for (i=0; i<n; i++) {
        aux[i] = XOR();
        aux[i].a <== a[i];
        aux[i].b <== b[i];
    }
    for (i=0; i<n; i++) {
        out[i] <== aux[i].out;
    }
}

template ShL(n, r) {
    signal input in[n];
    signal output out[n];

    for (var i=0; i<n; i++) {
        if (i < r) {
            out[i] <== 0;
        } else {
            out[i] <== in[ i-r ];
        }
    }
}

template D(n, shl, shr) {
    // d = b ^ (a<<shl | a>>shr)
    signal input a[n];
    signal input b[n];
    signal output out[n];
    var i;

    component aux0 = ShR(64, shr);
    for (i=0; i<64; i++) {
        aux0.in[i] <== a[i];
    }
    component aux1 = ShL(64, shl);
    for (i=0; i<64; i++) {
        aux1.in[i] <== a[i];
    }
    component aux2[64];
    for (i=0; i<64; i++) {
        aux2[i] = OR();
        aux2[i].a <== aux0.out[i];
        aux2[i].b <== aux1.out[i];
    }
    component aux3 = XorArray(64);
    for (i=0; i<64; i++) {
        aux3.a[i] <== b[i];
        aux3.b[i] <== aux2[i].out;
    }
    for (i=0; i<64; i++) {
        out[i] <== aux3.out[i];
    }
}

template Theta() {
    signal input in[25*64];
    signal output out[25*64];

    var i;

    component c0 = Xor5(64);
    for (i=0; i<64; i++) {
        c0.a[i] <== in[i];
        c0.b[i] <== in[5*64+i];
        c0.c[i] <== in[10*64+i];
        c0.d[i] <== in[15*64+i];
        c0.e[i] <== in[20*64+i];
    }

    component c1 = Xor5(64);
    for (i=0; i<64; i++) {
        c1.a[i] <== in[1*64+i];
        c1.b[i] <== in[6*64+i];
        c1.c[i] <== in[11*64+i];
        c1.d[i] <== in[16*64+i];
        c1.e[i] <== in[21*64+i];
    }

    component c2 = Xor5(64);
    for (i=0; i<64; i++) {
        c2.a[i] <== in[2*64+i];
        c2.b[i] <== in[7*64+i];
        c2.c[i] <== in[12*64+i];
        c2.d[i] <== in[17*64+i];
        c2.e[i] <== in[22*64+i];
    }

    component c3 = Xor5(64);
    for (i=0; i<64; i++) {
        c3.a[i] <== in[3*64+i];
        c3.b[i] <== in[8*64+i];
        c3.c[i] <== in[13*64+i];
        c3.d[i] <== in[18*64+i];
        c3.e[i] <== in[23*64+i];
    }

    component c4 = Xor5(64);
    for (i=0; i<64; i++) {
        c4.a[i] <== in[4*64+i];
        c4.b[i] <== in[9*64+i];
        c4.c[i] <== in[14*64+i];
        c4.d[i] <== in[19*64+i];
        c4.e[i] <== in[24*64+i];
    }

    // d = c4 ^ (c1<<1 | c1>>(64-1))
    component d0 = D(64, 1, 64-1);
    for (i=0; i<64; i++) {
        d0.a[i] <== c1.out[i];
        d0.b[i] <== c4.out[i];
    }
    // r[0] = a[0] ^ d
    component r0 = XorArray(64);
    for (i=0; i<64; i++) {
        r0.a[i] <== in[i];
        r0.b[i] <== d0.out[i];
    }
    for (i=0; i<64; i++) {
        out[i] <== r0.out[i];
    }
    // r[5] = a[5] ^ d
    component r5 = XorArray(64);
    for (i=0; i<64; i++) {
        r5.a[i] <== in[5*64+i];
        r5.b[i] <== d0.out[i];
    }
    for (i=0; i<64; i++) {
        out[5*64+i] <== r5.out[i];
    }
    // r[10] = a[10] ^ d
    component r10 = XorArray(64);
    for (i=0; i<64; i++) {
        r10.a[i] <== in[10*64+i];
        r10.b[i] <== d0.out[i];
    }
    for (i=0; i<64; i++) {
        out[10*64+i] <== r10.out[i];
    }
    // r[15] = a[15] ^ d
    component r15 = XorArray(64);
    for (i=0; i<64; i++) {
        r15.a[i] <== in[15*64+i];
        r15.b[i] <== d0.out[i];
    }
    for (i=0; i<64; i++) {
        out[15*64+i] <== r15.out[i];
    }
    // r[20] = a[20] ^ d
    component r20 = XorArray(64);
    for (i=0; i<64; i++) {
        r20.a[i] <== in[20*64+i];
        r20.b[i] <== d0.out[i];
    }
    for (i=0; i<64; i++) {
        out[20*64+i] <== r20.out[i];
    }

    // d = c0 ^ (c2<<1 | c2>>(64-1))
    component d1 = D(64, 1, 64-1);
    for (i=0; i<64; i++) {
        d1.a[i] <== c2.out[i];
        d1.b[i] <== c0.out[i];
    }
    // r[1] = a[1] ^ d
    component r1 = XorArray(64);
    for (i=0; i<64; i++) {
        r1.a[i] <== in[1*64+i];
        r1.b[i] <== d1.out[i];
    }
    for (i=0; i<64; i++) {
        out[1*64+i] <== r1.out[i];
    }
    // r[6] = a[6] ^ d
    component r6 = XorArray(64);
    for (i=0; i<64; i++) {
        r6.a[i] <== in[6*64+i];
        r6.b[i] <== d1.out[i];
    }
    for (i=0; i<64; i++) {
        out[6*64+i] <== r6.out[i];
    }
    // r[11] = a[11] ^ d
    component r11 = XorArray(64);
    for (i=0; i<64; i++) {
        r11.a[i] <== in[11*64+i];
        r11.b[i] <== d1.out[i];
    }
    for (i=0; i<64; i++) {
        out[11*64+i] <== r11.out[i];
    }
    // r[16] = a[16] ^ d
    component r16 = XorArray(64);
    for (i=0; i<64; i++) {
        r16.a[i] <== in[16*64+i];
        r16.b[i] <== d1.out[i];
    }
    for (i=0; i<64; i++) {
        out[16*64+i] <== r16.out[i];
    }
    // r[21] = a[21] ^ d
    component r21 = XorArray(64);
    for (i=0; i<64; i++) {
        r21.a[i] <== in[21*64+i];
        r21.b[i] <== d1.out[i];
    }
    for (i=0; i<64; i++) {
        out[21*64+i] <== r21.out[i];
    }

    // d = c1 ^ (c3<<1 | c3>>(64-1))
    component d2 = D(64, 1, 64-1);
    for (i=0; i<64; i++) {
        d2.a[i] <== c3.out[i];
        d2.b[i] <== c1.out[i];
    }
    // r[2] = a[2] ^ d
    component r2 = XorArray(64);
    for (i=0; i<64; i++) {
        r2.a[i] <== in[2*64+i];
        r2.b[i] <== d2.out[i];
    }
    for (i=0; i<64; i++) {
        out[2*64+i] <== r2.out[i];
    }
    // r[7] = a[7] ^ d
    component r7 = XorArray(64);
    for (i=0; i<64; i++) {
        r7.a[i] <== in[7*64+i];
        r7.b[i] <== d2.out[i];
    }
    for (i=0; i<64; i++) {
        out[7*64+i] <== r7.out[i];
    }
    // r[12] = a[12] ^ d
    component r12 = XorArray(64);
    for (i=0; i<64; i++) {
        r12.a[i] <== in[12*64+i];
        r12.b[i] <== d2.out[i];
    }
    for (i=0; i<64; i++) {
        out[12*64+i] <== r12.out[i];
    }
    // r[17] = a[17] ^ d
    component r17 = XorArray(64);
    for (i=0; i<64; i++) {
        r17.a[i] <== in[17*64+i];
        r17.b[i] <== d2.out[i];
    }
    for (i=0; i<64; i++) {
        out[17*64+i] <== r17.out[i];
    }
    // r[22] = a[22] ^ d
    component r22 = XorArray(64);
    for (i=0; i<64; i++) {
        r22.a[i] <== in[22*64+i];
        r22.b[i] <== d2.out[i];
    }
    for (i=0; i<64; i++) {
        out[22*64+i] <== r22.out[i];
    }

    // d = c2 ^ (c4<<1 | c4>>(64-1))
    component d3 = D(64, 1, 64-1);
    for (i=0; i<64; i++) {
        d3.a[i] <== c4.out[i];
        d3.b[i] <== c2.out[i];
    }
    // r[3] = a[3] ^ d
    component r3 = XorArray(64);
    for (i=0; i<64; i++) {
        r3.a[i] <== in[3*64+i];
        r3.b[i] <== d3.out[i];
    }
    for (i=0; i<64; i++) {
        out[3*64+i] <== r3.out[i];
    }
    // r[8] = a[8] ^ d
    component r8 = XorArray(64);
    for (i=0; i<64; i++) {
        r8.a[i] <== in[8*64+i];
        r8.b[i] <== d3.out[i];
    }
    for (i=0; i<64; i++) {
        out[8*64+i] <== r8.out[i];
    }
    // r[13] = a[13] ^ d
    component r13 = XorArray(64);
    for (i=0; i<64; i++) {
        r13.a[i] <== in[13*64+i];
        r13.b[i] <== d3.out[i];
    }
    for (i=0; i<64; i++) {
        out[13*64+i] <== r13.out[i];
    }
    // r[18] = a[18] ^ d
    component r18 = XorArray(64);
    for (i=0; i<64; i++) {
        r18.a[i] <== in[18*64+i];
        r18.b[i] <== d3.out[i];
    }
    for (i=0; i<64; i++) {
        out[18*64+i] <== r18.out[i];
    }
    // r[23] = a[23] ^ d
    component r23 = XorArray(64);
    for (i=0; i<64; i++) {
        r23.a[i] <== in[23*64+i];
        r23.b[i] <== d3.out[i];
    }
    for (i=0; i<64; i++) {
        out[23*64+i] <== r23.out[i];
    }

    // d = c3 ^ (c0<<1 | c0>>(64-1))
    component d4 = D(64, 1, 64-1);
    for (i=0; i<64; i++) {
        d4.a[i] <== c0.out[i];
        d4.b[i] <== c3.out[i];
    }
    // r[4] = a[4] ^ d
    component r4 = XorArray(64);
    for (i=0; i<64; i++) {
        r4.a[i] <== in[4*64+i];
        r4.b[i] <== d4.out[i];
    }
    for (i=0; i<64; i++) {
        out[4*64+i] <== r4.out[i];
    }
    // r[9] = a[9] ^ d
    component r9 = XorArray(64);
    for (i=0; i<64; i++) {
        r9.a[i] <== in[9*64+i];
        r9.b[i] <== d4.out[i];
    }
    for (i=0; i<64; i++) {
        out[9*64+i] <== r9.out[i];
    }
    // r[14] = a[14] ^ d
    component r14 = XorArray(64);
    for (i=0; i<64; i++) {
        r14.a[i] <== in[14*64+i];
        r14.b[i] <== d4.out[i];
    }
    for (i=0; i<64; i++) {
        out[14*64+i] <== r14.out[i];
    }
    // r[19] = a[19] ^ d
    component r19 = XorArray(64);
    for (i=0; i<64; i++) {
        r19.a[i] <== in[19*64+i];
        r19.b[i] <== d4.out[i];
    }
    for (i=0; i<64; i++) {
        out[19*64+i] <== r19.out[i];
    }
    // r[24] = a[24] ^ d
    component r24 = XorArray(64);
    for (i=0; i<64; i++) {
        r24.a[i] <== in[24*64+i];
        r24.b[i] <== d4.out[i];
    }
    for (i=0; i<64; i++) {
        out[24*64+i] <== r24.out[i];
    }
}

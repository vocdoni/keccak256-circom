pragma circom 2.0.0;

include "./utils.circom";

template step() {
    // out = a ^ (^b) & c
    signal input a[64];
    signal input b[64];
    signal input c[64];
    signal output out[64];
    var i;

    // ^b
    component bXor = XorArraySingle(64);
    for (i=0; i<64; i++) {
        bXor.a[i] <== b[i];
    }
    // (^b)&c
    component bc = AndArray(64);
    for (i=0; i<64; i++) {
        bc.a[i] <== bXor.out[i];
        bc.b[i] <== c[i];
    }
    // a^(^b)&c
    component abc = XorArray(64);
    for (i=0; i<64; i++) {
        abc.a[i] <== a[i];
        abc.b[i] <== bc.out[i];
    }
    for (i=0; i<64; i++) {
        out[i] <== abc.out[i];
    }
}

template Chi() {
    signal input in[25*64];
    signal output out[25*64];

    var i;

    component r0 = step();
    for (i=0; i<64; i++) {
        r0.a[i] <== in[i];
        r0.b[i] <== in[1*64+i];
        r0.c[i] <== in[2*64+i];
    }
    component r1 = step();
    for (i=0; i<64; i++) {
        r1.a[i] <== in[1*64+i];
        r1.b[i] <== in[2*64+i];
        r1.c[i] <== in[3*64+i];
    }
    component r2 = step();
    for (i=0; i<64; i++) {
        r2.a[i] <== in[2*64+i];
        r2.b[i] <== in[3*64+i];
        r2.c[i] <== in[4*64+i];
    }
    component r3 = step();
    for (i=0; i<64; i++) {
        r3.a[i] <== in[3*64+i];
        r3.b[i] <== in[4*64+i];
        r3.c[i] <== in[0*64+i];
    }
    component r4 = step();
    for (i=0; i<64; i++) {
        r4.a[i] <== in[4*64+i];
        r4.b[i] <== in[i];
        r4.c[i] <== in[1*64+i];
    }

    component r5 = step();
    for (i=0; i<64; i++) {
        r5.a[i] <== in[5*64+i];
        r5.b[i] <== in[6*64+i];
        r5.c[i] <== in[7*64+i];
    }
    component r6 = step();
    for (i=0; i<64; i++) {
        r6.a[i] <== in[6*64+i];
        r6.b[i] <== in[7*64+i];
        r6.c[i] <== in[8*64+i];
    }
    component r7 = step();
    for (i=0; i<64; i++) {
        r7.a[i] <== in[7*64+i];
        r7.b[i] <== in[8*64+i];
        r7.c[i] <== in[9*64+i];
    }
    component r8 = step();
    for (i=0; i<64; i++) {
        r8.a[i] <== in[8*64+i];
        r8.b[i] <== in[9*64+i];
        r8.c[i] <== in[5*64+i];
    }
    component r9 = step();
    for (i=0; i<64; i++) {
        r9.a[i] <== in[9*64+i];
        r9.b[i] <== in[5*64+i];
        r9.c[i] <== in[6*64+i];
    }

    component r10 = step();
    for (i=0; i<64; i++) {
        r10.a[i] <== in[10*64+i];
        r10.b[i] <== in[11*64+i];
        r10.c[i] <== in[12*64+i];
    }
    component r11 = step();
    for (i=0; i<64; i++) {
        r11.a[i] <== in[11*64+i];
        r11.b[i] <== in[12*64+i];
        r11.c[i] <== in[13*64+i];
    }
    component r12 = step();
    for (i=0; i<64; i++) {
        r12.a[i] <== in[12*64+i];
        r12.b[i] <== in[13*64+i];
        r12.c[i] <== in[14*64+i];
    }
    component r13 = step();
    for (i=0; i<64; i++) {
        r13.a[i] <== in[13*64+i];
        r13.b[i] <== in[14*64+i];
        r13.c[i] <== in[10*64+i];
    }
    component r14 = step();
    for (i=0; i<64; i++) {
        r14.a[i] <== in[14*64+i];
        r14.b[i] <== in[10*64+i];
        r14.c[i] <== in[11*64+i];
    }

    component r15 = step();
    for (i=0; i<64; i++) {
        r15.a[i] <== in[15*64+i];
        r15.b[i] <== in[16*64+i];
        r15.c[i] <== in[17*64+i];
    }
    component r16 = step();
    for (i=0; i<64; i++) {
        r16.a[i] <== in[16*64+i];
        r16.b[i] <== in[17*64+i];
        r16.c[i] <== in[18*64+i];
    }
    component r17 = step();
    for (i=0; i<64; i++) {
        r17.a[i] <== in[17*64+i];
        r17.b[i] <== in[18*64+i];
        r17.c[i] <== in[19*64+i];
    }
    component r18 = step();
    for (i=0; i<64; i++) {
        r18.a[i] <== in[18*64+i];
        r18.b[i] <== in[19*64+i];
        r18.c[i] <== in[15*64+i];
    }
    component r19 = step();
    for (i=0; i<64; i++) {
        r19.a[i] <== in[19*64+i];
        r19.b[i] <== in[15*64+i];
        r19.c[i] <== in[16*64+i];
    }

    component r20 = step();
    for (i=0; i<64; i++) {
        r20.a[i] <== in[20*64+i];
        r20.b[i] <== in[21*64+i];
        r20.c[i] <== in[22*64+i];
    }
    component r21 = step();
    for (i=0; i<64; i++) {
        r21.a[i] <== in[21*64+i];
        r21.b[i] <== in[22*64+i];
        r21.c[i] <== in[23*64+i];
    }
    component r22 = step();
    for (i=0; i<64; i++) {
        r22.a[i] <== in[22*64+i];
        r22.b[i] <== in[23*64+i];
        r22.c[i] <== in[24*64+i];
    }
    component r23 = step();
    for (i=0; i<64; i++) {
        r23.a[i] <== in[23*64+i];
        r23.b[i] <== in[24*64+i];
        r23.c[i] <== in[20*64+i];
    }
    component r24 = step();
    for (i=0; i<64; i++) {
        r24.a[i] <== in[24*64+i];
        r24.b[i] <== in[20*64+i];
        r24.c[i] <== in[21*64+i];
    }

    for (i=0; i<64; i++) {
        out[i] <== r0.out[i];
        out[1*64+i] <== r1.out[i];
        out[2*64+i] <== r2.out[i];
        out[3*64+i] <== r3.out[i];
        out[4*64+i] <== r4.out[i];

        out[5*64+i] <== r5.out[i];
        out[6*64+i] <== r6.out[i];
        out[7*64+i] <== r7.out[i];
        out[8*64+i] <== r8.out[i];
        out[9*64+i] <== r9.out[i];

        out[10*64+i] <== r10.out[i];
        out[11*64+i] <== r11.out[i];
        out[12*64+i] <== r12.out[i];
        out[13*64+i] <== r13.out[i];
        out[14*64+i] <== r14.out[i];

        out[15*64+i] <== r15.out[i];
        out[16*64+i] <== r16.out[i];
        out[17*64+i] <== r17.out[i];
        out[18*64+i] <== r18.out[i];
        out[19*64+i] <== r19.out[i];

        out[20*64+i] <== r20.out[i];
        out[21*64+i] <== r21.out[i];
        out[22*64+i] <== r22.out[i];
        out[23*64+i] <== r23.out[i];
        out[24*64+i] <== r24.out[i];
    }
}

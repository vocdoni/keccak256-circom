pragma circom 2.0.0;

include "./utils.circom";

template stepRhoPi(shl, shr) {
    // out = a<<shl|a>>shr
    signal input a[64];
    signal output out[64];
    var i;

    component aux0 = ShR(64, shr);
    for (i=0; i<64; i++) {
        aux0.in[i] <== a[i];
    }
    component aux1 = ShL(64, shl);
    for (i=0; i<64; i++) {
        aux1.in[i] <== a[i];
    }
    component aux2 = OrArray(64);
    for (i=0; i<64; i++) {
        aux2.a[i] <== aux0.out[i];
        aux2.b[i] <== aux1.out[i];
    }
    for (i=0; i<64; i++) {
        out[i] <== aux2.out[i];
    }
}
template RhoPi() {
    signal input in[25*64];
    signal output out[25*64];

    var i;

    // r[10] = a[1]<<1|a[1]>>(64-1)
    component s10 = stepRhoPi(1, 64-1);
    for (i=0; i<64; i++) {
        s10.a[i] <== in[1*64+i];
    }
    // r[7] = a[10]<<3|a[10]>>(64-3)
    component s7 = stepRhoPi(3, 64-3);
    for (i=0; i<64; i++) {
        s7.a[i] <== in[10*64+i];
    }
    // r[11] = a[7]<<6|a[7]>>(64-6)
    component s11 = stepRhoPi(6, 64-6);
    for (i=0; i<64; i++) {
        s11.a[i] <== in[7*64+i];
    }
    // r[17] = a[11]<<10|a[11]>>(64-10)
    component s17 = stepRhoPi(10, 64-10);
    for (i=0; i<64; i++) {
        s17.a[i] <== in[11*64+i];
    }
    // r[18] = a[17]<<15|a[17]>>(64-15)
    component s18 = stepRhoPi(15, 64-15);
    for (i=0; i<64; i++) {
        s18.a[i] <== in[17*64+i];
    }
    // r[3] = a[18]<<21|a[18]>>(64-21)
    component s3 = stepRhoPi(21, 64-21);
    for (i=0; i<64; i++) {
        s3.a[i] <== in[18*64+i];
    }
    // r[5] = a[3]<<28|a[3]>>(64-28)
    component s5 = stepRhoPi(28, 64-28);
    for (i=0; i<64; i++) {
        s5.a[i] <== in[3*64+i];
    }
    // r[16] = a[5]<<36|a[5]>>(64-36)
    component s16 = stepRhoPi(36, 64-36);
    for (i=0; i<64; i++) {
        s16.a[i] <== in[5*64+i];
    }
    // r[8] = a[16]<<45|a[16]>>(64-45)
    component s8 = stepRhoPi(45, 64-45);
    for (i=0; i<64; i++) {
        s8.a[i] <== in[16*64+i];
    }
    // r[21] = a[8]<<55|a[8]>>(64-55)
    component s21 = stepRhoPi(55, 64-55);
    for (i=0; i<64; i++) {
        s21.a[i] <== in[8*64+i];
    }
    // r[24] = a[21]<<2|a[21]>>(64-2)
    component s24 = stepRhoPi(2, 64-2);
    for (i=0; i<64; i++) {
        s24.a[i] <== in[21*64+i];
    }
    // r[4] = a[24]<<14|a[24]>>(64-14)
    component s4 = stepRhoPi(14, 64-14);
    for (i=0; i<64; i++) {
        s4.a[i] <== in[24*64+i];
    }
    // r[15] = a[4]<<27|a[4]>>(64-27)
    component s15 = stepRhoPi(27, 64-27);
    for (i=0; i<64; i++) {
        s15.a[i] <== in[4*64+i];
    }
    // r[23] = a[15]<<41|a[15]>>(64-41)
    component s23 = stepRhoPi(41, 64-41);
    for (i=0; i<64; i++) {
        s23.a[i] <== in[15*64+i];
    }
    // r[19] = a[23]<<56|a[23]>>(64-56)
    component s19 = stepRhoPi(56, 64-56);
    for (i=0; i<64; i++) {
        s19.a[i] <== in[23*64+i];
    }
    // r[13] = a[19]<<8|a[19]>>(64-8)
    component s13 = stepRhoPi(8, 64-8);
    for (i=0; i<64; i++) {
        s13.a[i] <== in[19*64+i];
    }
    // r[12] = a[13]<<25|a[13]>>(64-25)
    component s12 = stepRhoPi(25, 64-25);
    for (i=0; i<64; i++) {
        s12.a[i] <== in[13*64+i];
    }
    // r[2] = a[12]<<43|a[12]>>(64-43)
    component s2 = stepRhoPi(43, 64-43);
    for (i=0; i<64; i++) {
        s2.a[i] <== in[12*64+i];
    }
    // r[20] = a[2]<<62|a[2]>>(64-62)
    component s20 = stepRhoPi(62, 64-62);
    for (i=0; i<64; i++) {
        s20.a[i] <== in[2*64+i];
    }
    // r[14] = a[20]<<18|a[20]>>(64-18)
    component s14 = stepRhoPi(18, 64-18);
    for (i=0; i<64; i++) {
        s14.a[i] <== in[20*64+i];
    }
    // r[22] = a[14]<<39|a[14]>>(64-39)
    component s22 = stepRhoPi(39, 64-39);
    for (i=0; i<64; i++) {
        s22.a[i] <== in[14*64+i];
    }
    // r[9] = a[22]<<61|a[22]>>(64-61)
    component s9 = stepRhoPi(61, 64-61);
    for (i=0; i<64; i++) {
        s9.a[i] <== in[22*64+i];
    }
    // r[6] = a[9]<<20|a[9]>>(64-20)
    component s6 = stepRhoPi(20, 64-20);
    for (i=0; i<64; i++) {
        s6.a[i] <== in[9*64+i];
    }
    // r[1] = a[6]<<44|a[6]>>(64-44)
    component s1 = stepRhoPi(44, 64-44);
    for (i=0; i<64; i++) {
        s1.a[i] <== in[6*64+i];
    }

    for (i=0; i<64; i++) {
        out[i] <== in[i];
        out[10*64+i] <== s10.out[i];
        out[7*64+i] <== s7.out[i];
        out[11*64+i] <== s11.out[i];
        out[17*64+i] <== s17.out[i];
        out[18*64+i] <== s18.out[i];
        out[3*64+i] <== s3.out[i];
        out[5*64+i] <== s5.out[i];
        out[16*64+i] <== s16.out[i];
        out[8*64+i] <== s8.out[i];
        out[21*64+i] <== s21.out[i];
        out[24*64+i] <== s24.out[i];
        out[4*64+i] <== s4.out[i];
        out[15*64+i] <== s15.out[i];
        out[23*64+i] <== s23.out[i];
        out[19*64+i] <== s19.out[i];
        out[13*64+i] <== s13.out[i];
        out[12*64+i] <== s12.out[i];
        out[2*64+i] <== s2.out[i];
        out[20*64+i] <== s20.out[i];
        out[14*64+i] <== s14.out[i];
        out[22*64+i] <== s22.out[i];
        out[9*64+i] <== s9.out[i];
        out[6*64+i] <== s6.out[i];
        out[1*64+i] <== s1.out[i];
    }
}

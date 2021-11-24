pragma circom 2.0.0;

include "./utils.circom";
include "./theta.circom";
include "./rhopi.circom";
include "./chi.circom";
include "./iota.circom";

template Pad(nBits) {
    signal input in[nBits];

    var blockSize=136*8;
    signal output out[blockSize];
    signal out2[blockSize];

    var i;

    for (i=0; i<nBits; i++) {
        out2[i] <== in[i];
    }
    var domain = 0x01;
    for (i=0; i<8; i++) {
        out2[nBits+i] <== (domain >> i) & 1;
    }
    for (i=nBits+8; i<blockSize; i++) {
        out2[i] <== 0;
    }
    component aux = OrArray(8);
    for (i=0; i<8; i++) {
        aux.a[i] <== out2[blockSize-8+i];
        aux.b[i] <== (0x80 >> i) & 1;
    }
    for (i=0; i<8; i++) {
        out[blockSize-8+i] <== aux.out[i];
    }
    for (i=0; i<blockSize-8; i++) {
        out[i]<==out2[i];
    }
}

template KeccakfRound(r) {
    signal input in[25*64];
    signal output out[25*64];
    var i;

    component theta = Theta();
    component rhopi = RhoPi();
    component chi = Chi();
    component iota = Iota(r);

    for (i=0; i<25*64; i++) {
        theta.in[i] <== in[i];
    }
    for (i=0; i<25*64; i++) {
        rhopi.in[i] <== theta.out[i];
    }
    for (i=0; i<25*64; i++) {
        chi.in[i] <== rhopi.out[i];
    }
    for (i=0; i<25*64; i++) {
        iota.in[i] <== chi.out[i];
    }
    for (i=0; i<25*64; i++) {
        out[i] <== iota.out[i];
    }
}

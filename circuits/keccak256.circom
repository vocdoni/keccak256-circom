pragma circom 2.0.0;

include "./utils.circom";

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

template Keccak256(nBits) {
    signal input in[nBits];
    signal output out[256];
    var i;

    // pad
    component pad = Pad(nBits);
    for (i=0; i<nBits; i++) {
        pad.in[i] <== in[i];
    }
    
}

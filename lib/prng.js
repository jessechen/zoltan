// seeded RNG condensed from https://github.com/skeeto/rng-js

function RC4(seed) {
    this.s = new Array(256);
    this.i = 0;
    this.j = 0;
    for (var i = 0; i < 256; i++) {
        this.s[i] = i;
    }
    if (seed) {
        this.mix(seed);
    }
}

RC4.getStringBytes = function(string) {
    var output = [];
    for (var i = 0; i < string.length; i++) {
        var c = string.charCodeAt(i);
        var bytes = [];
        do {
            bytes.push(c & 0xFF);
            c = c >> 8;
        } while (c > 0);
        output = output.concat(bytes.reverse());
    }
    return output;
};

RC4.prototype._swap = function(i, j) {
    var tmp = this.s[i];
    this.s[i] = this.s[j];
    this.s[j] = tmp;
};

RC4.prototype.mix = function(seed) {
    var input = RC4.getStringBytes(seed);
    var j = 0;
    for (var i = 0; i < this.s.length; i++) {
        j += this.s[i] + input[i % input.length];
        j %= 256;
        this._swap(i, j);
    }
};

RC4.prototype.next = function() {
    this.i = (this.i + 1) % 256;
    this.j = (this.j + this.s[this.i]) % 256;
    this._swap(this.i, this.j);
    return this.s[(this.s[this.i] + this.s[this.j]) % 256];
};

function RNG(seed) {
    this._state = new RC4(JSON.stringify(seed));
}

RNG.prototype.nextByte = function() {
    return this._state.next();
};

RNG.prototype.uniform = function() {
    var BYTES = 7; // 56 bits to make a 53-bit double
    var output = 0;
    for (var i = 0; i < BYTES; i++) {
        output *= 256;
        output += this.nextByte();
    }
    return output / (Math.pow(2, BYTES * 8) - 1);
};

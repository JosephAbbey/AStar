function locate(i) {
    var z = ~~(i / (xs * ys));
    var y = ~~((i - z * ys * xs) / xs);
    var x = i - y * xs - z * ys * xs;

    return new vector(x, y, z);
}

class vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

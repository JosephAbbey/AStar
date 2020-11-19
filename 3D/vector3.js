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

function getNeighbours(nodes, x, y, z) {
    var neighbours = [];

    for (var j = -1; j <= 1; j++) {
        for (var k = -1; k <= 1; k++) {
            for (var l = -1; l <= 1; l++) {
                if (
                    (j === -1 && x === 0) ||
                    (j === 1 && x === xs - 1) ||
                    (k === -1 && y === 0) ||
                    (k === 1 && y === ys - 1) ||
                    (l === -1 && z === 0) ||
                    (l === 1 && z === zs - 1)
                ) {
                    neighbours.push(null);
                } else {
                    neighbours.push(x + j + (y + k) * xs + (z + l) * ys * xs);
                }
            }
        }
    }

    if (DIAGONALS) {
        for (var i = 0; i < 27; i++) {
            if (nodes[neighbours[i]]) {
                if (nodes[neighbours[i]][0] == "a") {
                    nodes[neighbours[i]][0] = "c";
                    nodes[neighbours[i]][5] = x + y * xs + z * ys * xs;
                }
                if (nodes[neighbours[i]][0] == "e") {
                    nodes[neighbours[i]][0] = "ce";
                    nodes[neighbours[i]][5] = x + y * xs + z * ys * xs;
                }
            }
        }
    } else {
        for (var i = 0; i < 6; i++) {
            var j = 0;
            switch (i) {
                case 0:
                    j = 4;
                    break;
                case 1:
                    j = 10;
                    break;
                case 2:
                    j = 12;
                    break;
                case 3:
                    j = 14;
                    break;
                case 4:
                    j = 16;
                    break;
                case 5:
                    j = 22;
                    break;
            }
            if (nodes[neighbours[j]]) {
                if (nodes[neighbours[j]][0] == "a") {
                    nodes[neighbours[j]][0] = "c";
                    nodes[neighbours[j]][5] = x + y * xs + z * ys * xs;
                }
                if (nodes[neighbours[j]][0] == "e") {
                    nodes[neighbours[j]][0] = "ce";
                    nodes[neighbours[j]][5] = x + y * xs + z * ys * xs;
                }
            }
        }
    }
}

function getPath(nodes, start, finnish) {
    var cur = finnish;
    while (cur !== start) {
        nodes[cur][0] = "p";
        cur = nodes[cur][5];
    }
    nodes[cur][0] = "p";
    draw();
}

function calc(nodes) {
    var best = [Infinity, Infinity, Infinity, Infinity, Infinity];
    for (var i = 0; i < nodes.length; i++) {
        if (
            nodes[i][3] < best[3] &&
            (nodes[i][0] == "c" || nodes[i][0] == "ce")
        ) {
            best = nodes[i];
            best[4] = i;
        }
        if (
            nodes[i][3] == best[3] &&
            nodes[i][1] < best[1] &&
            (nodes[i][0] == "c" || nodes[i][0] == "ce")
        ) {
            best = nodes[i];
            best[4] = i;
        }
    }
    return best;
}

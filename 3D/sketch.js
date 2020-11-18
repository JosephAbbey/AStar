var amt = 1000;
xs = ~~Math.cbrt(amt);
ys = xs;
zs = xs;
var MAXWALLS = 10;
var MINWALLS = 10;
var MINDIST = 5;
var DIAGONALS = 1;
var size = 10;
var theta = 0;
var spin = 0;

var nodes = [];

var interval = 100;
var start;
var finnish;
var best;
var calculated = [];
var gizmo = 1,
    drawEmpty = 0;

var settings = QuickSettings.create();
settings.addButton("Run", run);
settings.addButton("Step", go);
settings.addButton("Re-Generate", generate);
settings.addButton("Reset map", reset);
settings.addBoolean("Draw gizmo", true, (value) => {
    gizmo = value;
});
settings.addBoolean("Draw empty space", false, (value) => {
    drawEmpty = value;
});
settings.addRange(
    "Run speed <br> (ms between steps)",
    1,
    2000,
    100,
    1,
    (value) => {
        interval = value;
    }
);
settings.addRange("Map size (blocks³)", 1, 30, 10, 1, (value) => {
    amt = Math.pow(value, 3);
    xs = ~~Math.cbrt(amt);
    ys = xs;
    zs = xs;
    generate();
});
settings.addBoolean("Diagonal movement", true, (value) => {
    DIAGONALS = value;
});
settings.addRange("Max Walls", 0, 100, 10, 1, (value) => {
    MAXWALLS = value;
    generate();
});
settings.addRange("Min Walls", 0, 100, 10, 1, (value) => {
    MINWALLS = value;
    generate();
});
settings.addRange(
    "Size <br> (drawn at, not shown at)",
    6,
    50,
    10,
    1,
    (value) => {
        size = value;
    }
);
settings.addBoolean("Rotate", 0, (value) => {
    // theta = 0;
    spin = value;
});
settings.addButton("Reset angle", () => {
    theta = 0;
});

function setup() {
    createCanvas(window.innerWidth, window.innerHeight, WEBGL);
    setAttributes("antialias", true);
    document.oncontextmenu = () => false;
    createEasyCam({ distance: width });
    generate();
}

function generate() {
    nodes = [];
    for (var j = 0; j < amt; j++) {
        nodes[j] = ["a"];
    }

    for (
        var i = 0;
        i < ~~(Math.random() * (MAXWALLS - MINWALLS)) + MINWALLS;
        i++
    ) {
        var wallPos = ~~(Math.random() * (amt - 1)) + 1;
        var wallLength = ~~(Math.random() * 4) + 1;
        for (var j = 0; j < wallLength; j++) {
            if (nodes[wallPos + j]) {
                nodes[wallPos + j][0] = "d";
            }
        }
    }

    finnish = ~~(Math.random() * amt);
    nodes[finnish][0] = "e";

    start = ~~(Math.random() * amt);
    while (
        dist(
            locate(start).x,
            locate(start).y,
            locate(start).z,
            locate(finnish).x,
            locate(finnish).y,
            locate(finnish).z
        ) < MINDIST
    ) {
        start = ~~(Math.random() * amt);
    }
    nodes[start][0] = "sb";
    var x = locate(start).x;
    var y = locate(start).y;
    var z = locate(start).z;
    getNeighbours(nodes, x, y, z);
}

function draw() {
    rotateY(theta);
    if (spin) {
        theta += 0.005;
    }

    background(230);

    // gizmo
    if (gizmo) {
        strokeWeight(1);
        stroke(255, 32, 0);
        line(0, 0, 0, xs * (size * 2), 0, 0);
        stroke(32, 255, 32);
        line(0, 0, 0, 0, ys * (size * 2), 0);
        stroke(0, 32, 255);
        line(0, 0, 0, 0, 0, zs * (size * 2));

        noFill();
        stroke(255, 0, 255);
        box(size * 2 * xs);
    }

    for (var i = 0; i < nodes.length; i++) {
        noStroke();

        var x = locate(i).x;
        var y = locate(i).y;
        var z = locate(i).z;
        if (nodes[i][0] == "a") {
            fill(255, 255, 255);
            if (!drawEmpty) {
                noFill();
            }
        } else if (nodes[i][0] == "c") {
            fill(255, 0, 0);
        } else if (nodes[i][0] == "e" || nodes[i][0] == "ce") {
            fill(255, 0, 255);
        }
        if (nodes[i][0] == "b" || nodes[i][0] == "sb") {
            fill(0, 0, 255);
        } else if (nodes[i][0] == "d") {
            fill(0, 0, 0);
        } else if (nodes[i][0] == "p") {
            fill(0, 255, 0);
        }

        push();
        translate(
            (x + 0.75) * (size * 2) - xs / 2 - size * xs,
            (y + 0.75) * (size * 2) - ys / 2 - size * ys,
            (z + 0.75) * (size * 2) - zs / 2 - size * zs
        );
        box(size);
        pop();
    }
}

async function run() {
    while (calculated[4] != finnish) {
        go();
        await sleep(interval);
    }
}

function calc(nodes) {
    best = [Infinity, Infinity, Infinity, Infinity, Infinity];
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

function go() {
    calculated = calc(nodes);
    getNeighbours(
        nodes,
        locate(calculated[4]).x,
        locate(calculated[4]).y,
        locate(calculated[4]).z
    );
    if (nodes[calculated[4]]) {
        nodes[calculated[4]][0] = "b";
    }
    for (var i = 0; i < nodes.length; i++) {
        var x = locate(i).x;
        var y = locate(i).y;
        var z = locate(i).z;

        var H = Math.round(
            dist(
                x,
                y,
                z,
                locate(finnish).x,
                locate(finnish).y,
                locate(finnish).z
            ) * 10
        );
        nodes[i][1] = H;

        var G = Math.round(
            dist(x, y, z, locate(start).x, locate(start).y, locate(start).z) *
                10
        );
        nodes[i][2] = G;
        nodes[i][3] = H + G;
    }

    if (calculated[4] == finnish) {
        // setTimeout(function () {
        //     alert("Yay the Path is Found!!");
        // }, 3);
        getPath();
    }
}

function getPath() {
    var cur = finnish;
    while (cur !== start) {
        nodes[cur][0] = "p";
        cur = nodes[cur][5];
    }
    nodes[cur][0] = "p";
    draw();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function reset() {
    for (var i = 0; i < nodes.length; i++) {
        if (i == start) {
            nodes[i][0] = "sb";
        }
        if (i == finnish) {
            nodes[i][0] = "e";
        }
        if (nodes[i][0] == "b" || nodes[i][0] == "c" || nodes[i][0] == "p") {
            nodes[i][0] = "a";
        }
    }
    getNeighbours(nodes, locate(start).x, locate(start).y, locate(start).z);
}

const amt = 400;
const rows = ~~Math.sqrt(amt);
const columns = rows;
const MAXWALLS = 100;
const MINWALLS = 75;
const interval = 0.5;
const DIAGONALS = 1;

var nodes = [];
for (var j = 0; j < amt; j++) {
    nodes[j] = ["a"];
}

var size;
var started = 0;
var start;
var finnish;
var best;
var calculated = [];

function setup() {
    if (window.innerHeight <= window.innerWidth) {
        createCanvas(window.innerHeight, window.innerHeight, WEBGL);
    }
    if (window.innerHeight > window.innerWidth) {
        createCanvas(window.innerWidth, window.innerWidth, WEBGL);
    }
    createEasyCam({ distance: 2500 });
    document.oncontextmenu = () => false;
    size = (width - (rows + 1)) / rows;
    var runbtn = createButton("Run");
    runbtn.mouseClicked(run);
    go();
}

function draw() {
    background(230);

    for (var i = 0; i < nodes.length; i++) {
        noStroke();

        var row = ~~(i / columns);
        var column = i - row * columns;
        if (nodes[i][0] == "a") {
            fill(255, 255, 255, 240);
        } else if (nodes[i][0] == "c") {
            fill(255, 0, 0, 240);
        } else if (nodes[i][0] == "e" || nodes[i][0] == "ce") {
            fill(255, 0, 255, 240);
        }
        if (nodes[i][0] == "b") {
            fill(0, 0, 255, 240);
        } else if (nodes[i][0] == "d") {
            fill(0, 0, 0, 240);
        } else if (nodes[i][0] == "p") {
            fill(0, 255, 0, 240);
        }

        push();
        translate(
            column * (size * 2) - (columns / 2) * (size * 1.5) - 2.5,
            row * (size * 2) - (rows / 2) * (size * 1.5) - 2.5,
            0
        );
        box(size);
        pop();
    }
}

async function run() {
    while (calculated[4] != finnish && calculated[4] != Infinity && started) {
        go();
        await sleep(interval);
    }
    getPath();
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
    if (best != [Infinity, Infinity, Infinity, Infinity, Infinity]) {
        return best;
    } else {
        return;
    }
}

function go() {
    if (!started) {
        started = 1;
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

        if (!start) {
            start = ~~(Math.random() * amt);
        }
        nodes[start][0] = "b";
        var row = ~~(start / columns);
        var column = start - row * columns;
        getNeighbours(nodes, row, column);

        calculated = calc(nodes);
        getNeighbours(
            nodes,
            ~~(calculated[4] / columns),
            calculated[4] - ~~(calculated[4] / columns) * columns
        );
        if (nodes[calculated[4]]) {
            nodes[calculated[4]][0] = "b";
        }
        draw_(1);

        calculated = calc(nodes);
        getNeighbours(
            nodes,
            ~~(calculated[4] / columns),
            calculated[4] - ~~(calculated[4] / columns) * columns
        );
        if (nodes[calculated[4]]) {
            nodes[calculated[4]][0] = "b";
        }
    } else {
        calculated = calc(nodes);
        getNeighbours(
            nodes,
            ~~(calculated[4] / columns),
            calculated[4] - ~~(calculated[4] / columns) * columns
        );
        if (nodes[calculated[4]]) {
            nodes[calculated[4]][0] = "b";
        }
        draw_(1);
    }
}

function draw_(a) {
    for (var i = 0; i < nodes.length; i++) {
        var row = ~~(i / columns);
        var column = i - row * columns;

        if (started) {
            var H = Math.round(
                dist(
                    column,
                    row,
                    finnish - ~~(finnish / columns) * columns,
                    ~~(finnish / columns)
                ) * 10
            );
            nodes[i][1] = H;

            var G = Math.round(
                dist(
                    column,
                    row,
                    start - ~~(start / columns) * columns,
                    ~~(start / columns)
                ) * 10
            );
            nodes[i][2] = G;
            nodes[i][3] = H + G;
        }
    }

    if (calculated[4] == finnish && a) {
        setTimeout(function () {
            alert("Yay the Path is Found!!");
        }, 3);
    }
}

function getPath() {
    var cur = finnish;
    while (cur !== start) {
        nodes[cur][0] = "p";
        cur = nodes[cur][5];
    }
    nodes[cur][0] = "p";
    draw_();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNeighbours(nodes, row, column) {
    var neighbours = [];

    // Top
    if (row == 0) {
        neighbours[neighbours.length] = (rows - 1) * columns + column;
    } else {
        neighbours[neighbours.length] = (row - 1) * columns + column;
    }

    // Bottom
    if (row == rows - 1) {
        neighbours[neighbours.length] = 0 * columns + column;
    } else {
        neighbours[neighbours.length] = (row + 1) * columns + column;
    }

    // Left
    if (column == 0) {
        neighbours[neighbours.length] = row * columns + (columns - 1);
    } else {
        neighbours[neighbours.length] = row * columns + (column - 1);
    }

    // Right
    if (column == columns - 1) {
        neighbours[neighbours.length] = row * columns + 0;
    } else {
        neighbours[neighbours.length] = row * columns + (column + 1);
    }

    // Bottom-Right
    if (column == columns - 1) {
        if (row == rows - 1) {
            neighbours[neighbours.length] = 0 * columns + 0;
        } else {
            neighbours[neighbours.length] = (row + 1) * columns + 0;
        }
    } else {
        if (row == rows - 1) {
            neighbours[neighbours.length] = 0 * columns + (column + 1);
        } else {
            neighbours[neighbours.length] = (row + 1) * columns + (column + 1);
        }
    }

    // Top-Left
    if (column == 0) {
        if (row == 0) {
            neighbours[neighbours.length] =
                (rows - 1) * columns + (columns - 1);
        } else {
            neighbours[neighbours.length] = (row - 1) * columns + (columns - 1);
        }
    } else {
        if (row == 0) {
            neighbours[neighbours.length] = (rows - 1) * columns + (column - 1);
        } else {
            neighbours[neighbours.length] = (row - 1) * columns + (column - 1);
        }
    }

    // Top-Right
    if (column == columns - 1) {
        if (row == 0) {
            neighbours[neighbours.length] = (rows - 1) * columns + 0;
        } else {
            neighbours[neighbours.length] = (row - 1) * columns + 0;
        }
    } else {
        if (row == 0) {
            neighbours[neighbours.length] = (rows - 1) * columns + (column + 1);
        } else {
            neighbours[neighbours.length] = (row - 1) * columns + (column + 1);
        }
    }

    // Bottom-Left
    if (column == 0) {
        if (row == rows - 1) {
            neighbours[neighbours.length] = 0 * columns + (columns - 1);
        } else {
            neighbours[neighbours.length] = (row + 1) * columns + (columns - 1);
        }
    } else {
        if (row == rows - 1) {
            neighbours[neighbours.length] = 0 * columns + (column - 1);
        } else {
            neighbours[neighbours.length] = (row + 1) * columns + (column - 1);
        }
    }

    if (DIAGONALS) {
        for (var i = 0; i < 8; i++) {
            if (nodes[neighbours[i]]) {
                if (nodes[neighbours[i]][0] == "a") {
                    nodes[neighbours[i]][0] = "c";
                    nodes[neighbours[i]][5] = row * columns + column;
                }
                if (nodes[neighbours[i]][0] == "e") {
                    nodes[neighbours[i]][0] = "ce";
                    nodes[neighbours[i]][5] = row * columns + column;
                }
            }
        }
    } else {
        for (var i = 0; i < 4; i++) {
            if (nodes[neighbours[i]]) {
                if (nodes[neighbours[i]][0] == "a") {
                    nodes[neighbours[i]][0] = "c";
                    nodes[neighbours[i]][5] = row * columns + column;
                }
                if (nodes[neighbours[i]][0] == "e") {
                    nodes[neighbours[i]][0] = "ce";
                    nodes[neighbours[i]][5] = row * columns + column;
                }
            }
        }
    }
}

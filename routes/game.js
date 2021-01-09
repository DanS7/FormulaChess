//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        location.href = 'splash.html';
    })
});

document.addEventListener('DOMContentLoaded', createBoard);
document.addEventListener('DOMContentLoaded', generatePieces);

//Creating the chess board
function createBoard() {
    var container = document.getElementById("board");

    for(let i = 0; i < 8; i++) {
        var row = createRow(i);
        container.appendChild(row);
    }
}

function createRow(rownum) {
    var row = document.createElement('div');
    row.id = 'row';
    for(let i = 0; i < 8; i++) {
        var testChild = document.createElement('div');
        if((rownum + i) % 2 === 0) {
            testChild.className = 'white';
        }
        else {
            testChild.className = 'black';
        }
        testChild.id = position(rownum, i);
        row.appendChild(testChild);
    }
    return row;
}

function position(rownum, colnum) {
    var x, y;
    x = 8 - rownum;
    y = String.fromCharCode(97 + colnum);
    return y.concat(x);
}

function generatePieces() {
    for(let i = 0; i < 8; i++) {
        var pawn = document.createElement('div');
        pawn.id = 'pawn';
        var pos = String.fromCharCode(97 + i);
        document.getElementById(pos.concat('7')).appendChild(pawn);
        console.log(pawn + "i = " + i);
    }
}
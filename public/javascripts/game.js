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
    //Spawning pawns | Black and White
    for(let i = 0; i < 8; i++) {
        var pawn_black = document.createElement('img');
        pawn_black.id = 'pawn';
        pawn_black.src = 'images/Black Pieces/Pawn_Black.png';
        var pos_black = String.fromCharCode(97 + i);
        document.getElementById(pos_black.concat('7')).appendChild(pawn_black);
        //console.log('pawn_black ' + "i = " + i);

        var pawn_white = document.createElement('img');
        pawn_white.id = 'pawn';
        pawn_white.src = 'images/White_Pieces/Pawn.png';
        var pos_white = String.fromCharCode(97 + i);
        document.getElementById(pos_white.concat('2')).appendChild(pawn_white);
        //console.log('pawn_white ' + "i = " + i);
    }

    //Spawning back row
    for(let i = 0; i < 8; i++) {
        var pos = String.fromCharCode(97 + i);
        var pos_black = pos.concat('8');
        var pos_white = pos.concat('1');

        switch(pos) {

        }
    }

}
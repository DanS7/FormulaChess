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
        pawn_black.className = 'chessPiece';
        pawn_black.id = 'pawn';
        pawn_black.src = 'images/Black Pieces/Pawn_Black.png';
        var pos_black = String.fromCharCode(97 + i);
        document.getElementById(pos_black.concat('7')).appendChild(pawn_black);
        //console.log('pawn_black ' + "i = " + i);

        var pawn_white = document.createElement('img');
        pawn_white.className = 'chessPiece';
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

        var white_piece = document.createElement('img');
        var black_piece = document.createElement('img');

        white_piece.className = 'chessPiece';
        black_piece.className = 'chessPiece';

        switch(pos) {
            //Rook
            case('a'):
            case('h'):
                white_piece.src = 'images/White_Pieces/Rook.png';
                white_piece.id = 'rook';

                black_piece.src = 'images/Black Pieces/Rook_Black.png';
                black_piece.id = 'rook';
                break;
            //Knight
            case('b'):
            case('g'):
                white_piece.src = 'images/White_Pieces/Knight.png';
                white_piece.id = 'knight';

                black_piece.src = 'images/Black Pieces/Knight_Black.png';
                black_piece.id = 'knight';
                break;
            //Bishop
            case('c'):
            case('f'):
                white_piece.src = 'images/White_Pieces/Bishop.png';
                white_piece.id = 'bishop';

                black_piece.src = 'images/Black Pieces/Bishop_Black.png';
                black_piece.id = 'bishop';
                break;
            //Queen
            case('d'):
                white_piece.src = 'images/White_Pieces/Queen.png';
                white_piece.id = 'queen';

                black_piece.src = 'images/Black Pieces/Queen_Black.png';
                black_piece.id = 'queen';
                break;
            //King
            case('e'):
                white_piece.src = 'images/White_Pieces/King.png';
                white_piece.id = 'king';

                black_piece.src = 'images/Black Pieces/King_Black.png';
                black_piece.id = 'king';
                break;
        }

        document.getElementById(pos_black).appendChild(black_piece);
        document.getElementById(pos_white).appendChild(white_piece);
    }

}
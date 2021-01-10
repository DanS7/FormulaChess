//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        location.href = 'splash.html';
    })
});
document.addEventListener('DOMContentLoaded', createBoard);
document.addEventListener('DOMContentLoaded', generatePieces);

//-----------Creating the chess board-------------//
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
        pawn_black.className = 'blackChessPiece';
        pawn_black.id = 'pawn';
        pawn_black.src = 'images/Black Pieces/Pawn_Black.png';
        pawn_black.addEventListener('click', handleMove);
        var pos_black = String.fromCharCode(97 + i);

        var pawn_white = document.createElement('img');
        pawn_white.className = 'whiteChessPiece';
        pawn_white.id = 'pawn';
        pawn_white.src = 'images/White_Pieces/Pawn.png';
        pawn_white.addEventListener('click', handleMove);
        var pos_white = String.fromCharCode(97 + i);

        document.getElementById(pos_black.concat('7')).appendChild(pawn_black);
        document.getElementById(pos_white.concat('2')).appendChild(pawn_white);
    }

    //Spawning back row
    for(let i = 0; i < 8; i++) {
        var pos = String.fromCharCode(97 + i);

        var pos_black = pos.concat('8');
        var pos_white = pos.concat('1');

        var white_piece = document.createElement('img');
        var black_piece = document.createElement('img');

        white_piece.className = 'whiteChessPiece';
        black_piece.className = 'blackChessPiece';

        white_piece.addEventListener('click', handleMove);
        black_piece.addEventListener('click', handleMove);

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
//------------------------------------------------//

function createPosition(posX, posY, offsetX, offsetY) {
    let newX = posX;
    let newY = posY;
    if(offsetX !== 0) {
        newX = String.fromCharCode(posX.charCodeAt(0) + offsetX);
    }
    if(offsetY !== 0) {
        newY = parseInt(posY) + parseInt(offsetY);
    }
    return newX.concat(newY);
}

function makeCircle(parent) {
    var circle = document.createElement('img');
    circle.src = 'images/circle.png';
    circle.id = 'circle';
    circle.className = parent;
    circle.addEventListener('click', makeMove);
    return circle;
}

function checkIfCircle() {
    var temp = document.getElementById('circle');
    while(temp != null) {
        temp.parentNode.removeChild(temp);
        temp = document.getElementById('circle');
    }
}

function handleMove() {
    checkIfCircle();
    const color = this.className;
    const posX = this.parentElement.id.charAt(0);
    const posY = this.parentElement.id.charAt(1);
    const type = this.id;
    switch (type) {
        case('pawn'):
            showPawnMoves(color, posX, posY);
            break;
        case('rook'):
            //TODO
            break;
        case('knight'):
            showKnightMoves(color, posX, posY);
            break;
        case('bishop'):
            showBishopMoves(color, posX, posY);
            break;
        case('king'):
            //TODO
            break;
        case('queen'):
            //TODO
            break;

    }
}

function showPawnMoves(color, posX, posY) {
    if(color === 'whiteChessPiece') {
        //We need to look above
        const nextPos = createPosition(posX, parseInt(posY) , 0, 1);
        if(document.getElementById(nextPos) != null && !document.getElementById(nextPos).hasChildNodes()) {
            document.getElementById(nextPos).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
            //Check if in start position
            if(parseInt(posY) === 2) {
                //In star position so we can move 2 spaces up
                const extraPos = createPosition(posX, parseInt(posY), 0, 2);
                if (document.getElementById(extraPos) != null && !document.getElementById(extraPos).hasChildNodes()) {
                    document.getElementById(extraPos).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
                }
            }
        }
    }

    if(color === 'blackChessPiece') {
        //We look below
        const nextPos = createPosition(posX, parseInt(posY) , 0, -1);
        if(document.getElementById(nextPos) != null && !document.getElementById(nextPos).hasChildNodes()) {
            document.getElementById(nextPos).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
            //Check if in start position
            if(parseInt(posY) === 7) {
                //In star position so we can move 2 spaces up
                const extraPos = createPosition(posX, parseInt(posY), 0, -2);
                if (document.getElementById(extraPos) != null && !document.getElementById(extraPos).hasChildNodes()) {
                    document.getElementById(extraPos).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
                }
            }
        }
    }
}

function showKnightMoves(color, posX, posY) {
    let movesX = [-1, 1];
    let movesY = [-2, 2];
    for(let i = 0; i < movesX.length; i++) {
        for(let j = 0; j < movesX.length; j++) {
            let pos1 = createPosition(posX, parseInt(posY), movesX[i], movesY[j]);
            let pos2 = createPosition(posX, parseInt(posY), movesY[i], movesX[j]);
            if (document.getElementById(pos1) != null && !document.getElementById(pos1).hasChildNodes()) {
                document.getElementById(pos1).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
            }
            if (document.getElementById(pos2) != null && !document.getElementById(pos2).hasChildNodes()) {
                document.getElementById(pos2).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
            }
        }
    }
}

function showBishopMoves(color, posX, posY) {
    //-1 -1 | -1 1 | 1 -1 | 1 1
    let moves = [-1, 1];
    let newPos = createPosition(posX, posY);
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 2; j++) {
            let k = 1;
            do {
                newPos = createPosition(posX, posY, k * moves[i], k * moves[j]);
                if(document.getElementById(newPos) != null && !document.getElementById(newPos).hasChildNodes()) {
                    document.getElementById(newPos).appendChild(makeCircle(createPosition(posX, posY, 0, 0)));
                }
                else {
                    break;
                }
                k++;
            } while (document.getElementById(newPos) != null && document.getElementById(newPos).hasChildNodes() && k < 10);
        }
    }
}


//---------//
function makeMove() {
    obj = document.getElementById(this.className).childNodes.item(0);
    document.getElementById(this.className).removeChild(obj);
    this.parentElement.appendChild(obj);
    checkIfCircle();
}
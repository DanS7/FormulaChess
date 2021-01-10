//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        location.href = 'splash.html';
    })
});
document.addEventListener('DOMContentLoaded', createBoard);
document.addEventListener('DOMContentLoaded', generatePieces);

var currentlyAttacked = [];

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
        pawn_white.src = 'images/White Pieces/Pawn_White.png';
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
                white_piece.src = 'images/White Pieces/Rook_White.png';
                white_piece.id = 'rook';

                black_piece.src = 'images/Black Pieces/Rook_Black.png';
                black_piece.id = 'rook';
                break;
            //Knight
            case('b'):
            case('g'):
                white_piece.src = 'images/White Pieces/Knight_White.png';
                white_piece.id = 'knight';

                black_piece.src = 'images/Black Pieces/Knight_Black.png';
                black_piece.id = 'knight';
                break;
            //Bishop
            case('c'):
            case('f'):
                white_piece.src = 'images/White Pieces/Bishop_White.png';
                white_piece.id = 'bishop';

                black_piece.src = 'images/Black Pieces/Bishop_Black.png';
                black_piece.id = 'bishop';
                break;
            //Queen
            case('d'):
                white_piece.src = 'images/White Pieces/Queen_White.png';
                white_piece.id = 'queen';

                black_piece.src = 'images/Black Pieces/Queen_Black.png';
                black_piece.id = 'queen';
                break;
            //King
            case('e'):
                white_piece.src = 'images/White Pieces/King_White.png';
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
    let circle = document.createElement('img');
    circle.src = 'images/circle.png';
    circle.id = 'circle';
    circle.className = parent;
    circle.addEventListener('click', makeMove);
    return circle;
}

function spawnCircle(spawnPos, parentPos) {
    let parent = document.getElementById(parentPos).childNodes[0];
    //console.log(parent);
    if(document.getElementById(spawnPos) != null) {
        if(!document.getElementById(spawnPos).hasChildNodes()) {
            document.getElementById(spawnPos).appendChild(makeCircle(parentPos));
            return true;
        }
        else {
            //console.log(document.getElementById(spawnPos));
            let attackedPiece = document.getElementById(spawnPos).childNodes[0];
            if(attackedPiece.className !== parent.className) {
                console.log("Can attack piece at " + spawnPos);
                if(!document.getElementById(spawnPos).childNodes[0].className.includes('Attacked')) {
                    document.getElementById(spawnPos).childNodes[0].className += 'Attacked' + parentPos.toString();
                    currentlyAttacked[++currentlyAttacked.length] = document.getElementById(spawnPos).childNodes[0];
                }
            }
        }
    }
    return false;
}

function checkIfCircle() {
    let temp = document.getElementById('circle');
    while(temp != null) {
        temp.parentNode.removeChild(temp);
        temp = document.getElementById('circle');
    }

    for(let i = 0; i < currentlyAttacked.length; i++) {
        if(typeof currentlyAttacked[i] != "undefined") {
            if (currentlyAttacked[i].className.includes('white')) {
                currentlyAttacked[i].className = 'whiteChessPiece';
            } else if (currentlyAttacked[i].className.includes('black')) {
                currentlyAttacked[i].className = 'blackChessPiece';
            }
            console.log(currentlyAttacked[i]);
            currentlyAttacked[i] = null;
        }
    }
    currentlyAttacked = [];
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
            showRookMoves(color, posX, posY);
            break;
        case('knight'):
            showKnightMoves(color, posX, posY);
            break;
        case('bishop'):
            showBishopMoves(color, posX, posY);
            break;
        case('king'):
            showKingMoves(color, posX, posY);
            break;
        case('queen'):
            showQueenMoves(color, posX, posY);
            break;

    }
}

function showPawnMoves(color, posX, posY) {
    let thisPos = createPosition(posX, posY, 0, 0);
    if(color === 'whiteChessPiece') {
        //We need to look above
        const nextPos = createPosition(posX, parseInt(posY) , 0, 1);
        if(document.getElementById(nextPos) != null && !document.getElementById(nextPos).hasChildNodes()) {
            spawnCircle(nextPos, thisPos);
            //Check if in start position
            if(parseInt(posY) === 2) {
                //In star position so we can move 2 spaces up
                const extraPos = createPosition(posX, parseInt(posY), 0, 2);
                spawnCircle(extraPos, thisPos);
            }
        }
    }

    if(color === 'blackChessPiece') {
        //We look below
        const nextPos = createPosition(posX, parseInt(posY) , 0, -1);
        if(document.getElementById(nextPos) != null && !document.getElementById(nextPos).hasChildNodes()) {
            spawnCircle(nextPos, thisPos);
            //Check if in start position
            if(parseInt(posY) === 7) {
                //In star position so we can move 2 spaces up
                const extraPos = createPosition(posX, parseInt(posY), 0, -2);
                spawnCircle(extraPos, thisPos);
            }
        }
    }
}

function showKnightMoves(color, posX, posY) {
    let movesX = [-1, 1];
    let movesY = [-2, 2];
    let thisPos = createPosition(posX, posY, 0, 0);
    for(let i = 0; i < movesX.length; i++) {
        for(let j = 0; j < movesX.length; j++) {
            let pos1 = createPosition(posX, parseInt(posY), movesX[i], movesY[j]);
            let pos2 = createPosition(posX, parseInt(posY), movesY[i], movesX[j]);
            spawnCircle(pos1, thisPos);
            spawnCircle(pos2, thisPos);
        }
    }
}

function showBishopMoves(color, posX, posY) {
    //-1 -1 | -1 1 | 1 -1 | 1 1
    let moves = [-1, 1];
    let thisPos = createPosition(posX, posY, 0, 0);
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 2; j++) {
            let k = 1;
            let newPos;
            do {
                newPos = createPosition(posX, posY, k * moves[i], k * moves[j]);
                if(!spawnCircle(newPos, thisPos)) {
                    break;
                }
                k++;
            } while (document.getElementById(newPos) != null && document.getElementById(newPos).hasChildNodes() && k < 10);
        }
    }
}

function showRookMoves(color, posX, posY) {
    let thisPos = createPosition(posX, posY, 0, 0);
    let moves = [-1, 1];
    for(let i = 0; i < moves.length; i++) {
        let newPos;
        let k = 1;
        do {
            newPos = createPosition(posX, posY, k * moves[i], 0);
            if(!spawnCircle(newPos, thisPos)) {
                break;
            }
            console.log("something!");
            k++;
        } while(document.getElementById(newPos) != null && document.getElementById(newPos).hasChildNodes() && k < 9);
        k = 1;
        do {
            newPos = createPosition(posX, posY, 0, k * moves[i]);
            if(!spawnCircle(newPos, thisPos)) {
                break;
            }
            k++;
        } while(document.getElementById(newPos) != null && document.getElementById(newPos).hasChildNodes() && k < 9);
    }
}

function showQueenMoves(color, posX, posY) {
    showRookMoves(color, posX, posY);
    showBishopMoves(color, posX, posY);
}

function showKingMoves(color, posX, posY) {
    let thisPos = createPosition(posX, posY, 0, 0);
    let moves = [-1, 0, 1];
    for(let i = 0; i < moves.length; i++) {
        for(let j = 0; j < moves.length; j++) {
            let newPos = createPosition(posX, posY, moves[i], moves[j]);
            spawnCircle(newPos, thisPos);
        }
    }
}

//---------//
function makeMove() {
    let obj = document.getElementById(this.className).childNodes.item(0);
    document.getElementById(this.className).removeChild(obj);
    this.parentElement.appendChild(obj);
    checkIfCircle();
}
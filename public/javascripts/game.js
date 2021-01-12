//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        location.href = 'splash.html';
    })
});
document.addEventListener('DOMContentLoaded', setup);
let socket;
let playerColor;

//-----------Creating the chess board-------------//
function createBoard() {
    const container = document.getElementById("board");

    for(let i = 0; i < 8; i++) {
        const row = createRow(i);
        container.appendChild(row);
    }
}

function createRow(rownum) {
    const row = document.createElement('div');
    row.id = 'row';
    for(let i = 0; i < 8; i++) {
        const testChild = document.createElement('div');
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
    let x, y;
    x = 8 - rownum;
    y = String.fromCharCode(97 + colnum);
    return y.concat(x);
}

function generatePieces() {
    let pos_white;
    let pos_black;
//Spawning pawns | Black and White
    for(let i = 0; i < 8; i++) {
        const pawn_black = document.createElement('img');
        pawn_black.className = 'blackChessPiece';
        pawn_black.className += 'Pawn';
        pawn_black.src = 'images/Black Pieces/Pawn_Black.png';
        pawn_black.addEventListener('click', handleMove);
        pos_black = String.fromCharCode(97 + i);

        const pawn_white = document.createElement('img');
        pawn_white.className = 'whiteChessPiece';
        pawn_white.className += 'Pawn';
        pawn_white.src = 'images/White Pieces/Pawn_White.png';
        pawn_white.addEventListener('click', handleMove);
        pos_white = String.fromCharCode(97 + i);

        document.getElementById(pos_black.concat('7')).appendChild(pawn_black);
        document.getElementById(pos_white.concat('2')).appendChild(pawn_white);
    }

    //Spawning back row
    for(let i = 0; i < 8; i++) {
        const pos = String.fromCharCode(97 + i);

        pos_black = pos.concat('8');
        pos_white = pos.concat('1');

        const white_piece = document.createElement('img');
        const black_piece = document.createElement('img');

        white_piece.className = 'whiteChessPiece';
        black_piece.className = 'blackChessPiece';

        white_piece.addEventListener('click', handleMove);
        black_piece.addEventListener('click', handleMove);

        switch(pos) {
            //Rook
            case('a'):
            case('h'):
                white_piece.src = 'images/White Pieces/Rook_White.png';
                white_piece.className += 'Rook';

                black_piece.src = 'images/Black Pieces/Rook_Black.png';
                black_piece.className += 'Rook';
                break;
            //Knight
            case('b'):
            case('g'):
                white_piece.src = 'images/White Pieces/Knight_White.png';
                white_piece.className += 'Knight';

                black_piece.src = 'images/Black Pieces/Knight_Black.png';
                black_piece.className += 'Knight';
                break;
            //Bishop
            case('c'):
            case('f'):
                white_piece.src = 'images/White Pieces/Bishop_White.png';
                white_piece.className += 'Bishop';

                black_piece.src = 'images/Black Pieces/Bishop_Black.png';
                black_piece.className += 'Bishop';
                break;
            //Queen
            case('d'):
                white_piece.src = 'images/White Pieces/Queen_White.png';
                white_piece.className += 'Queen';

                black_piece.src = 'images/Black Pieces/Queen_Black.png';
                black_piece.className += 'Queen';
                break;
            //King
            case('e'):
                white_piece.src = 'images/White Pieces/King_White.png';
                white_piece.className += 'King';

                black_piece.src = 'images/Black Pieces/King_Black.png';
                black_piece.className += 'King';
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
    circle.className = parent;
    circle.className += 'Circle';
    circle.addEventListener('click', makeMove);
    return circle;
}

function spawnCircle(spawnPos, parentPos) {
    let parent = document.getElementById(parentPos).childNodes[0];
    let parentColor;
    if(parent.className.includes('white')) {
        parentColor = 'white';
    }
    else {
        parentColor = 'black';
    }

    let square = document.getElementById(spawnPos);
    if(square != null) {
        if(square.hasChildNodes()) {
            let attackedPiece = square.childNodes[0];
            if(!attackedPiece.className.includes(parentColor) && !attackedPiece.className.includes('Attacked')) {
                attackedPiece.className += 'Attacked' + parentPos;
                attackedPiece.addEventListener('click', takePiece);
            }
        }
        else {
            square.appendChild(makeCircle(parentPos));
            return true;
        }
    }
    return false;
}

function checkIfCircle() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes('Circle')) {
            img[i].parentNode.removeChild(img[i]);
        }
        else if(img[i].className.includes('Attacked')) {
            img[i].className = img[i].className.replace('Attacked', '');
            img[i].className = img[i].className.substr(0, img[i].className.length - 2);
        }
    }
}

function handleMove() {
    checkIfCircle();
    let color;
    if(this.className.includes('white')) {
        color = 'white';
    }
    else {
        color = 'black';
    }
    const posX = this.parentElement.id.charAt(0);
    const posY = this.parentElement.id.charAt(1);
    const type = this.className.replace('whiteChessPiece', '').replace('blackChessPiece', '');
    switch (type) {
        case('Pawn'):
            showPawnMoves(color, posX, posY);
            break;
        case('Rook'):
            showRookMoves(color, posX, posY);
            break;
        case('Knight'):
            showKnightMoves(color, posX, posY);
            break;
        case('Bishop'):
            showBishopMoves(color, posX, posY);
            break;
        case('King'):
            showKingMoves(color, posX, posY);
            break;
        case('Queen'):
            showQueenMoves(color, posX, posY);
            break;

    }
}

function showPawnMoves(color, posX, posY) {
    let thisPos = createPosition(posX, posY, 0, 0);
    if(color === 'white') {
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

    if(color === 'black') {
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

function makeMove() {

    let oldCoords = this.className.replace('Circle', '');
    let newCoords = this.parentElement.id;
    checkIfCircle();
    //Remove object from old position
    let piece = document.getElementById(oldCoords).childNodes[0];
    document.getElementById(oldCoords).removeChild(piece);
    //Add it to the new position
    document.getElementById(newCoords).appendChild(piece);

    disableMoves();

    moveWasMade(oldCoords, newCoords);
    //Coordinates work, Dan needs to look how to interpret them
    //coordinates format: "d1d2", "e4a1", etc.
    //format: initialPosition + finalPosition
}

function makeOpponentMove(data) {
    let oldPos = data.substr(0, 2);
    let newPos = data.substr(2, 2);
    console.log("Opponent moved " + oldPos + " to " + newPos);

    let piece = document.getElementById(oldPos).childNodes[0];
    piece.parentElement.removeChild(piece);

    while(document.getElementById(newPos).hasChildNodes()) {
        document.getElementById(newPos).removeChild(document.getElementById(newPos).childNodes[0]);
    }
    document.getElementById(newPos).appendChild(piece);

    enableMoves();
}

function takePiece() {
    console.log("Took piece.");
    let oldPos = this.className.substr(this.className.length - 2, 2);
    let newPos = this.parentElement.id;
    console.log(oldPos + " " + newPos);
    let takerPiece = document.getElementById(oldPos).childNodes[0];
    let takenPiece = document.getElementById(newPos).childNodes[0];
    document.getElementById(newPos).removeChild(takenPiece);
    document.getElementById(newPos).appendChild(takerPiece);

    checkIfCircle();
    disableMoves();
    moveWasMade(oldPos, newPos);
}

function enableMoves() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes(playerColor + 'ChessPiece')) {
            img[i].addEventListener('click', handleMove);
        }
    }
}

function disableMoves() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        img[i].removeEventListener('click', handleMove);
    }
}

//Sets up the websocket when a user enters game.html
//TODO:
//Make the port responsive
function setup() {
    socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
        console.log("check"); //helps the dev to see if it works
        createBoard(); //Create the chess board
        generatePieces(); //Generate the pieces and their eventListeners
    };
    socket.onclose = function () {
        socket.send("bye bye"); //helps the dev
    };
    socket.onmessage = function (event) {
        //console.log(event.data); //helps the dev
        //TODO Here u should make some javascript and transmit the move to the front-end
        let message = JSON.parse(event.data);
        switch (message.type) {
            case "PLAYER-TYPE":
                if(message.data === 'White') {
                    playerColor = 'white';
                    restrict('black'); //Only enable black chess pieces to be moved
                    console.log("You are white!");
                }
                else {
                    playerColor = 'black';
                    disableMoves(); //White starts so black cannot move at first
                    restrict('white'); //Only enable white chess pieces to be moved
                    console.log("You are black!");
                }
                break;
            case "SET-MOVE":
                //console.log(message.data);
                makeOpponentMove(message.data);
                //make this move, string is in message.data
                break;
            case "GAME-ABORTED":
                //TODO: YOU WIN MESSAGE
                window.location.replace("http://localhost:3000");
                socket.close();
                break;
        }
    }
}

function restrict(disable) {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes(disable)) {
            img[i].removeEventListener('click', handleMove);
        }
    }
}

function moveWasMade(oldC, newC) {
    socket.send(oldC + newC);
    //Here block the player from making other moves
    //Until opponent moves
}
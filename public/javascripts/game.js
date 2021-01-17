//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        disconnectSocket();
        location.href = "/";
    })
});
document.addEventListener('DOMContentLoaded', setup);

let socket;
let playerColor;
let currentlyAttacked = [];
let inCheck;
let currentMoves = [];
let kingMoved = false;
let leftRookMoved = false;      // a1, h8
let rightRookMoved = false;     // a8, h1
let castling = false;

//-----------Creating the chess board-------------//
function createBoard() {
    const container = document.getElementById("board");
    if(playerColor === 'white') {
        for (let i = 0; i < 8; i++) {
            const row = createRow(i);
            container.appendChild(row);
        }
    }
    else {
        for(let i = 7; i >= 0; i--) {
            const row = createRow(i);
            container.appendChild(row);
        }
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
        pawn_black.addEventListener('click', helper);
        pos_black = String.fromCharCode(97 + i);

        const pawn_white = document.createElement('img');
        pawn_white.className = 'whiteChessPiece';
        pawn_white.className += 'Pawn';
        pawn_white.src = 'images/White Pieces/Pawn_White.png';
        pawn_white.addEventListener('click', helper);
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

        white_piece.addEventListener('click', helper);
        black_piece.addEventListener('click', helper);

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
function helper() {
    handleMove(this, spawnCircle);
}

function removeCircle() {
    checkIfCircle();
    this.removeEventListener('click', removeCircle);
    this.addEventListener('click', helper);
}

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
    let parentColor = playerColor;
    let square = document.getElementById(spawnPos);
    if(square != null) {
        if(square.hasChildNodes()) {
            let attackedPiece = square.childNodes[0];
            if(!attackedPiece.className.includes(parentColor) && !attackedPiece.className.includes('Attacked')) {
                attackedPiece.className += 'Attacked' + parentPos;
                attackedPiece.id = 'active-button';
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
    while(document.getElementById('active-button')) {
        document.getElementById('active-button').id = '';
    }
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        img[i].removeEventListener('click', takePiece);
        if(img[i].className.includes('Circle')) {
            img[i].parentNode.removeChild(img[i]);
        }
        else if(img[i].className.includes('Attacked')) {
            img[i].className = img[i].className.replace('Attacked', '');
            img[i].className = img[i].className.substr(0, img[i].className.length - 2);
        }
    }
}

function handleMove(obj, res, flag) {
    if(flag == null) {
        flag = false;
    }
    if(!flag) {
        currentMoves = [];
        let img = document.querySelectorAll('img');
        for(let i = 0; i < img.length; i++) {
            if(img[i].className.includes(playerColor + 'ChessPiece')) {
                img[i].removeEventListener('click', removeCircle);
                img[i].addEventListener('click', helper);
            }
        }
        obj.removeEventListener('click', helper);
        obj.addEventListener('click', removeCircle);
    }
    checkIfCircle();
    let color = obj.className.substr(0, 5);
    const posX = obj.parentElement.id.charAt(0);
    const posY = obj.parentElement.id.charAt(1);

    if(!flag) {
        //console.log(createPosition(posX, posY, 0, 0));
    }

    const type = obj.className.replace('whiteChessPiece', '').replace('blackChessPiece', '').replace('Check', '');
    switch (type) {
        case('Pawn'):
            showPawnMoves(color, posX, posY, res, flag);
            break;
        case('Rook'):
            showRookMoves(posX, posY, res, flag);
            break;
        case('Knight'):
            showKnightMoves(posX, posY, res, flag);
            break;
        case('Bishop'):
            showBishopMoves(posX, posY, res, flag);
            break;
        case('King'):
            showKingMoves(posX, posY, res, flag);
            break;
        case('Queen'):
            showQueenMoves(posX, posY, res, flag);
            break;

    }
}

function showPawnMoves(color, posX, posY, res, flag) {
    let thisPos = createPosition(posX, posY, 0, 0);
    let offset = 1;
    if(color === 'black') {
        offset = -1;
    }
    const nextPos = createPosition(posX, parseInt(posY) , 0, offset);

    if (!flag) {
        if(document.getElementById(nextPos) != null && !document.getElementById(nextPos).hasChildNodes() && testPosition(nextPos, thisPos)) {
            currentMoves[currentMoves.length++] = nextPos;
        }
        //Check if pawn in start position
        const extraPos = createPosition(posX, parseInt(posY), 0, 2 * offset);
        if(((color === 'black' && parseInt(posY) === 7) || (color === 'white' && parseInt(posY) === 2)) &&
            !document.getElementById(extraPos).hasChildNodes() &&
            testPosition(extraPos, thisPos)) {
            currentMoves[currentMoves.length++] = extraPos;
        }
    }

    //Check if pawn can attack
    let attackPos1 = createPosition(posX, posY, -1, offset);
    let attackPos2 = createPosition(posX, posY, 1, offset);
    if(flag) {
        checkLastPiece(attackPos1, thisPos, res, flag);
        checkLastPiece(attackPos2, thisPos, res, flag);
    }
    else {
        if(document.getElementById(attackPos1) != null && document.getElementById(attackPos1).hasChildNodes() && testPosition(attackPos1, thisPos)) {
            currentMoves[currentMoves.length++] = attackPos1;
        }
        if(document.getElementById(attackPos2) != null && document.getElementById(attackPos2).hasChildNodes() && testPosition(attackPos2, thisPos)){
            currentMoves[currentMoves.length++] = attackPos2;
        }
    }
    if(!flag) {
        //console.log(currentMoves);
        for (let i = 0; i < currentMoves.length; i++) {
            spawnCircle(currentMoves[i], thisPos);
        }
    }
}

function showKnightMoves(posX, posY, res, flag) {
    let movesX = [-1, 1];
    let movesY = [-2, 2];
    let thisPos = createPosition(posX, posY, 0, 0);
    for(let i = 0; i < movesX.length; i++) {
        for(let j = 0; j < movesX.length; j++) {
            let pos1 = createPosition(posX, parseInt(posY), movesX[i], movesY[j]);
            let pos2 = createPosition(posX, parseInt(posY), movesY[i], movesX[j]);
            if(flag) {
                checkLastPiece(pos1, thisPos, res, flag);
                checkLastPiece(pos2, thisPos, res, flag);
            }
            else {
                if(testPosition(pos1, thisPos)) {
                    currentMoves[currentMoves.length++] = pos1;
                }
                if(testPosition(pos2, thisPos)) {
                    currentMoves[currentMoves.length++] = pos2;
                }
            }
        }
    }
    if(!flag) {
        for (let i = 0; i < currentMoves.length; i++) {
            spawnCircle(currentMoves[i], thisPos);
        }
    }
}

function showBishopMoves(posX, posY, res, flag) {
    //-1 -1 | -1 1 | 1 -1 | 1 1
    let moves = [-1, 1];
    let thisPos = createPosition(posX, posY, 0, 0);
    for(let i = 0; i < 2; i++) {
        for(let j = 0; j < 2; j++) {
            let k = 1;
            let newPos;
            do {
                newPos = createPosition(posX, posY, k * moves[i], k * moves[j]);
                //console.log("New pos: " + newPos);
                if(!positionInGrid(newPos) ||
                    (document.getElementById(newPos).hasChildNodes() && document.getElementById(newPos).childNodes[0].className.includes(playerColor))){
                    //console.log("broke at: " + newPos);
                    break;
                }
                else if(flag) {
                    res(newPos, thisPos);
                }
                else if(testPosition(newPos, thisPos)){
                    currentMoves[currentMoves.length++] = newPos;
                }
                k++;
            } while (document.getElementById(newPos) != null && !document.getElementById(newPos).hasChildNodes());
            if(flag) {
                checkLastPiece(newPos, thisPos, res, flag);
            }
        }
    }
    if(!flag) {
        for (let i = 0; i < currentMoves.length; i++) {
            spawnCircle(currentMoves[i], thisPos);
        }
    }
}

function showRookMoves(posX, posY, res, flag) {
    let thisPos = createPosition(posX, posY, 0, 0);
    if(!flag && (thisPos === 'a1' || thisPos === 'h8')) {
        leftRookMoved = true;
    }
    if(!flag && (thisPos === 'a8' || thisPos === 'h1')) {
        rightRookMoved = true;
    }
    let moves = [-1, 1];
    for(let i = 0; i < moves.length; i++) {
        let newPos;
        let k = 1;
        do {
            newPos = createPosition(posX, posY, k * moves[i], 0);
            //console.log("pos: " + newPos);
            if(!positionInGrid(newPos) ||
                (document.getElementById(newPos).hasChildNodes() && document.getElementById(newPos).childNodes[0].className.includes(playerColor))) {
                //console.log("broke");
                break;
            }
            else if(flag) {
                res(newPos, thisPos);
            }
            else if(testPosition(newPos, thisPos)){
                currentMoves[currentMoves.length++] = newPos;
            }
            k++;
        } while(document.getElementById(newPos) != null && !document.getElementById(newPos).hasChildNodes() && k < 9);
        if(flag) {
            checkLastPiece(newPos, thisPos, res, flag);
        }
        k = 1;
        do {
            newPos = createPosition(posX, posY, 0, k * moves[i]);
            //console.log("pos: " + newPos);
            if(!positionInGrid(newPos) ||
                (document.getElementById(newPos).hasChildNodes() && document.getElementById(newPos).childNodes[0].className.includes(playerColor))) {
                //console.log("broke");
                break;
            }
            else if(flag) {
                res(newPos, thisPos);
            }
            else if(testPosition(newPos, thisPos)){
                currentMoves[currentMoves.length++] = newPos;
            }
            k++;
        } while(document.getElementById(newPos) != null && !document.getElementById(newPos).hasChildNodes() && k < 9);
        if(flag) {
            checkLastPiece(newPos, thisPos, res, flag);
        }
    }
    if(!flag) {
        for (let i = 0; i < currentMoves.length; i++) {
            spawnCircle(currentMoves[i], thisPos);
        }
    }
}

function showQueenMoves(posX, posY, res, flag) {
    checkIfCircle();
    showRookMoves(posX, posY, res, flag);
    checkIfCircle();
    showBishopMoves(posX, posY, res, flag);
}

function showKingMoves(posX, posY, res, flag) {
    let thisPos = createPosition(posX, posY, 0, 0);
    let moves = [-1, 0, 1];
    for(let i = 0; i < moves.length; i++) {
        for(let j = 0; j < moves.length; j++) {
            let newPos = createPosition(posX, posY, moves[i], moves[j]);
            //console.log(newPos);
            if(positionInGrid(newPos)) {
                if(!document.getElementById(newPos).hasChildNodes() ||
                    (document.getElementById(newPos).hasChildNodes() &&
                    !document.getElementById(newPos).childNodes[0].className.includes(playerColor))) {
                    if(!flag) {
                        //console.log(newPos + " and attackedByKing: " + attackedByKing(newPos));
                    }
                    if(!flag && testPosition(newPos, thisPos) && !attackedByKing(newPos)) {
                        //console.log("King can move at: " + newPos);
                        currentMoves[currentMoves.length++] = newPos;
                    }
                    if(flag) {
                        res(newPos, thisPos);
                    }
                }
            }
        }
    }

    //Check for castling
    if(!kingMoved && !flag) {
        //Look for rook to the left and right
        //Looking to the left first
        if(!leftRookMoved) {
            checkCastling(posX, posY, -1);
        }
        if(!rightRookMoved) {
            checkCastling(posX, posY, 1);
        }
    }

    if(!flag) {
        //console.log(currentMoves);
        for (let i = 0; i < currentMoves.length; i++) {
            spawnCircle(currentMoves[i], thisPos);
        }
    }
}

function checkCastling(posX, posY, offset) {
    let k = offset;
    let newPos = createPosition(posX, posY, k, 0);
    while (positionInGrid(newPos) && !document.getElementById(newPos).hasChildNodes()) {
        k += offset;
        newPos = createPosition(posX, posY, k, 0);
    }
    //Found a square to the left that has a piece on it
    //Or we are out of the grid
    //If we are still on the board -> We need to check if the piece is our rook
    if (positionInGrid(newPos) && document.getElementById(newPos).childNodes[0].className.includes('Rook')) {
        //Castling to the left available
        let kingPos = createPosition(posX, posY, 2 * offset, 0);   //Position of king after castling
        let rookPos = createPosition(posX, posY, offset, 0);
        //We need to check if kingPos and rookPos are not attacked
        findAttackedPositions();
        if(currentMoves.includes(rookPos) && !currentlyAttacked.includes(kingPos)) {
            currentMoves[currentMoves.length++] = kingPos;
            //console.log("Castling available");
            castling = true;
        }
    }
}

function attackedByKing(pos) {
    let opponentColor;
    if(playerColor === 'white') {
        opponentColor = 'black';
    }
    else {
        opponentColor = 'white';
    }
    let king = document.getElementsByClassName(opponentColor + 'ChessPieceKing')[0];
    //console.log(king);
    let kingPos = king.parentNode.id;
    let attacked = [];
    let moves = [-1, 0, 1];
    for(let i = 0; i < moves.length; i++) {
        for(let j = 0; j < moves.length; j++) {
            attacked[attacked.length++] = createPosition(kingPos.substr(0, 1), kingPos.substr(1, 1), moves[i], moves[j]);
        }
    }
    //console.log(attacked);
    return attacked.includes(pos);

}

function checkLastPiece(newPos, thisPos, res, flag) {
    if(flag && document.getElementById(newPos) != null && document.getElementById(newPos).hasChildNodes()) {
        let obj = document.getElementById(newPos).childNodes[0];
        //console.log(obj.className.substr(0, 5) + " - " + document.getElementById(thisPos).childNodes[0].className.substr(0, 5));
        if(obj.className.substr(0, 5) !== document.getElementById(thisPos).childNodes[0].className.substr(0, 5)) {
            res(newPos, thisPos);
        }
    }
    else if(flag && document.getElementById(newPos) != null && !document.getElementById(newPos).hasChildNodes()) {
        res(newPos, thisPos);
    }
}

function makeMove() {

    let oldCoords = this.className.replace('Circle', '');
    let newCoords = this.parentElement.id;
    checkIfCircle();
    //Remove object from old position
    let piece = document.getElementById(oldCoords).childNodes[0];
    if(piece.className.includes('King')) {
        //console.log("King moved!");
        kingMoved = true;
    }
    document.getElementById(oldCoords).removeChild(piece);
    //Add it to the new position
    document.getElementById(newCoords).appendChild(piece);

    //Check if we castled and move rook if we did
    piece = document.getElementById(newCoords).childNodes[0];
    if(piece.className.includes('King') && castling === true) {
        //console.log("Castling...");
        //We need to move the rook
        if(newCoords === 'c1') {
            let rook = document.getElementById('a1').childNodes[0];
            rook.parentNode.removeChild(rook);
            document.getElementById('d1').appendChild(rook);
            moveWasMade('a1', 'd1');
        }
        else if(newCoords === 'g1') {
            let rook = document.getElementById('h1').childNodes[0];
            rook.parentNode.removeChild(rook);
            document.getElementById('f1').appendChild(rook);
            moveWasMade('h1', 'f1');
        }
        else if(newCoords === 'g8') {
            let rook = document.getElementById('h8').childNodes[0];
            rook.parentNode.removeChild(rook);
            document.getElementById('f8').appendChild(rook);
            moveWasMade('h8', 'f8');
        }
        else if(newCoords === 'c8') {
            let rook = document.getElementById('a8').childNodes[0];
            rook.parentNode.removeChild(rook);
            document.getElementById('d8').appendChild(rook);
            moveWasMade('a8', 'd8');
        }
    }

    disableMoves();

    moveWasMade(oldCoords, newCoords);

    //Coordinates work, Dan needs to look how to interpret them
    //coordinates format: "d1d2", "e4a1", etc.
    //format: initialPosition + finalPosition
}

function makeOpponentMove(data) {
    let oldPos = data.substr(0, 2);
    let newPos = data.substr(2, 2);

    let piece = document.getElementById(oldPos).childNodes[0];
    piece.parentElement.removeChild(piece);
    //console.log(piece);

    while(document.getElementById(newPos).hasChildNodes()) {
        document.getElementById(newPos).removeChild(document.getElementById(newPos).childNodes[0]);
    }
    document.getElementById(newPos).appendChild(piece);
    enableMoves();
    inCheck = checkCondition();
    if(inCheck) {
        if(checkMate()) {
            socket.send("MATE");
            console.log("MATE!");
        }
    }
    checkIfCircle();
    let opponentColor;
    if(playerColor === "white") {
        opponentColor = "black";
    }
    else {
        opponentColor = "white";
    }
    logMove(oldPos, newPos, opponentColor);
}

function takePiece() {
    let oldPos = this.className.substr(this.className.length - 2, 2);
    let newPos = this.parentElement.id;
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
            img[i].addEventListener('click', helper);
        }
    }
    //checkCondition();
}

function disableMoves() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        img[i].removeEventListener('click', helper);
    }
    let king = document.getElementsByClassName(playerColor + 'ChessPieceKingCheck')[0];
    if(typeof king != 'undefined') {
        king.className = king.className.replace('Check', '');
    }
}

function findAttackedPositions() {
    currentlyAttacked.length = 0;

    let opponentColor;
    if(playerColor === 'white') {
        opponentColor = 'black';
    }
    else {
        opponentColor = 'white';
    }
    let opponentPieces = document.querySelectorAll('img');
    //console.log(opponentPieces);
    for(let i = 0; i < opponentPieces.length; i++) {
        if(opponentPieces[i].className.includes(opponentColor + 'ChessPiece')) {
            //console.log(opponentPieces[i]);
            handleMove(opponentPieces[i], isValidPosition, true);
            checkIfCircle();
        }
    }
}

function isValidPosition(param1, param2) {
    //console.log(param1);
    currentlyAttacked[currentlyAttacked.length++] = param1;
    return true;
}

function checkCondition() {
    findAttackedPositions();
    let king = document.getElementsByClassName(playerColor + 'ChessPieceKing')[0];
    if(typeof king == 'undefined') {
        king = document.getElementsByClassName(playerColor + 'ChessPieceKingCheck')[0];
        //console.log("undefined");
    }
    //console.log(king);
    //console.log(currentlyAttacked);
    let kingPos = king.parentNode.id;
    if(currentlyAttacked.includes(kingPos)) {
        if(!king.className.includes('Check')) {
            king.className += 'Check';
        }
        //console.log(playerColor + " King is at position: " + king.parentNode.id);
        //console.log("King is attacked by " + findNrOfAttackers(kingPos) + " pieces.");
        return true;
    }
    else {
        return false;
    }
}

function checkMate() {
    let playerPieces = document.querySelectorAll('img');
    for(let i = 0; i < playerPieces.length; i++) {
        if(playerPieces[i].className.includes(playerColor + 'ChessPiece')) {
            //Found a player piece
            //We need to check if any moves can be made
            checkIfCircle();
            handleMove(playerPieces[i], isValidPosition(), false);
            if(currentMoves.length > 0) {
                //console.log("Found move for piece: ");
                //console.log(playerPieces[i]);
                //console.log(currentMoves);
                return false;
            }
        }
    }
    return true;
}

function testPosition(pos, parentPos) {
    if(document.getElementById(pos) == null) {
        return false;
    }
    let parent = document.getElementById(parentPos).childNodes[0];
    //parent.className = document.getElementById(parentPos).childNodes[0].className;
    //console.log(parent);
    parent.parentNode.removeChild(parent); //Removing the piece from its initial position
    //Simulating the take piece if the position attacks another piece
    let opponentPiece = null;
    if(document.getElementById(pos).hasChildNodes() && !document.getElementById(pos).childNodes[0].className.includes(playerColor)) {
        opponentPiece = document.getElementById(pos).childNodes[0];
        document.getElementById(pos).removeChild(opponentPiece);
    }
    document.getElementById(pos).appendChild(parent); //Moving it to the testing position
    //console.log(document.getElementById(pos));
    let valid = !checkCondition();
    //console.log("Testing position: " + pos + " and valid is " + valid);
    document.getElementById(pos).removeChild(parent); //Removing piece from test position
    document.getElementById(parentPos).appendChild(parent); //Placing piece back in its original position

    let king = document.getElementsByClassName(playerColor + 'ChessPieceKingCheck')[0];
    if(typeof king != 'undefined' && !inCheck) {
        king.className = king.className.replace('Check', '');
    }
    if(opponentPiece != null) {
        document.getElementById(pos).appendChild(opponentPiece);
    }
    return valid;
}

function positionInGrid(pos) {
    let posX = pos.substr(0, 1);
    let posY = pos.substr(1, 1);
    if(posX.charCodeAt(0) < 97 || posX.charCodeAt(0) > 104) {
        return false;
    }
    if(parseInt(posY) < 1 || parseInt(posY) > 8) {
        return false;
    }
    return true;
}

//Sets up the websocket when a user enters game.html
//TODO:
//Make the port responsive
function setup() {
    socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function () {
        console.log("check"); //helps the dev to see if it works
    };
    socket.onclose = function () {
        socket.send("bye bye"); //helps the dev
    };
    socket.onmessage = function (event) {
        let message = JSON.parse(event.data);
        switch (message.type) {
            case "PLAYER-TYPE":
                if(message.data === 'White') {
                    playerColor = 'white';
                    createBoard(); //Create the chess board
                    generatePieces(); //Generate the pieces and their eventListeners
                    restrict('black'); //Only enable black chess pieces to be moved
                    console.log("You are white!");
                }
                else {
                    playerColor = 'black';
                    createBoard(); //Create the chess board
                    generatePieces(); //Generate the pieces and their eventListeners
                    restrict('white'); //Only enable white chess pieces to be moved
                    disableMoves(); //White starts so black cannot move at first
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
            case "GAME-WON-BY":
                if(message.data === playerColor) {
                    console.log("YOU WON!");
                }
                else {
                    console.log("YOU LOST!")
                }
                const delayInMilliSeconds = 5000;
                setTimeout(function () {
                    window.location.replace("http://localhost:3000");
                    socket.close();
                }, delayInMilliSeconds);
                break;
        }
    }
}

function restrict(disable) {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes(disable)) {
            img[i].removeEventListener('click', helper);
        }
    }
}

function moveWasMade(oldC, newC) {
    logMove(oldC, newC, playerColor);
    socket.send(oldC + newC);
    //Here block the player from making other moves
    //Until opponent moves
}

function disconnectSocket() {
    socket.close();
}

function logMove(oldC, newC, playerColor) {
    let log = document.getElementById("moveLog");
    const newDiv = document.createElement("div");
    newDiv.className = "oneMove";
    newDiv.textContent += oldC + " - " + newC;
    if(playerColor === "white") {
        newDiv.style.background = "white";
        newDiv.style.color = "black";
    }
    else {
        newDiv.style.background = "black";
        newDiv.style.color = "white";
    }
    log.appendChild(newDiv);
}

/*TODO list:
* Waiting for player to connect + animation
* Play button animation
* */

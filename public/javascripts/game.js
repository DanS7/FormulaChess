//Added a link to the splash screen for the concede button
//Replacement with actual functionality will be added later
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('concedeButton').addEventListener('click', function () {
        disconnectSocket();
        location.href = "/";
    })
    window.addEventListener('unload', function () {
        disconnectSocket();
    })
});
document.addEventListener('DOMContentLoaded', setup);

let socket;
let playerColor;
let currentlyAttacked = [];         // A list of squares that are attacked by the opponent
let inCheck;
let currentMoves = [];              // A list that saves the spaces where the clicked piece can move
let kingMoved = false;              // Needed for castling
let leftRookMoved = false;          // a1, h8
let rightRookMoved = false;         // a8, h1
let castling = false;               // true if castling available

/*
* Creates the board and appends it to the document
* */
function createBoard() {
    //Change concede button
    document.getElementById('concedeButton').innerText = 'Concede';

    let container = document.getElementById("board");
    let waitMessage = container.childNodes[0];
    container.removeChild(waitMessage);
    container.removeChild(container.childNodes[0]);
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
/*
* Creates each row of the board
* */
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
/*
* Creates the id of each cell on the board based on the row number and column number
* */
function position(rownum, colnum) {
    let x, y;
    x = 8 - rownum;
    y = String.fromCharCode(97 + colnum);
    return y.concat(x);
}
/*
* Called at the beginning of the game to place the
* pieces on the board in staring position
* */
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

/*
* A helper method that we use in order to call the
* handleMove function with the needed parameters
* */
function helper() {
    handleMove(this, spawnCircle);
}

/*
* Removes the potential moves from the board when a piece is pressed a second time.
* */
function removeCircle() {
    checkIfCircle();
    this.removeEventListener('click', removeCircle);
    this.addEventListener('click', helper);
}

/*
* Returns the id of a new position on the grid offset by offsetX on the X axis and offsetY on the Y axis
* */
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

/*
* Returns an object containing a circle used to show the potential moves for the clicked piece
* */
function makeCircle(parent) {
    let circle = document.createElement('img');
    circle.src = 'images/circle.png';
    circle.className = parent;
    circle.className += 'Circle';
    circle.addEventListener('click', makeMove);
    return circle;
}

/*
* Shows the player a circle at the spawnPos where spawnPos is a potential move for piece
* */
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

/*
* Looks through the document and removes all circles(potential moves)
* */
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

/*
* Calls the appropriate method that handles the piece that was clicked
* */
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

/*
* Displays pawn potential moves and attacks
* */
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

/*
* Displays knight potential moves
* */
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

/*
* Displays bishop potential moves
* */
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

/*
* Displays rook potential moves
* */
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

/*
* Displays queen potential moves
* */
function showQueenMoves(posX, posY, res, flag) {
    checkIfCircle();
    showRookMoves(posX, posY, res, flag);
    checkIfCircle();
    showBishopMoves(posX, posY, res, flag);
}

/*
* Displays king potential moves
* */
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

/*
* Is called only when the king is selected and checks if castling is possible
* */
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

/*
* Checks if the opponent king attacks the position
* Only needed when moving the king near the opponent king
* */
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

/*
* Checks if newPos can be attacked by the piece at thisPos
* */
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

/*
* Moves selected piece to the new coordinates and the rook in case of castling
* */
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

/*
* Makes the opponents move on the players board
* The move that the player makes is client side and then it is transmitted through the
* server to the opponents side and this method makes the opponents move on the players side
* */
function makeOpponentMove(data) {
    let oldPos = data.substr(0, 2);
    let newPos = data.substr(2, 2);
    let deadPiece;
    let piece = document.getElementById(oldPos).childNodes[0];
    piece.parentElement.removeChild(piece);
    //console.log(piece);

    if(document.getElementById(newPos).hasChildNodes()) {
        deadPiece = document.getElementById(newPos).childNodes[0];
    }
    while(document.getElementById(newPos).hasChildNodes()) {
        document.getElementById(newPos).removeChild(document.getElementById(newPos).childNodes[0]);
    }
    document.getElementById(newPos).appendChild(piece);
    enableMoves();
    if(deadPiece !== undefined) {
        addDeadPiece(deadPiece.className);
    }
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

/*
* Removes the taken piece from the board and moves the taker piece to the new position
* */
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
    addDeadPiece(takenPiece.className);
}

/*
* At the beginning of the players turn we make moves available to them
* */
function enableMoves() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes(playerColor + 'ChessPiece')) {
            img[i].addEventListener('click', helper);
        }
    }
    //checkCondition();
}

/*
* After the player makes a move we remove their ability to make another
* */
function disableMoves() {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        img[i].removeEventListener('click', helper);
        img[i].removeEventListener('click', removeCircle);
    }
    let king = document.getElementsByClassName(playerColor + 'ChessPieceKingCheck')[0];
    if(typeof king != 'undefined') {
        king.className = king.className.replace('Check', '');
    }
}

/*
* Finds all the positions that are attacked by the opponent
* */
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

/*
* Adds a position to the list of currently attacked positions
* */
function isValidPosition(param1, param2) {
    //console.log(param1);
    currentlyAttacked[currentlyAttacked.length++] = param1;
    return true;
}

/*
* Checks if the player is in chess
* */
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

/*
* Checks if the player can make any moves and if not then its Check Mate
* */
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

/*
* Checks if a potential move is valid
* */
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

/*
* Returns true if the position is on the board and false otherwise
* */
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
function setup() {
    socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = function (event) {
        let message = JSON.parse(event.data);
        switch (message.type) {
            case "PLAYER-TYPE":
                if(message.data === 'White') {
                    playerColor = 'white';
                    document.getElementsByClassName("userCaptures")[0].style.background = "white";
                    document.getElementsByClassName("opponentCaptures")[0].style.background = "grey";
                    createBoard(); //Create the chess board
                    generatePieces(); //Generate the pieces and their eventListeners
                    restrict('black'); //Only enable black chess pieces to be moved
                    console.log("You are white!");
                }
                else {
                    playerColor = 'black';
                    document.getElementsByClassName("userCaptures")[0].style.background = "grey";
                    document.getElementsByClassName("opponentCaptures")[0].style.background = "white";
                    createBoard(); //Create the chess board
                    generatePieces(); //Generate the pieces and their eventListeners
                    restrict('white'); //Only enable white chess pieces to be moved
                    disableMoves(); //White starts so black cannot move at first
                    console.log("You are black!");
                }
                break;
            case "SET-MOVE":
                makeOpponentMove(message.data);
                //make this move, string is in message.data
                break;
            case "OPPONENT-LEFT": //Opponent left, so you win
                let opScreen = document.createElement("div");
                opScreen.setAttribute("id", "opaque");
                document.getElementsByTagName("body")[0].appendChild(opScreen);
                let opponentLeft = document.createElement("div");
                let status = document.createElement("div");
                status.setAttribute("id", "popUpStatus");
                opponentLeft.setAttribute("id", "winPopUp");
                status.textContent = "OPPONENT CONCEDED!"
                opponentLeft.appendChild(status);
                document.getElementsByTagName("body")[0].appendChild(opponentLeft);
                delay();
                socket.close(3001);
                break;
            case "GAME-WON-BY": //The game was actually finished
                let opaqueScreen = document.createElement("div");
                opaqueScreen.setAttribute("id", "opaque");
                document.getElementsByTagName("body")[0].appendChild(opaqueScreen);
                let popUp = document.createElement("div");
                let popUpStatus = document.createElement("div");
                popUpStatus.setAttribute("id", "popUpStatus");
                if(message.data === playerColor) {
                    popUp.setAttribute("id", "winPopUp");
                    popUpStatus.textContent = "YOU WON!";
                }
                else {
                    popUp.setAttribute("id", "loosePopUp");
                    popUpStatus.textContent = "YOU LOST :("
                }
                popUp.appendChild(popUpStatus);
                document.getElementsByTagName("body")[0].appendChild(popUp);
                delay();
                socket.close(4000);
                break;
        }
    }
}

//Redirect user to the splash screen after 5 seconds
function delay() {
    const delayInMilliSeconds = 5000;
    setTimeout(function () {
        window.location.replace("http://localhost:3000");
    }, delayInMilliSeconds);
}

//Restrict user to move any pieces
function restrict(disable) {
    let img = document.querySelectorAll('img');
    for(let i = 0; i < img.length; i++) {
        if(img[i].className.includes(disable)) {
            img[i].removeEventListener('click', helper);
        }
    }
}

//Log the move and send it to the server
function moveWasMade(oldC, newC) {
    logMove(oldC, newC, playerColor);
    socket.send(oldC + newC);
}

//Close the current socket
function disconnectSocket() {
    socket.close(4001); //4001 is the code for a game aborted state
}

//Add a move to the move log
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

//Add a dead piece to the captures log
function addDeadPiece(deadPiece) {
    let color;
    const pieceName = checkForPieceName(deadPiece);
    let dirname;
    if(deadPiece.includes("white")) {
        color = "White";
        dirname = "White Pieces";

    }
    else {
        color = "Black";
        dirname = "Black Pieces";
    }
    const pngName = pieceName + "_" + color;
    let image = document.createElement("img");
    image.src = "images/" + dirname + "/" + pngName + ".png";
    image.className = "deadPiece";
    if(playerColor === color.toLowerCase()) {
        document.getElementsByClassName("opponentCaptures")[0].appendChild(image);
    }
    else {
        document.getElementsByClassName("userCaptures")[0].appendChild(image);
    }
}

//Check a piece's class name and return it's actual name
function checkForPieceName(piece) {

    if(piece.includes("Pawn")) {
        return "Pawn";
    }
    if(piece.includes("Bishop")) {
        return "Bishop";
    }
    if(piece.includes("Knight")) {
        return "Knight";
    }
    if(piece.includes("Rook")) {
        return "Rook";
    }
    if(piece.includes("Queen")) {
        return "Queen";
    }
}

document.addEventListener('DOMContentLoaded', spawnRandomPieces);


const whitePawn = 'images/White Pieces/Pawn_White.png';
const container = document.getElementsByClassName('pieces')[0];

function spawnRandomPieces() {
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 10; j++) {
            // let pieceNumber = getRandom(12);                 // 12 = number of pieces: 6 white 6 black
            let piece = document.createElement('img');
            piece.src = whitePawn;
            piece.className = 'bgPiece';
            container.appendChild(piece);
        }
    }
}


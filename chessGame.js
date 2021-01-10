let game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.firstPlayer = Math.random(); //if > 0.49 firstPlayer to come is white
    this.gameState = '0 JOINT';
}

module.exports = game;

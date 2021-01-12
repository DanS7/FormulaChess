//This is the game instance/object with multiple functions
const messages = require("./public/javascripts/messages");
let game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.firstPlayer = Math.random(); //if > 0.49 firstPlayer to come is white
    this.gameState = '0 JOINT';
}

//Set the user which will be black
game.prototype.setBlack = function (ws) {
    this.black = ws;
}

//Set the user which will be white
game.prototype.setWhite = function (ws) {
    this.white = ws;
}

//Adds a player, if first come white, then black
//TODO: Implement random sides
game.prototype.addPlayer = function (ws) {
    if(this.white !== null) {
        this.setBlack(ws);
    }
    else {
        this.setWhite(ws);
    }
}

//Returns true if 2 users connected
game.prototype.isReady = function () {
    if(this.white !== null && this.black !== null) {
        return true;
    }
    return false;
}

//Sends a message to both users
//TODO: Make it such that the message is sent from one user to the other
game.prototype.sendMessage = function (message) {
    this.white.send(message);
    this.black.send(message);
}

game.prototype.userColor = function () {
    this.white.send(messages.S_PLAYER_A);
    this.black.send(messages.S_PLAYER_B);
}

game.prototype.getOpponentSocket = function (ws) {
    if(this.white === ws) {
        return this.black;
    }
    return this.white;
}



module.exports = game;

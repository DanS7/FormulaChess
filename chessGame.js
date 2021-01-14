//This is the game instance/object with multiple functions
const messages = require("./public/javascripts/messages");
let game = function (gameID) {
    this.white = null;
    this.black = null;
    this.id = gameID;
    this.gameState = '0 JOINT';
    this.isWhite = false;
    this.isBlack = false;
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
    let random = Math.random();
    if(this.isWhite === false && this.isBlack === false) {
        if(random <= 0.49) {
            this.white = ws;
            this.isWhite = true;
            return;
        }
        else {
            this.black = ws;
            this.isBlack = true;
            return;
        }
    }
    if(this.isWhite === false && this.isBlack === true) {
        this.isWhite = true;
        this.white = ws;
        return;
    }
    this.isBlack = true;
    this.black = ws;
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

game.prototype.getRemainingSocket = function () {
    if(this.white === null) {
        return this.black;
    }
    return this.white;
}

game.prototype.hasTwoPlayers = function () {
    return this.black !== null && this.white !== null;
}

game.prototype.hasAnotherPlayer = function () {
    return this.black !== null || this.white !== null;
}

game.prototype.clearPlayer = function (ws) {
    if(this.black === ws) {
        this.black = null;
    }
    else if(this.white === ws) {
        this.white = null;
    }
}

game.prototype.getOpponentSocket = function (ws) {
    if(ws === this.white) {
        return this.black;
    }
    return this.white;
}

module.exports = game;

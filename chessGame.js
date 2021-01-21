//This is the game instance/object with multiple functions
const messages = require("./public/javascripts/messages");
let game = function (gameID) {
    this.white = null;              //Socket white
    this.black = null;              //Socket Black
    this.id = gameID;               //The game ID
    this.isWhite = false;           //helper variable for addPlayer method
    this.isBlack = false;           //helper variable for addPlayer method
}

//Return the id of the game
game.prototype.getId = function () {
    return this.id;
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

//Send the colors of the users to their sockets
game.prototype.userColor = function () {
    this.white.send(messages.S_PLAYER_A);
    this.black.send(messages.S_PLAYER_B);
}

//Return the remaining socket if one of them is null
game.prototype.getRemainingSocket = function () {
    if(this.white === null) {
        return this.black;
    }
    return this.white;
}

//Check if the game has a player
game.prototype.hasAnotherPlayer = function () {
    return this.black !== null || this.white !== null;
}

//Delete one of the players
game.prototype.clearPlayer = function (ws) {
    if(this.black === ws) {
        this.black = null;
    }
    else if(this.white === ws) {
        this.white = null;
    }
}

//Get the opponent's socket based on the given socket
game.prototype.getOpponentSocket = function (ws) {
    if(ws === this.white) {
        return this.black;
    }
    return this.white;
}

//Return the color of the opponent
game.prototype.getColorOfOpponent = function (ws) {
    if(ws === this.white) {
        return "black";
    }
    return "white";
}

//Return the color of the given socket
game.prototype.getColor = function (ws) {
    if(ws === this.white) {
        return "white";
    }
    return "black";
}

module.exports = game;

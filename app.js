//<-----Imports----->
const express = require("express");
const http = require("http");
const messages = require("./public/javascripts/messages");
const Game = require("./chessGame");
const websocket = require("ws");
const app = express();

const port = process.argv[2]; //The port
app.use(express.static(__dirname + "/public"));
//Wipe .html extension from urls
app.use(express.static('public', {
    extensions: ['html'],
}));
//Array of all the games
const gameInstances = [];

//Http server
const server = http.createServer(app);

//WebSocket Server
const wss = new websocket.Server({ server });

//All the connected sockets to our server
const websockets = [];

//Each connected socket will have an iD
let connectionID = -1;

//Each game created will have an iD
let gameID = 0;

//Array that links the socket to its game
//websocket[connectionID] = ...
let webSocketToGame = [];

//Current game
let currentGame;

//When a ws(user) connects to wss(our server):
wss.on("connection", function (ws) {
    connectionID++;
    websockets[connectionID] = ws; //put new user socket in array
    if(gameInstances.length === 0) { //if first user
        gameInstances[gameID] = new Game(gameID); //create new game at gameInstances[0]
        currentGame = gameInstances[gameID]; //
        //keep track of which client is connected to which game instance
        webSocketToGame[connectionID] = gameInstances[gameID]; //connectionID determines game
        gameID++; //prepare to create new game after current one is filled
        currentGame.addPlayer(ws); //add the first user to our currentGame
        console.log("First game instance"); //for dev
    }
    else {
        if(currentGame.isReady()) { //if we have 2 players
            gameInstances[gameID] = new Game(gameID); //create new game
            currentGame = gameInstances[gameID]; //update currentGame
            webSocketToGame[connectionID] = gameInstances[gameID]; //link user to specific game by connectionID
            gameID++;//update
            currentGame.addPlayer(ws);//add user to currentGame
            console.log('new current game');//for dev
        }
        else { //One player already in currentGame, 2nd comes now
            webSocketToGame[connectionID] = gameInstances[gameID - 1]; //link user to game
            currentGame.addPlayer(ws); //add the player to the game
            console.log('second player added'); //for dev
            currentGame.userColor();
        }
    }
    ws.on('message', function incoming(event) { //when a message comes from a user
        let index = websockets.indexOf(ws); //identify our user id
        let gameInstance = webSocketToGame[index]; //identify corresponding game instance
        let opponent = gameInstance.getOpponentSocket(ws); //get opponent socket
        let message = messages.O_MOVE; //message is a move object
        message.data = event; //
        opponent.send(JSON.stringify(message)); //send move to opponent socket
    })
    console.log(webSocketToGame[connectionID] !== undefined);

    ws.onclose = function (event) {
        let index = websockets.indexOf(ws);
        let gameInstance = webSocketToGame[index];
        let opponent = gameInstance.getOpponentSocket(ws);
        let message = messages.O_GAME_ABORTED;
        opponent.send(JSON.stringify(message));
    }
});

//Redirect for the play button
app.get('/play', function (req, res) {
    res.redirect('game');
});

//homePage is splash.html
app.get('/', function(req, res) {
    res.redirect("splash");
});

server.listen(port);

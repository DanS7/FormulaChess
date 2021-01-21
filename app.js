//<-----Imports----->
const express = require("express");
const http = require("http");
const messages = require("./public/javascripts/messages");
const Game = require("./chessGame");
const websocket = require("ws");
const app = express();
const ejs = require("ejs");

const port = process.argv[2]; //The port

app.use(express.static(__dirname + "/public"));
//Wipe .html and .ejs extension from urls
app.use(express.static('public', {
    extensions: ['html', 'ejs'],
}));

app.set("view engine", "ejs");


app.get('/game(.html)?', function (req, res) {
    res.redirect('game');
});

//Redirect for the play button
app.get('/play', function (req, res) {
    res.redirect('game');
});

app.get("/", (req, res) => {
    res.render("splash.ejs", {
        gamesPlayed: playedGames,
        players: playersInGame,
        gamesWonByWhite: gamesWonByWhite,
        gamesWonByBlack: gamesWonByBlack
    });
});

app.get('/splash(.html)?(.ejs)?', (req, res) => {
    res.render("splash.ejs", {
        gamesPlayed: playedGames,
        players: playersInGame,
        gamesWonByWhite: gamesWonByWhite,
        gamesWonByBlack: gamesWonByBlack
    })
})
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

//Number of games played TODO
let playedGames = 0;

//Number of players currently in a match
let playersInGame = 0;

//Number of games won by black
let gamesWonByBlack = 0;

//Number of games won by white
let gamesWonByWhite = 0;

//When a ws(user) connects to wss(our server):
wss.on("connection", function (ws) {
    connectionID++;
    playersInGame++;
    websockets[connectionID] = ws;                                  //put new user socket in array
    if (gameInstances[gameID] === undefined) {                      //if first user in game
        gameInstances[gameID] = new Game(gameID);                   //create new game at gameInstances[0]
        currentGame = gameInstances[gameID];                        //Assign to currentGame
        //keep track of which client is connected to which game instance
        webSocketToGame[connectionID] = currentGame;                //connectionID determines game
        currentGame.addPlayer(ws);                                  //add the first user to our new game
    } else {                                                        //two users
        webSocketToGame[connectionID] = gameInstances[gameID];      //connect websocket to game
        currentGame.addPlayer(ws);                                  //add player
        gameID++;                                                   //increment gameID so we can create a new game instance
        currentGame.userColor();                                    //Send the colors to the users
    }
    ws.on('message', function incoming(event) {                     //when a message comes from a user
        let index = websockets.indexOf(ws);                         //identify our user id
        let gameInstance = webSocketToGame[index];                  //identify corresponding game instance
        let opponent = gameInstance.getOpponentSocket(ws);          //get opponent socket
        let message;                                                //message that will be transmitted to client
        if (event === "MATE") {
            message = messages.O_GAME_WON_BY;
            message.data = gameInstance.getColorOfOpponent(ws);
            if (message.data === "white") {                         //Update stats
                gamesWonByWhite++;
            } else {
                gamesWonByBlack++;
            }
            opponent.send(JSON.stringify(message));                 //Send results to the sockets
            ws.send(JSON.stringify(message));
        } else {                                                    //If not "MATE", then it must be a move
            message = messages.O_MOVE;                              //message is a move object
            message.data = event;
            opponent.send(JSON.stringify(message));                 //send move to opponent socket
        }
    })

    ws.on("close", function incoming(event) {
        playersInGame--;
        let index = websockets.indexOf(ws);
        let gameInstance = webSocketToGame[index];
        gameInstance.clearPlayer(ws);
        let opponent;
        let message;
        switch(event) {
            case 4001:                                              //this ws has conceded
                if(gameInstance.hasAnotherPlayer()) {               //If the game instance has another player, it is considered as a win/lose situation
                    playedGames++;
                    opponent = gameInstance.getRemainingSocket();
                    message = messages.O_OPPONENT_LEFT;
                    if(gameInstance.getColor(opponent) === "white") {
                        gamesWonByWhite++;
                    }
                    else {
                        gamesWonByBlack++;
                    }
                    opponent.send(JSON.stringify(message));
                }
                else {                                              //Just clear the remaining player, stats were already updated
                    gameInstances[gameInstance.getId()] = undefined;
                }
                break;
            case 4000:                                              //gameFinished
                if(!gameInstance.hasAnotherPlayer()) {
                    gameInstances[gameInstance.getId()] = undefined;
                }
                break;
            default :                                            
                gameInstances[gameInstance.getId()] = undefined;
                break;
        }

        }
    );
});


server.listen(port);

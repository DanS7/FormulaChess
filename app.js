const express = require("express");
const http = require("http");

const messages = require("./public/javascripts/messages");
const Game = require("./chessGame");

const websocket = require("ws");
const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.static('public', {
    extensions: ['html'],
}));

const server = http.createServer(app);

const wss = new websocket.Server({ server });

const websockets = {}; //property: websocket, value: game

let connectionID = 0; //each websocket receives a unique ID

let connectedPlayers = 0;

wss.on("connection", function (ws) {
    ws.on("message", function incoming(message) {
        console.log(message);
        //compute move
    })
});

app.get('/play', function (req, res) {
    res.redirect('game');
});

app.get('/', function(req, res) {
    res.redirect("splash");
});

server.listen(port);

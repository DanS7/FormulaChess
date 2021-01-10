var express = require("express");
var http = require("http");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.static('public', {
    extensions: ['html'],
}));

http.createServer(app).listen(port);

app.get('/play', function (req, res) {
    res.redirect('game');
});

app.get('/', function(req, res) {
    res.redirect("splash");
});
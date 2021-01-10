const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function(){
    socket.send("Hello from the client!");
};
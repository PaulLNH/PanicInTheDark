var express = require('express');
var app = express();
var serv = require('http').Server(app);
var PORT = 2000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

// TODO - Don't give models folder to user!!! Process.env...
app.use('/models', express.static(__dirname + '/models'));

serv.listen(PORT);
console.log(`server listening on port ${PORT}`);


// Look into https://socket.io/get-started/chat/ for multiplayer if Firebase does not work out
var io = require('socket.io')(serv, {});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
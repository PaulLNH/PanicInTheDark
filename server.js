console.log(`File loaded: ../server.js`);
const test = require('./models/test.js');

var Player = test.Player;
// var Bullet = test.Bullet;
var SOCKET_LIST = test.SOCKET_LIST;
// var Entity = test.Entity;
var DEBUG = test.DEBUG;
// var USERS = test.USERS;
var isValidPassword = test.isValidPassword;
var isUsernameTaken = test.isUsernameTaken;
var addUser = test.addUser;

const express = require('express');
const app = express();
const serv = require('http').Server(app);
const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.use('/public', express.static(__dirname + '/public'));

// TODO - Don't give models folder to user!!! Process.env...
// app.use('/models', express.static(__dirname + '/models'));

serv.listen(PORT);
console.log(`Server started. localhost:${PORT}`);

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn', function (data) {
        isValidPassword(data, function (res) {
            if (res) {
                Player.onConnect(socket);
                socket.emit('signInResponse', {
                    success: true
                });
            } else {
                socket.emit('signInResponse', {
                    success: false
                });
            }
        });
    });
    socket.on('signUp', function (data) {
        isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit('signUpResponse', {
                    success: false
                });
            } else {
                addUser(data, function () {
                    socket.emit('signUpResponse', {
                        success: true
                    });
                });
            }
        });
    });


    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
    socket.on('sendMsgToServer', function (data) {
        console.log(data);
        var playerName = ("" + Player.username);
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
        }
    });

    socket.on('evalServer', function (data) {
        if (!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer', res);
    });



});

setInterval(function () {
    var pack = {
        player: Player.update(),
    }

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 10000 / 25);
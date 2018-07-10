const test = require("./models/test.js");

var Player = test.Player;
var SOCKET_LIST = test.SOCKET_LIST;
var DEBUG = test.DEBUG;
var USERS = test.USERS;
var isValidPassword = test.isValidPassword;
var isUsernameTaken = test.isUsernameTaken;
var addUser = test.addUser;
var timer = test.timer;
var huntTeam = test.huntTeam;
var updateLeaderboard = test.updateLeaderboard;
// var time = 300;

var frames = 30;

const express = require("express");
const app = express();
const serv = require("http").Server(app);
const PORT = process.env.PORT || 8080;

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});
app.use("/public", express.static(__dirname + "/public"));

serv.listen(PORT);
console.log(`Server started. localhost:${PORT}`);

var io = require("socket.io")(serv, {});
io.sockets.on("connection", function (socket) {
    SOCKET_LIST[socket.id] = socket;

    socket.on("signIn", function (data) {
        isValidPassword(data, function (res) {
            if (res) {
                Player.onConnect(socket, data);
                socket.emit("signInResponse", {
                    success: true
                });
                var pack = {
                    player: Player.update()
                };
                for (var i in SOCKET_LIST) {
                    SOCKET_LIST[i].emit("addToChat", pack, "<em>Has entered the game.</em>", socket.id);
                }
            } else {
                socket.emit("signInResponse", {
                    success: false
                });
            }
        });
    });
    socket.on("signUp", function (data) {
        isUsernameTaken(data, function (res) {
            if (res) {
                socket.emit("signUpResponse", {
                    success: false
                });
            } else {
                addUser(data, function () {
                    socket.emit("signUpResponse", {
                        success: true
                    });
                });
            }
        });
    });

    socket.on("disconnect", function () {
        delete SOCKET_LIST[socket.id];
        var pack = {
            player: Player.update()
        };
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit("addToChat", pack, "Has left the game.", socket.id);
        }
        Player.onDisconnect(socket);
    });

    socket.on("sendMsgToServer", function (data, userID) {
        var pack = {
            player: Player.update()
        };

        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit("addToChat", pack, data, userID);
        }
    });

    socket.on("evalServer", function (data) {
        if (!DEBUG) return;
        var res = eval(data);
        socket.emit("evalAnswer", res);
    });
});


setInterval(function () {
    var pack = {
        updateLeaderboard: updateLeaderboard(),
        time: timer(),
        huntTeam: huntTeam(),
        player: Player.update()
    };

    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit("newPositions", pack);
    }
}, 1000 / frames);
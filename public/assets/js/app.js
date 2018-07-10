console.log(`File loaded: ../public/assets/js/app.js`);
const socket = io();

//sign
const signDiv = document.getElementById("signDiv");
const signDivUsername = document.getElementById("signDiv-username");
const signDivSignIn = document.getElementById("signDiv-signIn");
const signDivSignUp = document.getElementById("signDiv-signUp");
const signDivPassword = document.getElementById("signDiv-password");
const gameTimer_div = document.getElementById("gameTimer_div");
const huntTeam_div = document.getElementById("huntTeam_div");

const TILE_SIZE = 16;
const WIDTH = 640;
const HEIGHT = 480;

// assets
var Img = {};
Img.player = new Image();
Img.player.src = "../public/assets/img/Player1.png";
Img.map = new Image();
Img.map.src = "../public/assets/img/hospital.png";
const soundLoss = document.createElement("audio");
soundLoss.setAttribute("src", "../public/assets/audio/death.mp3");
// const bgMusic = document.createElement("audio");
// bgMusic.setAttribute("src", "../public/assets/audio/bgMusic.mp3");
bgMusic = new Audio('../public/assets/audio/bgMusic.mp3');

signDivSignIn.addEventListener("click", function (event) {
    event.preventDefault();
    socket.emit("signIn", {
        username: signDivUsername.value,
        password: signDivPassword.value
    });
});

signDivSignUp.addEventListener("click", function (event) {
    event.preventDefault();
    socket.emit("signUp", {
        username: signDivUsername.value,
        password: signDivPassword.value
    });
});

socket.on("signInResponse", function (data) {
    if (data.success) {
        bgMusic.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        bgMusic.play();
        signDiv.style.display = "none";
        gameDiv.style.display = "inline-block";
    } else alert("Sign in unsuccessul.");
});
socket.on("signUpResponse", function (data) {
    if (data.success) {
        alert("Sign up successul.");
    } else alert("Sign up unsuccessul.");
});

//game
const chatText = document.getElementById("chat-text");
const chatInput = document.getElementById("chat-input");
const chatForm = document.getElementById("chat-form");
const leaderBoard = document.getElementById("scoreBoard");
const ctx = document.getElementById("ctx").getContext("2d");
const ctxv = document.getElementById("ctxv").getContext("2d");
ctx.font = "15px Arial bold ";

var darkness = 1;
var dark_color = "black";
var vision_rd = 100;

// Clears focus on chat box when pressing enter
chatInput.addEventListener('keyup', function (e) {
    if (e.which == 13) this.blur();
});

socket.on("newPositions", function (data) {
    // console.log(JSON.stringify(data));
    // console.log(data.time);
    // console.log(data.huntTeam);
    // gameTimer_div.innerHTML = "Time left in round: " + data.time + " - ";
    gameTimer_div.innerHTML = waitingOnPlayers(data.time) + " - ";
    // We have to call the index of data.player[0] to access huntTeam if we push it to the pack in the Player.update logic. Ruins our death logic though...
    if (data.huntTeam == "Zombie") {
        huntTeam_div.innerHTML = "Hunting Team: <font color='red'>" + data.huntTeam + "</font>";
    } else if (data.huntTeam == "Human") {
        huntTeam_div.innerHTML = "Hunting Team: <font color='blue'>" + data.huntTeam + "</font>";
    }

    leaderBoard.innerHTML = "<h3>Leaderboard:</h3>" + data.updateLeaderboard;
    ctx.clearRect(0, 0, 640, 480);
    ctx.drawImage(Img.map, 0, 0);
    for (var i = 0; i < data.player.length; i++) {

        console.log(data.player[i]);
        if (data.player[i].living) {
            // Manually added offsets to x and y to put collision point at the center of the players knees
            ctx.drawImage(Img.player, data.player[i].x - 6, data.player[i].y - 20);

            // console.log(`Data Player ID ${data.player[i].id}`);
            // console.log(`Socket ID ${socket.id}`);
            // console.log(`Data Player username ${data.player[i].username}`);
            // console.log(`Data Player Living Status ${data.player[i].living}`);

            if (data.player[i].id == socket.id) {
                if (data.player[i].team !== data.huntTeam) {
                    draw(data, i);
                } else {
                    ctxv.save();
                    // ctxv.fillStyle = "#ff0000";
                    // ctxv.font = "40px Arial bold ";
                    ctxv.clearRect(0, 0, 640, 480);
                    // ctxv.fillText("You have died!", 200, 254);
                    ctxv.restore();
                }
                // console.log("In Draw Darkness Function");
            }

            // Draws username above players head
            ctx.save();
            if (data.player[i].team == "Zombie") {
                ctx.fillStyle = "#ff0000";
            } else if (data.player[i].team == "Human") {
                ctx.fillStyle = "#0000ff";
            }
            var userNameLength = data.player[i].username.length;
            ctx.fillText(data.player[i].username, data.player[i].x - (userNameLength * 3), data.player[i].y - 23);
            ctx.restore();
        } else if (data.player[i].living == false && data.player[i].id == socket.id) {
            // console.log("HERE");
            ctxv.save();
            ctxv.fillStyle = "#ff0000";
            ctxv.font = "40px Arial bold ";
            ctxv.clearRect(0, 0, 640, 480);
            ctxv.fillText("You have died!", 200, 254);
            ctxv.restore();
        }

    }
});

var waitingOnPlayers = function (time) {
    if (time == undefined) {
        return "Waiting for more players"
    } else {
        return "Time left in round: <font color='white'>" + time + "</font>"
    }
}

function draw(data, i) {
    let x = data.player[i].x;
    let y = data.player[i].y;

    let default_gco = ctx.globalCompositeOperation;
    ctxv.clearRect(0, 0, 640, 480);
    ctxv.globalAlpha = darkness;
    ctxv.fillStyle = dark_color;
    ctxv.fillRect(0, 0, WIDTH, HEIGHT);
    ctxv.globalCompositeOperation = "destination-out";
    let dark_gd = ctxv.createRadialGradient(
        x,
        y,
        vision_rd,
        x,
        y,
        vision_rd / 1.75
    );
    dark_gd.addColorStop(0, "rgba(0,0,0,0");
    dark_gd.addColorStop(1, "rgba(0,0,0,1");
    ctxv.fillStyle = dark_gd;
    ctxv.beginPath();
    ctxv.arc(x, y, vision_rd, 0, 2 * Math.PI);
    ctxv.closePath();
    ctxv.fill();
    ctxv.globalCompositeOperation = default_gco;
}

socket.on("addToChat", function (pack, data, userID) {
    var playerName = "";
    for (var i = 0; i < pack.player.length; i++) {
        if (pack.player[i].id == userID) {
            playerName = pack.player[i].username;
        }
    }

    chatText.innerHTML +=
        "<div><strong><font color='white'>" + playerName + ":</font></strong> " + data + "</div>";
    chatText.scrollTop = chatText.scrollHeight;
});

socket.on("evalAnswer", function (data) {
    console.log(data);
});

chatForm.onsubmit = function (e) {
    // chatInput.blur();
    e.preventDefault();
    if (chatInput.value[0] === "/")
        socket.emit("evalServer", chatInput.value.slice(1));
    else socket.emit("sendMsgToServer", chatInput.value, socket.id);
    chatInput.value = "";
    var height = 440;
    $('chat-text').animate({
        scrollTop: height
    });
};

document.onkeydown = function (event) {
    if (chatInput !== document.activeElement) {
        if (event.keyCode === 68 || event.keyCode === 39)
            //d or right arrow
            socket.emit("keyPress", {
                inputId: "right",
                state: true
            });
        else if (event.keyCode === 83 || event.keyCode === 40)
            //s or down arrow
            socket.emit("keyPress", {
                inputId: "down",
                state: true
            });
        else if (event.keyCode === 65 || event.keyCode === 37)
            //a or left arrow
            socket.emit("keyPress", {
                inputId: "left",
                state: true
            });
        else if (event.keyCode === 87 || event.keyCode === 38)
            // w or up arrow
            socket.emit("keyPress", {
                inputId: "up",
                state: true
            });
    }
};
document.onkeyup = function (event) {
    if (chatInput !== document.activeElement) {
        if (event.keyCode === 68 || event.keyCode === 39)
            //d or right arrow
            socket.emit("keyPress", {
                inputId: "right",
                state: false
            });
        else if (event.keyCode === 83 || event.keyCode === 40)
            //s or down arrow
            socket.emit("keyPress", {
                inputId: "down",
                state: false
            });
        else if (event.keyCode === 65 || event.keyCode === 37)
            //a or left arrow
            socket.emit("keyPress", {
                inputId: "left",
                state: false
            });
        else if (event.keyCode === 87 || event.keyCode === 38)
            // w or up arrow
            socket.emit("keyPress", {
                inputId: "up",
                state: false
            });
    }
};
console.log(`File loaded: ../public/assets/js/app.js`);
const socket = io();

//sign
const signDiv = document.getElementById("signDiv");
const signDivUsername = document.getElementById("signDiv-username");
const signDivSignIn = document.getElementById("signDiv-signIn");
const signDivSignUp = document.getElementById("signDiv-signUp");
const signDivPassword = document.getElementById("signDiv-password");

const TILE_SIZE = 16;
const WIDTH = 640;
const HEIGHT = 480;

var Img = {};
Img.player = new Image();
Img.player.src = "../public/assets/img/Player1.png";
Img.map = new Image();
Img.map.src = "../public/assets/img/hospital.png";


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

// signDivSignUp.onclick = function () {
//     socket.emit("signUp", {
//         username: signDivUsername.value,
//         password: signDivPassword.value
//     });
// };
socket.on("signInResponse", function (data) {
    if (data.success) {
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
const ctx = document.getElementById("ctx").getContext("2d");
ctx.font = "30px Arial";

socket.on("newPositions", function (data) {
    ctx.clearRect(0, 0, 640, 480);
    ctx.drawImage(Img.map, 0, 0);
    for (var i = 0; i < data.player.length; i++) {

        /// Test Code ///
        ctx.save();
        // Manually added offsets to x and y to put collision point at the center of the players knees
        ctx.drawImage(Img.player, data.player[i].x - 6, data.player[i].y - 20);
        ctx.restore();

        // Draws username above players head
        // ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);
    }
});

socket.on("addToChat", function (data) {
    chatText.innerHTML += "<div>" + data + "</div>";
});
socket.on("evalAnswer", function (data) {
    console.log(data);
});

chatForm.onsubmit = function (e) {
    e.preventDefault();
    if (chatInput.value[0] === "/")
        socket.emit("evalServer", chatInput.value.slice(1));
    else socket.emit("sendMsgToServer", chatInput.value);
    chatInput.value = "";
};

document.onkeydown = function (event) {
    if (event.keyCode === 68 || event.keyCode === 39)
        //d
        socket.emit("keyPress", {
            inputId: "right",
            state: true
        });
    else if (event.keyCode === 83 || event.keyCode === 40)
        //s
        socket.emit("keyPress", {
            inputId: "down",
            state: true
        });
    else if (event.keyCode === 65 || event.keyCode === 37)
        //a
        socket.emit("keyPress", {
            inputId: "left",
            state: true
        });
    else if (event.keyCode === 87 || event.keyCode === 38)
        // w
        socket.emit("keyPress", {
            inputId: "up",
            state: true
        });
};
document.onkeyup = function (event) {
    if (event.keyCode === 68 || event.keyCode === 39)
        //d
        socket.emit("keyPress", {
            inputId: "right",
            state: false
        });
    else if (event.keyCode === 83 || event.keyCode === 40)
        //s
        socket.emit("keyPress", {
            inputId: "down",
            state: false
        });
    else if (event.keyCode === 65 || event.keyCode === 37)
        //a
        socket.emit("keyPress", {
            inputId: "left",
            state: false
        });
    else if (event.keyCode === 87 || event.keyCode === 38)
        // w
        socket.emit("keyPress", {
            inputId: "up",
            state: false
        });
};
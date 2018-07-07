console.log(`File loaded: ../public/assets/js/app.js`);
var socket = io();

//sign
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');
var signDivPassword = document.getElementById('signDiv-password');

var Img = {};
Img.player = new Image();
Img.player.src = '../public/assets/img/Player1.png';
Img.map = new Image();
Img.map.src = '../public/assets/img/hospital.png';

signDivSignIn.onclick = function () {
    socket.emit('signIn', {
        username: signDivUsername.value,
        password: signDivPassword.value
    });
}
signDivSignUp.onclick = function () {
    socket.emit('signUp', {
        username: signDivUsername.value,
        password: signDivPassword.value
    });
}
socket.on('signInResponse', function (data) {
    if (data.success) {
        signDiv.style.display = 'none';
        gameDiv.style.display = 'inline-block';
    } else
        alert("Sign in unsuccessul.");
});
socket.on('signUpResponse', function (data) {
    if (data.success) {
        alert("Sign up successul.");
    } else
        alert("Sign up unsuccessul.");
});

//game
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';


socket.on('newPositions', function (data) {
    ctx.clearRect(0, 0, 500, 500);
    ctx.drawImage(Img.map, 0, 0);
    for (var i = 0; i < data.player.length; i++) {
        ctx.drawImage(Img.player, data.player[i].x, data.player[i].y);
        // Draws username above players head
        // ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);
    }
});

socket.on('addToChat', function (data) {
    chatText.innerHTML += '<div>' + data + '</div>';
});
socket.on('evalAnswer', function (data) {
    console.log(data);
});


chatForm.onsubmit = function (e) {
    e.preventDefault();
    if (chatInput.value[0] === '/')
        socket.emit('evalServer', chatInput.value.slice(1));
    else
        socket.emit('sendMsgToServer', chatInput.value);
    chatInput.value = '';
}

document.onkeydown = function (event) {
    if (event.keyCode === 68) //d
        socket.emit('keyPress', {
            inputId: 'right',
            state: true
        });
    else if (event.keyCode === 83) //s
        socket.emit('keyPress', {
            inputId: 'down',
            state: true
        });
    else if (event.keyCode === 65) //a
        socket.emit('keyPress', {
            inputId: 'left',
            state: true
        });
    else if (event.keyCode === 87) // w
        socket.emit('keyPress', {
            inputId: 'up',
            state: true
        });

}
document.onkeyup = function (event) {
    if (event.keyCode === 68) //d
        socket.emit('keyPress', {
            inputId: 'right',
            state: false
        });
    else if (event.keyCode === 83) //s
        socket.emit('keyPress', {
            inputId: 'down',
            state: false
        });
    else if (event.keyCode === 65) //a
        socket.emit('keyPress', {
            inputId: 'left',
            state: false
        });
    else if (event.keyCode === 87) // w
        socket.emit('keyPress', {
            inputId: 'up',
            state: false
        });
}

document.onmousedown = function (event) {
    socket.emit('keyPress', {
        inputId: 'attack',
        state: true
    });
}
document.onmouseup = function (event) {
    socket.emit('keyPress', {
        inputId: 'attack',
        state: false
    });
}
document.onmousemove = function (event) {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.atan2(y, x) / Math.PI * 180;
    socket.emit('keyPress', {
        inputId: 'mouseAngle',
        state: angle
    });
}
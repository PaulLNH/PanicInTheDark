console.log(`File loaded: ../models/menu.js`);
// canvas
var canvas = document.getElementById("ctx");
var context = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');

console.log(height);

// frames for animation
var frames = 30;
var timerId = 0;
var time = 0.0;

// mouse move event listner
var mouseX;
var mouseY;
canvas.addEventListener("mousemove", checkPos);

// mouse click event listner
var fadeId = 0;
canvas.addEventListener("mouseup", checkClick);

// load images
var Img = {};
Img.logo = new Image();
Img.logo.src = '../public/assets/img/logo.png';
Img.map = new Image();
Img.map.src = '../public/assets/img/hospital.png';
Img.play = new Image();
Img.play.src = "../public/assets/img/play.png";
Img.instructions = new Image();
Img.instructions.src = '../public/assets/img/instructions.png';
Img.leaderboard = new Image();
Img.leaderboard.src = '../public/assets/img/leaderboard.png';
Img.credits = new Image();
Img.credits.src = '../public/assets/img/credits.png';
Img.zombie = new Image();
Img.zombie.src = "../public/assets/img/Zombie1.png";

// Animated character
var zombieX = [0, 0];
var zombieY = [0, 0];
var zombieWidth = 35;
var zombieHeight = 40;
var zombieVisible = false;
var zombieSize = zombieWidth;

// menu button pisitioning
var buttonX = [192, 192, 192, 192];
var buttonY = [150, 250, 350, 450];
var buttonWidth = [400, 400, 400, 400];
var buttonHeight = [120, 120, 120, 120];

// Reference for drawing images:
// ctx.drawImage(image, cropStartX, cropStartY, cropWidth, cropHeight, drawX, drawY, drawWidth, drawHeight);
function draw() {
    context.drawImage(Img.map, 0, 0, Img.map.width, Img.map.height, 0, 0, width, height);
    context.drawImage(Img.logo, 75, 25);
    context.drawImage(Img.play, buttonX[0], buttonY[0]);
    context.drawImage(Img.instructions, buttonX[1], buttonY[1]);
    context.drawImage(Img.leaderboard, buttonX[2], buttonY[2]);
    context.drawImage(Img.credits, buttonX[3], buttonY[3]);

    if (zombieVisible == true) {
        context.drawImage(Img.zombie, zombieX[0] - (zombieSize / 2), zombieY[0], zombieSize, zombieHeight);
        context.drawImage(Img.zombie, zombieX[1] - (zombieSize / 2), zombieY[1], zombieSize, zombieHeight);
    }
}

// function to get mouse position every time the event listner is called
function checkPos(mouseEvent) {
    if (mouseEvent.pageX || mouseEvent.pageY == 0) {
        mouseX = mouseEvent.pageX - this.offsetLeft;
        mouseY = mouseEvent.pageY - this.offsetTop;
    } else if (mouseEvent.offsetX || mouseEvent.offsetY == 0) {
        mouseX = mouseEvent.offsetX;
        mouseY = mouseEvent.offsetY;
    }

    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
            if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
                zombieVisible = true;
                zombieX[0] = buttonX[i] - (zombieWidth / 2) - 2;
                zombieY[0] = buttonY[i] + 40;
                zombieX[1] = buttonX[i] + buttonWidth[i] + (zombieWidth / 2);
                zombieY[1] = buttonY[i] + 40;
            }
        } else {
            zombieVisible = false;
        }
    }
}

function checkClick(mouseEvent) {
    for (i = 0; i < buttonX.length; i++) {
        if (mouseX > buttonX[i] && mouseX < buttonX[i] + buttonWidth[i]) {
            if (mouseY > buttonY[i] && mouseY < buttonY[i] + buttonHeight[i]) {
                fadeId = setInterval("fadeOut()", 1000 / frames);
                clearInterval(timerId);
                canvas.removeEventListener("mousemove", checkPos);
                canvas.removeEventListener("mouseup", checkClick);
            }
        }
    }
}

function fadeOut() {
    context.fillStyle = "rgba(0,0,0, 0.2)";
    context.fillRect(0, 0, width, height);
    time += 0.1;
    if (time >= 2) {
        clearInterval(fadeId);
        time = 0;
        timerId = setInterval("update()", 1000 / frames);
        canvas.addEventListener("mousemove", checkPos);
        canvas.addEventListener("mouseup", checkClick);
    }
}

// clears the canvas
function clear() {
    context.clearRect(0, 0, width, height);
}

// update function
function update() {
    clear();
    // move();
    draw();
}

// run update loop base on our number of frames per second
timerId = setInterval(update, 1000 / frames);
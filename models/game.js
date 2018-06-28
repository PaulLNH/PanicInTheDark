var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';

var HEIGHT = 480;
var WIDTH = 640;

var Img = {};
Img.player = new Image();
Img.player.src = "../public/assets/img/Player1.png";
Img.enemy = new Image();
Img.enemy.src = '../public/assets/img/Zombie1.png';
Img.upgrade1 = new Image();
Img.upgrade1.src = '../public/assets/img/upgrade1.png';
Img.upgrade2 = new Image();
Img.upgrade2.src = '../public/assets/img/upgrade1.png';
Img.map = new Image();
Img.map.src = '../public/assets/img/hospital.png';

var player = {
    x: 50,
    y: 40,
    width: 15,
    height: 25,
    speed: 4,
    img: Img.player,
    //
    pressingDown: false,
    pressingUp: false,
    pressingLeft: false,
    pressingRight: false,
};

drawMap = function () {
    ctx.save();
    ctx.drawImage(Img.map, 0, 0, Img.map.width, Img.map.height, 0, 0, Img.map.width, Img.map.height);
    ctx.restore();
}

drawPlayer = function (char) {
    ctx.save();
    var x = char.x - char.width / 2;
    var y = char.y - char.height / 2;
    ctx.drawImage(char.img, x, y);
    ctx.restore();
}


document.onkeydown = function (event) {
    if (event.keyCode === 68) //d
        player.pressingRight = true;
    else if (event.keyCode === 83) //s
        player.pressingDown = true;
    else if (event.keyCode === 65) //a
        player.pressingLeft = true;
    else if (event.keyCode === 87) // w
        player.pressingUp = true;
}

document.onkeyup = function (event) {
    if (event.keyCode === 68) //d
        player.pressingRight = false;
    else if (event.keyCode === 83) //s
        player.pressingDown = false;
    else if (event.keyCode === 65) //a
        player.pressingLeft = false;
    else if (event.keyCode === 87) // w
        player.pressingUp = false;
}

updatePlayerPosition = function () {
    if (player.pressingRight)
        player.x += player.speed;
    if (player.pressingLeft)
        player.x -= player.speed;
    if (player.pressingDown)
        player.y += player.speed;
    if (player.pressingUp)
        player.y -= player.speed;

    //ispositionvalid
    if (player.x < player.width / 2)
        player.x = player.width / 2;
    if (player.x > WIDTH - player.width / 2)
        player.x = WIDTH - player.width / 2;
    if (player.y < player.height / 2)
        player.y = player.height / 2;
    if (player.y > HEIGHT - player.height / 2)
        player.y = HEIGHT - player.height / 2;
}

update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    updatePlayerPosition();
    drawMap();
    drawPlayer(player);
}

setInterval(update, 40);
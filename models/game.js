var gamePlay = function () {
    var test = "potato";
    console.log(test);
    return;

}

// var ctx = document.getElementById("ctx").getContext("2d");
// // ctx.width = 800;
// // ctx.height = 600;
// ctx.font = "30px Arial";

// Sets tile size (our sprites are default of 16px, we display 32px if we zoom into the map)
// var TILE_SIZE = 32;  // Probably not needed
var TILE_SIZE = 16;
// var HEIGHT = 600;
// var WIDTH = 800;
var HEIGHT = 480;
var WIDTH = 640;
var timerId = 0;
var frames = 30;

// Loads assets into memory
var Img = {
    player: {
        width: 15,
        height: 25,
        src: '/../public/assets/img/Player1.png'
    },
    map: {
        width: 640,
        height: 480,
        src: "/../public/assets/img/hospital.png"
    }
};
// Img.player = new Image();
// Img.player.src = '/../public/assets/img/Player1.png';
// Img.enemy = new Image();
// Img.enemy.src = "/../public/assets/img/Zombie1.png";
// Img.map = new Image();
// Img.map.src = "/../public/assets/img/hospital.png";

// Function to see if two rectangles are colliding, used in the entity constructor
testCollisionRectRect = function (rect1, rect2) {
    return (
        rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height
    );
};

//////// CUSTOM PLAYER CONSTRUCTOR ///////////////
Player = function (name, id, x, y) {

    // ToDo Make these speeds global
    var fastSpeed = 6;
    var slowSpeed = 4;

    //////////// TAKEN FROM ENTITY CONSTRUCTOR ////////////
    // Gives self properties from constructor, this saves the instance of the object instead of using 'this' which is dynamic
    var self = {
        name: name,
        id: id,
        x: x,
        y: y,
        width: 15,
        height: 25,
        speed: 4,
        img: Img.player,
        onTheRun: false,
        // Check to see if keys are pressed, we can use this to check which direction the sprite is moving
        // and animate characters as a strech goal down the road
        pressingDown: false,
        pressingUp: false,
        pressingLeft: false,
        pressingRight: false
    };

    // Allows self to update position and render itself on the canvas
    self.update = function () {
        self.updatePosition();
        self.draw();
    };
    // Draws self on canvas
    self.draw = function () {
        // Saves canvas
        ctx.save();
        var x = self.x;
        var y = self.y;

        x -= self.width / 2;
        y -= self.height / 2;

        // draws new self.img on canvas
        ctx.drawImage(
            self.img,
            0,
            0,
            self.img.width,
            self.img.height,
            x,
            y,
            self.width,
            self.height
        );

        // resores old canvas (everything other than self.img that was just drawn)
        // This is like clearing the canvas without having to draw everything else again
        ctx.restore();
    };

    // Return distance as a number between self and parameter passed through function
    self.getDistance = function (entity2) {
        var vx = self.x - entity2.x; // Gets distance between x
        var vy = self.y - entity2.y; // Gets distance between y
        return Math.sqrt(vx * vx + vy * vy); // Pythagore equation
        // https://en.wikipedia.org/wiki/Pythagorean_theorem
    };

    // Returns true / false if self is colliding with passed parameter
    self.testCollision = function (entity2) {
        // Self
        var rect1 = {
            x: self.x - self.width / 2,
            y: self.y - self.height / 2,
            width: self.width,
            height: self.height
        };
        // Passed entity
        var rect2 = {
            x: entity2.x - entity2.width / 2,
            y: entity2.y - entity2.height / 2,
            width: entity2.width,
            height: entity2.height
        };
        // Passed rectangles into our test collision function and retuns true or false
        return testCollisionRectRect(rect1, rect2);
    };


    // TODO - Figure out what this is for...
    // var super_update = self.update;
    // self.update = function () {
    //     super_update();
    //     if (
    //         self.pressingRight ||
    //         self.pressingLeft ||
    //         self.pressingDown ||
    //         self.pressingUp
    //     )
    //         self.spriteAnimCounter += 0.2;
    // };

    self.switchChaseState = function () {
        self.onTheRun = -self.onTheRun;
        if (self.onTheRun) {
            self.speed = fastSpeed;
        } else {
            self.speed = slowSpeed;
        }
    }

    // Updates player position based on keypress W, A, S, D
    self.updatePosition = function () {
        // Saves old location for collision logic
        var oldX = self.x;
        var oldY = self.y;

        var speed = self.speed;

        // Movement logic
        if (self.pressingRight) self.x += speed;
        if (self.pressingLeft) self.x -= speed;
        if (self.pressingDown) self.y += speed;
        if (self.pressingUp) self.y -= speed;

        // Check to see if position is valid (not out of bounds)
        if (self.x < self.width / 2) self.x = self.width / 2;
        if (self.x > Maps.current.width - self.width / 2)
            self.x = Maps.current.width - self.width / 2;
        if (self.y < self.height / 2) self.y = self.height / 2;
        if (self.y > Maps.current.height - self.height / 2)
            self.y = Maps.current.height - self.height / 2;

        // Checks to see if new position is part of a wall based on array
        if (Maps.current.isPositionWall(self)) {
            // If it is a wall sets the x and y back to the saved x and y from above
            self.x = oldX;
            self.y = oldY;
        }
    };

    self.movement = function () {
        // TODO - Connect with socket...
        socket.on('keyPress', function (data) {
            if (data.inputId === 'left')
                player.pressingLeft = data.state;
            else if (data.inputId === 'right')
                player.pressingRight = data.state;
            else if (data.inputId === 'up')
                player.pressingUp = data.state;
            else if (data.inputId === 'down')
                player.pressingDown = data.state;
        });
    }



    // Player death function
    self.onDeath = function () {
        // Lists the time that player survived, we can re-work this to our score function
        var timeSurvived = Date.now() - timeWhenGameStarted;
        console.log("You lost! You survived for " + timeSurvived + " ms.");
        startNewGame();
    };

    // Returns a Player
    return self;
};



// var P1 = Player("PAUL", "PAUL-ID", 50, 50, Img.player);
// var P2 = Player("JASHAN", "JASHAN-ID", 40, 40, Img.enemy);




// Old keydown logic
// document.onkeydown = function (event) {
//     if (event.keyCode === 68)
//     //d
//     {
//         P1.pressingRight = true;
//         P2.pressingRight = true;
//     } else if (event.keyCode === 83)
//     //s
//     {
//         P1.pressingDown = true;
//         P2.pressingDown = true;
//     } else if (event.keyCode === 65)
//     //a
//     {
//         P1.pressingLeft = true;
//         P2.pressingLeft = true;
//     } else if (event.keyCode === 87)
//     // w
//     {
//         P1.pressingUp = true;
//         P2.pressingUp = true;
//     }
// };

// Old key up logic
// document.onkeyup = function (event) {
//     if (event.keyCode === 68)
//     //d
//     {
//         P1.pressingRight = false;
//         P2.pressingRight = false;
//     } else if (event.keyCode === 83)
//     //s
//     {
//         P1.pressingDown = false;
//         P2.pressingDown = false;
//     } else if (event.keyCode === 65)
//     //a
//     {
//         P1.pressingLeft = false;
//         P2.pressingLeft = false;
//     } else if (event.keyCode === 87)
//     // w
//     {
//         P1.pressingUp = false;
//         P2.pressingUp = false;
//     }
// };

// Update function
update = function () {
    // Clears canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draws the map
    Maps.current.draw();
    // Get a update of players position this frame
    P1.update();
    P2.update();
    // updatePlayerPosition();
    // Draw player based on updated position
    // drawPlayer(player);
};

////////////////// Advanced map constructor (currently used) //////////////
Maps = function (id, imgSrc, grid) {
    var self = {
        id: id,
        image: Img.map,
        width: grid[0].length * TILE_SIZE,
        height: grid.length * TILE_SIZE,
        grid: grid
    };
    self.image.src = imgSrc;

    // Checks to see if current position is a boundry wall
    self.isPositionWall = function (pt) {
        var gridX = Math.floor(pt.x / TILE_SIZE);
        var gridY = Math.floor(pt.y / TILE_SIZE);
        if (gridX < 0 || gridX >= self.grid[0].length) return true;
        if (gridY < 0 || gridY >= self.grid.length) return true;
        return self.grid[gridY][gridX];
    };

    // Renders map onto canvas
    self.draw = function () {
        // var x = WIDTH / 2 - player.x;
        // var y = HEIGHT / 2 - player.y;
        ctx.drawImage(
            self.image,
            0,
            0,
            self.image.width,
            self.image.height,
            0,
            0,
            WIDTH,
            HEIGHT
        );
    };
    return self;
};

// 2d collision array for map obstacles
var array = [
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1
    ],
    [
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1
    ],
    [
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        0,
        0,
        1
    ],
    [
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        1
    ],
    [
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
    ],
    [
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    ]
];

// instantiate map
Maps.current = Maps("hospital", Img.map.src, array);

// Game loop at
// setInterval(update, 40);
timerId = setInterval(update, 1000 / frames);


module.exports = {
    gamePlay: gamePlay
}
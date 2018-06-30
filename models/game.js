var ctx = document.getElementById("ctx").getContext("2d");
// ctx.width = 800;
// ctx.height = 600;
ctx.font = '30px Arial';

// Sets tile size (our sprites are default of 16px, we display 32px if we zoom into the map)
var TILE_SIZE = 32;
var HEIGHT = 600;
var WIDTH = 800;
var timerId = 0;
var frames = 30;

// Loads assets into memory
var Img = {};
Img.player = new Image();
Img.player.src = "../public/assets/img/Player1.png";
Img.enemy = new Image();
Img.enemy.src = '../public/assets/img/Zombie1.png';
Img.map = new Image();
Img.map.src = '../public/assets/img/hospital.png';

// Function to see if two rectangles are colliding, used in the entity constructor
testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
}

//////// CUSTOM PLAYER CONSTRUCTOR ///////////////
Player = function (name, id, x, y, img) {
    //////////// TAKEN FROM ENTITY CONSTRUCTOR ////////////
    // Gives self properties from constructor, this saves the instance of the object instead of using 'this' which is dynamic
    var self = {
        name: name,
        id: id,
        x: x,
        y: y,
        img: img,
    };
    // Allows self to update position and render itself on the canvas
    self.update = function () {
        self.updatePosition();
        self.draw();
    }
    // Draws self on canvas
    self.draw = function () {
        // Saves canvas
        ctx.save();
        var x = self.x - player.x;
        var y = self.y - player.y;

        x += WIDTH / 2;
        y += HEIGHT / 2;

        x -= self.width / 2;
        y -= self.height / 2;

        // draws new self.img on canvas
        ctx.drawImage(self.img,
            0, 0, self.img.width, self.img.height,
            x, y, self.width, self.height
        );

        // resores old canvas (everything other than self.img that was just drawn)
        // This is like clearing the canvas without having to draw everything else again
        ctx.restore();
    }

    // Return distance as a number between self and parameter passed through function
    self.getDistance = function (entity2) {
        var vx = self.x - entity2.x; // Gets distance between x
        var vy = self.y - entity2.y; // Gets distance between y
        return Math.sqrt(vx * vx + vy * vy); // Pythagore equation
        // https://en.wikipedia.org/wiki/Pythagorean_theorem
    }

    // Returns true / false if self is colliding with passed parameter
    self.testCollision = function (entity2) {
        // Self
        var rect1 = {
            x: self.x - self.width / 2,
            y: self.y - self.height / 2,
            width: self.width,
            height: self.height,
        }
        // Passed entity
        var rect2 = {
            x: entity2.x - entity2.width / 2,
            y: entity2.y - entity2.height / 2,
            width: entity2.width,
            height: entity2.height,
        }
        // Passed rectangles into our test collision function and retuns true or false
        return testCollisionRectRect(rect1, rect2);

    }
    // Creates an empty function for updatePosition which will be used for constructed objects
    self.updatePosition = function () {}

    // Returns the self object representing a new entity

    //////////// TAKEN FROM ACTOR CONSTRUCTOR ////////////

    // Keeping this function as we can use it for our team state
    // onDeath = zombie
    var super_update = self.update;
    self.update = function () {
        super_update();
        self.attackCounter += self.atkSpd;
        if (self.hp <= 0)
            self.onDeath();
    }
    // onDeath function that gets called if above condition is true (believe this gets prototyped later on)
    self.onDeath = function () {};

    //////////// TAKEN FROM PLAYER CONSTRUCTOR ////////////

    // Not sure exactly what this does but appears to ramp up speed as user moves instead of starting off at full speed
    // Looks like it smooths out the acceleration
    var super_update = self.update;
    self.update = function () {
        super_update();
        if (self.pressingRight || self.pressingLeft || self.pressingDown || self.pressingUp)
            self.spriteAnimCounter += 0.2;
    }

    // Updates player position based on keypress W, A, S, D
    self.updatePosition = function () {
        // Saves old location for collision logic
        var oldX = self.x;
        var oldY = self.y;
        // Sets speed to 4 for now
        var speed = 4;

        // Speed can change depending on if player is running or not
        // For example: It's dark and humans are running, humans speed = 6, zombie speed = 4
        if (self.onTheRun) {
            speed = 6;
        } else {
            speed = 4;
        }

        // Movement logic
        if (self.pressingRight)
            self.x += speed;
        if (self.pressingLeft)
            self.x -= speed;
        if (self.pressingDown)
            self.y += speed;
        if (self.pressingUp)
            self.y -= speed;

        // Check to see if position is valid (not out of bounds)
        if (self.x < self.width / 2)
            self.x = self.width / 2;
        if (self.x > Maps.current.width - self.width / 2)
            self.x = Maps.current.width - self.width / 2;
        if (self.y < self.height / 2)
            self.y = self.height / 2;
        if (self.y > Maps.current.height - self.height / 2)
            self.y = Maps.current.height - self.height / 2;

        // Checks to see if new position is part of a wall based on array
        if (Maps.current.isPositionWall(self)) {
            // If it is a wall sets the x and y back to the saved x and y from above
            self.x = oldX;
            self.y = oldY;
        }
    }

    // Player death function
    self.onDeath = function () {
        // Lists the time that player survived, we can re-work this to our score function
        var timeSurvived = Date.now() - timeWhenGameStarted;
        console.log("You lost! You survived for " + timeSurvived + " ms.");
        startNewGame();
    }
    // Check to see if keys are pressed, we can use this to check which direction the sprite is moving
    // and animate characters as a strech goal down the road
    self.pressingDown = false;
    self.pressingUp = false;
    self.pressingLeft = false;
    self.pressingRight = false;

    // Returns a Player
    return self;
}

//////////////// OLD PLAYER LOGIC BELOW THIS LINE - WORKS ON SINGLE PLAYER //////////////
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

    // updatePosition: function updatePosition() {
    //     var oldX = player.x;
    //     var oldY = player.y;
    //     if (Maps.current.isPositionWall(player)) {
    //         player.x = oldX;
    //         player.y = oldY;
    //     }
    // }
};
// Old draw player function
drawPlayer = function (char) {
    ctx.save();
    var x = char.x - char.width / 2;
    var y = char.y - char.height / 2;
    ctx.drawImage(char.img, x, y);
    ctx.restore();
}
// Old keydown logic
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
// Old key up logic
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
// Old update player position logic
updatePlayerPosition = function () {
    if (player.pressingRight)
        player.x += player.speed;
    if (player.pressingLeft)
        player.x -= player.speed;
    if (player.pressingDown)
        player.y += player.speed;
    if (player.pressingUp)
        player.y -= player.speed;

    // Old isPositionWall logic
    if (player.x < player.width / 2)
        player.x = player.width / 2;
    if (player.x > WIDTH - player.width / 2)
        player.x = WIDTH - player.width / 2;
    if (player.y < player.height / 2)
        player.y = player.height / 2;
    if (player.y > HEIGHT - player.height / 2)
        player.y = HEIGHT - player.height / 2;
}
// Update function
update = function () {
    // Clears canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draws the map
    Maps.current.draw();
    // Get a update of players position this frame
    updatePlayerPosition();
    // Draw player based on updated position
    drawPlayer(player);
}

// Reference for drawing images:
// ctx.drawImage(image, cropStartX, cropStartY, cropWidth, cropHeight, drawX, drawY, drawWidth, drawHeight);
// Old draw map function
drawMap = function () {
    ctx.save();
    ctx.drawImage(Img.map, 0, 0, Img.map.width, Img.map.height, 0, 0, WIDTH, HEIGHT);
    ctx.restore();
}

////////////////// Advanced map constructor (currently used) //////////////
Maps = function (id, imgSrc, grid) {
    var self = {
        id: id,
        image: new Image(),
        width: grid[0].length * TILE_SIZE,
        height: grid.length * TILE_SIZE,
        grid: grid,
    }
    self.image.src = imgSrc;

    // Checks to see if current position is a boundry wall
    self.isPositionWall = function (pt) {
        var gridX = Math.floor(pt.x / TILE_SIZE);
        var gridY = Math.floor(pt.y / TILE_SIZE);
        if (gridX < 0 || gridX >= self.grid[0].length)
            return true;
        if (gridY < 0 || gridY >= self.grid.length)
            return true;
        return self.grid[gridY][gridX];
    }

    // Renders map onto canvas
    self.draw = function () {
        var x = WIDTH / 2 - player.x;
        var y = HEIGHT / 2 - player.y;
        ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, 0, 0, WIDTH, HEIGHT);
    }
    return self;
}

// 2d collision array for map obstacles
var array = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


// instantiate map
Maps.current = Maps('hospital', Img.map.src, array);

// Game loop at 
// setInterval(update, 40);
timerId = setInterval(update, 1000 / frames);
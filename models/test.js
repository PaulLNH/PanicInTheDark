console.log(`File loaded: ../public/assets/js/test.js`);

var SOCKET_LIST = {};

const grid = [
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
const TILE_SIZE = 16;
const WIDTH = 640;
const HEIGHT = 480;
// var huntTeam = "waiting"; // DO NOT FORGET ABOUT THIS OR YOU WILL GO MAD!
var huntTeam = "zombie";

var stopwatch = {
    clockRunning: false,
    time: 10,
    reset: function () {
        stopwatch.time = 10;
        // DONE: Change the "display" div to "00:00."
        // $("#timer").text("10");
    },
    start: function () {
        // DONE: Use setInterval to start the count here and set the clock to running.
        if (!stopwatch.clockRunning) {
            intervalId = setInterval(stopwatch.count, 1000);
            stopwatch.clockRunning = true;
        }
    },
    stop: function () {

        // Use clearInterval to stop the count here and set the clock to not be running.
        clearInterval(intervalId);
        stopwatch.clockRunning = false;
    },
    count: function () {
        // Increment time by 1, remember we cant use "this" here.
        stopwatch.time = stopwatch.time - 1;
        // Get the current time, pass that into the stopwatch.timeConverter function, and save the result in a variable.
        var converted = stopwatch.timeConverter(stopwatch.time);
        if (converted == "00") {
            stopwatch.stop();
            stopwatch.reset();
            stopwatch.switchHuntTeam();
            stopwatch.start();
            // setTimeout(runNewQuestion, 5000);
        }
        console.log(converted);
        // Use the variable we just created to show the converted time in the "display" div.
    },
    timeConverter: function (seconds) {

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return seconds;
    },
    switchHuntTeam: function () {
        if (huntTeam === "human") {
            huntTeam = "zombie";
        } else if (huntTeam === "zombie") {
            huntTeam = "human";
        }
    }
};

var Player = function (id, username, team) {
    var self = {
        id: id,
        username: username,
        number: "" + Math.floor(10 * Math.random()), // Probably not needed
        maxSpd: 4,
        x: 250,
        y: 225,
        spdX: 0,
        spdY: 0,
        width: 14,
        height: 25,
        maxSpd: 4,
        team: team,
        living: true,
        score: 0
    };
    console.log(`Player.username: ${self.username}`);

    self.update = function () {
        self.updatePosition();
        self.updateSpd();
    };

    self.updatePosition = function () {
        var oldX = self.x;
        var oldY = self.y;

        self.x += self.spdX;
        self.y += self.spdY;

        // Logic to check to see if the player is within the map boundries
        if (self.x < self.width / 2) {
            self.x = self.width / 2;
        }
        if (self.x > WIDTH - self.width / 2) {
            self.x = WIDTH - self.width / 2;
        }
        if (self.y < self.height / 2) {
            self.y = self.height / 2;
        }
        if (self.y > HEIGHT - self.height / 2) {
            self.y = HEIGHT - self.height / 2;
        }

        // Logic to see if the player is hitting a wall
        if (isPositionWall(self)) {
            self.x = oldX;
            self.y = oldY;
        }
    };

    self.updateSpd = function () {
        if (self.pressingRight) self.spdX = self.maxSpd;
        else if (self.pressingLeft) self.spdX = -self.maxSpd;
        else self.spdX = 0;

        if (self.pressingUp) self.spdY = -self.maxSpd;
        else if (self.pressingDown) self.spdY = self.maxSpd;
        else self.spdY = 0;
    };

    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;

    Player.list[id] = self;

    if (self.team == "zombie") {
        zombieList.push(self);
    } else {
        humanList.push(self);
    }

    return self;
};

humanList = [];
zombieList = [];

Player.list = {};
Player.onConnect = function (socket, data) {
    // var team = "";
    if (humanList.length > zombieList.length) {
        // team = "zombie";

        var player = Player(socket.id, data.username, "zombie");
        socket.on("keyPress", function (data) {
            if (data.inputId === "left") player.pressingLeft = data.state;
            else if (data.inputId === "right") player.pressingRight = data.state;
            else if (data.inputId === "up") player.pressingUp = data.state;
            else if (data.inputId === "down") player.pressingDown = data.state;
        });
    } else {
        // team = "human";
        var player = Player(socket.id, data.username, "human");
        socket.on("keyPress", function (data) {
            if (data.inputId === "left") player.pressingLeft = data.state;
            else if (data.inputId === "right") player.pressingRight = data.state;
            else if (data.inputId === "up") player.pressingUp = data.state;
            else if (data.inputId === "down") player.pressingDown = data.state;
        });
    }

};

Player.onDisconnect = function (socket) {
    delete Player.list[socket.id];
};

Player.update = function (t) {
    var pack = [];
    // Pushing huntTeam works in terms of the server knowing which team is current hunting team, breaks death though...
    // pack.push({
    //     huntTeam: huntTeam
    // });
    // console.log(t);
    // if (t === 0 && huntTeam === "human") {
    //     huntTeam = "zombie";
    //     console.log(`This is what the server.js thinks huntTeam is: ${huntTeam}`);
    // } else if (t === 0 && huntTeam === "zombie") {
    //     huntTeam = "human";
    //     console.log(`This is what the server.js thinks huntTeam is: ${huntTeam}`);
    // }


    // console.log(`This is what the test.js thinks huntTeam is: ${huntTeam}`);
    for (var i in Player.list) {
        var player = Player.list[i];
        player.update();

        switch (player.team) {
            case "zombie":
                for (var j in humanList) {
                    if (testCollisionRectRect(player, humanList[j]) && humanList[j].living && Player.list[i].living) {

                        console.log(`${player.username} has tagged ${humanList[j].username}`);
                        for (var k in Player.list) {
                            if (Player.list[k].id == humanList[j].id) {
                                switch (huntTeam) {
                                    case "zombie":
                                        console.log(`Before for zombie: Player ${Player.list[k].username} status of living is now ${Player.list[k].living}`);
                                        Player.list[k].living = false;
                                        humanList[j].living = false;
                                        console.log(`After for zombie: Player ${Player.list[k].username} status of living is now ${Player.list[k].living}`);
                                        break;
                                    case "human":
                                        console.log(`Before for human: Player ${Player.list[i].username} status of living is now ${Player.list[i].living}`);
                                        Player.list[i].living = false;
                                        console.log(`After for human: Player ${Player.list[i].username} status of living is now ${Player.list[i].living}`);
                                        break;
                                }
                            }
                        }
                    }
                }
                break;
            case "human":
                break;
        }

        pack.push({
            x: player.x,
            y: player.y,
            id: player.id,
            username: player.username,
            living: player.living
        });
    }

    return pack;
};

isPositionWall = function (pt) {
    var gridX = Math.floor(pt.x / TILE_SIZE);
    var gridY = Math.floor(pt.y / TILE_SIZE);
    if (gridX < 0 || gridX >= grid[0].length) return true;
    if (gridY < 0 || gridY >= grid.length) return true;
    return grid[gridY][gridX];
};

var DEBUG = true;

var USERS = {
    //username:password
    paul: "123",
    jashan: "123",
    corey: "123",
    usainbolt: "123",
    a: "123",
    imaridiculouspersonwhoisbeingobnoxious: "123"
};

var isValidPassword = function (data, cb) {
    setTimeout(function () {
        cb(USERS[data.username] === data.password);
    }, 10);
};
var isUsernameTaken = function (data, cb) {
    setTimeout(function () {
        cb(USERS[data.username]);
    }, 10);
};
var addUser = function (data, cb) {
    setTimeout(function () {
        USERS[data.username] = data.password;
        cb();
    }, 10);
};

//////////// PLAYER COLISSION /////////////

testCollisionRectRect = function (rect1, rect2) {
    return (
        rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height
    );
};

/// ADDS the testCollision function to the Player constructor
Player.testCollision = function (entity2) {
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

module.exports = {
    Player: Player,
    SOCKET_LIST: SOCKET_LIST,
    DEBUG: DEBUG,
    USERS: USERS,
    isValidPassword: isValidPassword,
    isUsernameTaken: isUsernameTaken,
    addUser: addUser,
    stopwatch: stopwatch,
    huntTeam: huntTeam
};
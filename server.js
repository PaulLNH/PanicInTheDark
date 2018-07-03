var express = require('express');
var app = express();
var serv = require('http').Server(app);
var PORT = 2000;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/public', express.static(__dirname + '/public'));

// TODO - Don't give models folder to user!!! Process.env...
app.use('/models', express.static(__dirname + '/models'));

serv.listen(PORT);
console.log(`server listening on port ${PORT}`);


// Look into https://socket.io/get-started/chat/ for multiplayer if Firebase does not work out
var io = require('socket.io')(serv, {});

var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(id){
	var self = {
		x:250,
		y:250,
		id:id,
		number:"" + Math.floor(10 * Math.random()),
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,	
		maxSpd:10,
    }
	self.updatePosition = function(){
		if(self.pressingRight)
			self.x += self.maxSpd;
		if(self.pressingLeft)
			self.x -= self.maxSpd;
		if(self.pressingUp)
			self.y -= self.maxSpd;
		if(self.pressingDown)
			self.y += self.maxSpd;
	}
	return self;
}

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.id = Math.random();
    console.log(socket.id)
	SOCKET_LIST[socket.id] = socket;

	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});
	
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
    });
    // console.log(SOCKET_LIST);
    console.log(PLAYER_LIST);
    socket.on('disconnect', function () {
        console.log('user disconnected');
        console.log(socket.id);
    });	
});
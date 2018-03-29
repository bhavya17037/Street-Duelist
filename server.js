var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static('public'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
    socket.on('playercoord',function(data){
        socket.broadcast.emit('enemycoord',data);
    });
    socket.on('ballcoord',function(data){
        socket.broadcast.emit('ballcoord',data);
    });
});
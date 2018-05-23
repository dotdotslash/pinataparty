var express = require('express');
var app = express();  
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/dist'))

app.get('/', function(req, res){
	res.sendFile(__dirname + '/dist/index.html');
});
    
io.on('connection', function(socket){

  socket.username = "Anonymous";
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  //socket.send(socket.id);
  console.log(socket.id);

  socket.on('join', function(username){
    socket.username = username;
    console.log('New user ' + username + ' joined');
    io.emit('joined', username);
    io.emit('adduser', username);

    console.log(socket.username );
  });

  socket.on('send', function(msg){
    console.log(socket.username );
    console.log(socket.username+' sent message: ' + msg);
      io.emit('onmessage', {'username': socket.username,'message': msg} );
   // io.emit('onmessage', msg );
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });	
  
});

http.listen(7700, function(){
  console.log('listening on *:7700');
});
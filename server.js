var express = require('express');
var app = express();  
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/dist'))

app.get('/', function(req, res){
	res.sendFile(__dirname + '/dist/index.html');
});
    
io.on('connection', function(socket){
  console.log(socket.id);

  socket.username = "Anonymous";
  console.log('a user connected');
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('join', function(username){
    socket.username = username;
    console.log('New user ' + username + ' joined');
    io.emit('joined', username);
    io.emit('adduser', username);
  });

  socket.on('send', function(msg){
      console.log(socket.username+' sent message: ' + msg);
      io.emit('onmessage', {'username': socket.username,'message': msg} );
  });

  socket.on('device update', function(data){
    //console.log(data);
    io.emit('deviceInfo', data );
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });	
  
});

http.listen(7700, function(){
  console.log('listening on *:7700');
});
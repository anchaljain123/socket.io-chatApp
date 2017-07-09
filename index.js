var app = require('express')();

var http = require('http').Server(app);
var connections  = [] ,users = [];
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){ //receive event on server side
    connections.push(socket);
    console.log('Connected : %s sockets connected',connections.length);

    socket.on('chat message', function(data){
        io.emit('chat message',{msg:data,user:socket.username}); //sending to client
    });

    //Disconnected
    socket.on('disconnect',function (data) {
       // if(!socket.username) return;
        users.splice(users.indexOf(socket.username),1); //if user is present then delete from array
        updateUsernames();
        connections.splice(connections.indexOf(socket),1); //disconnect
        console.log('Disconnected : %s sockets connected',connections.length)
    });

    //New User
    socket.on('new user',function (data,callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.emit('get users',users)
    }

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
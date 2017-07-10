require('./config/connection');
var User = require('./user/user.modal');
var app = require('express')();
var http = require('http').Server(app);
var connections  = [] ,users = [],allusers= [];
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser());
var userRoutes = require('./user/user.route');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){ //receive event on server side

    //socket.send(socket.id);
    console.log("server",socket.id)

    connections.push(socket);
    console.log('Connected : %s sockets connected',connections.length);

    socket.on('chat message', function(data){
        io.emit('chat message',{msg:data,user:socket.username}); //sending to client
    });

    //Disconnected
    socket.on('disconnect',function (data) {
            User.update({"socketId":socket.id},{$set: {'status': 'Offline'}},function (err,data) {
                if(err){
                    socket.emit('update user failed',err)
                }else {
                    console.log("update---",data);
                    io.emit('update user success',data);
                }
            });
        connections.splice(connections.indexOf(socket),1); //disconnect
        console.log('Disconnected : %s sockets disconnected',connections.length)
    });

    //New User
    socket.on('new user',function (data) {
        socket.username = data;
        var user = {
            username: data,
            socketId: socket.id
        };

        new User(user).save(function (err, doc) {
            if(err){
                socket.emit('save user failed',err)
            }else {
                //socket.emit('save user success',doc);
                io.emit('save user success',doc);

            }
        })

    });

    socket.on("get users",function () {
        User.find({status:"Online"},function (err,data) {
            if(err){
                io.emit(" get users failed",err)
            }else {
                console.log("data---",data);
                io.emit("get users success",data)
            }
        });
    });




});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
require('./config/connection');
var User = require('./user/user.modal');
var Chat = require('./chat/chat.modal');
var app = require('express')();
var http = require('http').Server(app);
var connections = [], users = [], allusers = [];
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
app.use(bodyParser());


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', function (socket) { //receive event on server side
    //socket.send(socket.id);
    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length);

    //Chat Rooms

    /*  function createNamespace(i) {
     var group = io.of('/group-'+i);
     group.on('connection',function (socket) {
     socket.on('message.send',function (data) {
     group.emit('message.sent',data)
     })
     })
     }

     for(var i=0;i<2;i++){
     createNamespace(i)
     }*/

    //Chatting
 /*   socket.on('chat message', function (data) {
        io.emit('chat message', {msg: data, user: socket.username}); //sending to client
    });*/

    // save Chat
    socket.on("save chat", function (data) {
        var chatObj = {
            message: data.msg,
            postedBy: data.user
        };
        if(data.msg) {
           var newMsg =  new Chat(chatObj);
            newMsg.save(chatObj,function (err, data) {
                if (err) {
                    io.emit("save chat failed", err)
                } else {
                    io.emit("save chat success", data)
                }
            })
        }
    });


    //Disconnected
    socket.on('disconnect', function (data) {
        User.update({"socketId": socket.id}, {$set: {'status': 'Offline'}}, function (err, data) {
            if (err) {
                socket.emit('update user failed', err)
            } else {
                io.emit('update user success', data);
            }
        });
        connections.splice(connections.indexOf(socket), 1); //disconnect
        console.log('Disconnected : %s sockets connected', connections.length)
    });

    //New User
    socket.on('new user', function (data) {
        socket.username = data;
        var user = {
            username: data,
            socketId: socket.id
        };
        new User(user).save(function (err, doc) {
            if (err) {
                socket.emit('save user failed', err)
            } else {
                io.emit('save user success', doc);//'io' - globally reflect changes
            }
        })
    });

    //Online Users
    socket.on("get users", function () {
        User.find({status: "Online"}, function (err, data) {
            if (err) {
                io.emit(" get users failed", err)
            } else {
                io.emit("get users success", data)
            }
        });
    });

    //Chats

    socket.on("getMessages", function () {
        Chat.find({}, function (err, data) {
            if (err) {
                io.emit("get messages failed", err)
            } else {
                console.log(data);
                io.emit("get messages success", data)
            }
        });
    });


});


//Litening Server
http.listen(3000, function () {
    console.log('listening on *:3000');
});
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};

server.listen(3000);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('new user', function(data, callback) {
        // Check if the username is already taken
       if (data in users) {
           callback(false);
       }
       else {
           callback(true);
           socket.nickname = data;
           users[socket.nickname] = socket;
           updateNicknames();
       }
    });

    function updateNicknames() {
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send message', function (data, callback) {
        var msg = data.trim();
        if(msg.substr(0, 8) === 'private ') {
            // if the chat is in the format "private + receiver_name + msg"
            msg = msg.substr(8);
            var ind = msg.indexOf(' ');
            if (ind !== -1) {
                // if there is a message
                var name = msg.substr(0, ind);
                msg = msg.substr((ind+1));
                users[socket.nickname].emit('whisper', {msg: msg, nick: socket.nickname});
                if (name in users) {
                    // if the receiver exists
                    users[name].emit('whisper', {msg: msg, nick: socket.nickname});
                    console.log("whisper");
                }
                else {
                    callback('Error! Enter a valid user.');
                }
            }
            else {
                callback('Error! Please enter a message.');
            }

        }
        else{
            // public message
            io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
        }

    });

    socket.on('disconnect', function (data) {
        // if a user disconnect, then they will be removed from the chat room
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });
});
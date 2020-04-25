const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//database
const  mongoose  = require("mongoose");
var Chatroom = require('./model/chatDB.js');
require("./model/connectDB");


const rooms = { }

// index page
app.get('/chatrooms', (req, res) => { res.render('index', { rooms: rooms }) })

// generate new room
app.get('/createroom/:room', (req, res) => { createRoom(req, res); })

// redirect to new room after creating new room
app.get('/chatrooms/:room', (req, res) => { getRoom(req, res); })

// delete room
app.get('/delete/:room', (req, res) =>{ deleteRoom(req, res); })


server.listen(3000)


// connecting to room(changing ejs)
io.on('connection', socket => {
  console.log('connected');
  socket.on('room-created', room => {
    console.log('room created ' + room)
  });
  socket.on('new-user', async (room, name, userId) => {
    console.log(`new-user ${room} ${name}`);
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)

    //add user to chatroom database
    let chatroomDB = await Chatroom.findOne({ name: room })

    if (chatroomDB.users.indexOf(userId) === -1){
      console.log("user joined" + room)
      await Chatroom.updateOne({ name:room }, {$push:{users: userId}})
    }
  })

  socket.on('send-chat-message', async (room, message) => {
    console.log(`chat-message ${room} ${message}`);
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })

    //add message to database
    let chatroomDB = await Chatroom.findOne({ name: room })

    await Chatroom.updateOne(
      { name:room }, 
      {$push:{ messages:{ from: rooms[room].users[socket.id], body: message}
      }}
    )       
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})





/* --------------------------- FUNCTIONS --------------------------*/


// get the users in room
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}


async function getRoom(req, res) {
  if (rooms[req.params.room] == null) {
    return res.redirect('/chatrooms')
  }
  console.log('get chatroom/room')
  let chatroomDB = await Chatroom.findOne({ name: req.params.room })
  res.render('room', { 
    roomName: req.params.room, 
    userName: "JON",
    userId: "MOM",
    chatHistory: chatroomDB.messages
  })
}

async function createRoom(req, res) {
  if (rooms[req.params.room] != null) {
    return res.redirect('/chatrooms')
  }
  rooms[req.params.room] = { users: {} }
  
  console.log(req.params.room);

  //createroom at database
  let newChatroom = new Chatroom({});

  newChatroom.name = req.params.room
  newChatroom.users = [];
  newChatroom.messages = [];

  // save the new chatroom
  newChatroom.save(function (err, chatroom){
    if(err){
        console.error('error when creating room');
    }else{
        console.log(" chatroom created.: " + chatroom);
    }
  });

  res.redirect(`/chatrooms/${req.params.room}`)
}

async function deleteRoom(req, res){

  await Chatroom.deleteOne({ name: req.params.room }, function (err) {
    if(err){
      res.send("Room not found")
      console.log("Room not found")
    }
    else{
      delete rooms[req.params.room]
      console.log("SUCCES IN DELETING " + req.params.room)
    }
  });
  return res.redirect('/chatrooms')
}
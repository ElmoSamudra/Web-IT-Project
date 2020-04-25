const express = require('express')
const chat = express()
const chatRouter = express.Router();
const server = require('http').Server(chat)
const io = require('socket.io')(server)
const auth = require("../middleware/authentication");


//database
var Chatroom = require('../models/chatDB.js');

// create current active chats
const rooms = { }

// redirecting
chatRouter.get('/', auth, (req, res) =>{ res.redirect('/chats/chatrooms') })

// index page
chatRouter.get('/chatrooms', auth, (req, res) => { res.render('chatIndex', { rooms: rooms }) })

// generate new room
chatRouter.get('/createroom/:room', auth, (req, res) => { createRoom(req, res); })

// redirect to new room after creating new room
chatRouter.get('/chatrooms/:room', auth, (req, res) => { getRoom(req, res); })

// delete room
chatRouter.get('/delete/:room', auth, (req, res) =>{ deleteRoom(req, res); })


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
    return res.redirect('/chats/chatrooms')
  }
  console.log('get chatroom/room')
  let chatroomDB = await Chatroom.findOne({ name: req.params.room })
  res.render('room', { 
    roomName: req.params.room, 
    userName: req.account.name,
    userId: req.account._id,
    chatHistory: chatroomDB.messages
  })
}

async function createRoom(req, res) {
  if (rooms[req.params.room] != null) {
    return res.redirect('/chats/chatrooms')
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

  res.redirect(`/chats/chatrooms/${req.params.room}`)
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
  return res.redirect('/chats/chatrooms')
}

//export
module.exports = chatRouter;
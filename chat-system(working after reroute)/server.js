const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

// index page
app.get('/chatrooms', (req, res) => {
  console.log(rooms);
  res.render('index', { rooms: rooms })
})

// generate new room
app.post('/chatrooms/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/chatrooms')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect('/chatrooms')
  // Send message that new room was created
  io.emit('room-created', req.body.room)
  console.log(req.body.room);
})


// redirect to new room after creating new room
app.get('/chatrooms/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)


// connecting to room(changing ejs)
io.on('connection', socket => {
  console.log('connected');
  socket.on('room-created', room => {
    console.log('room created ' + room)
  });
  socket.on('new-user', (room, name) => {
    console.log(`new-user ${room} ${name}`);
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => {
    console.log(`chat-message ${room} ${message}`);
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

// get the users in room
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
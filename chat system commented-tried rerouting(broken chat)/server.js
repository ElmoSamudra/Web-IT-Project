// Server side

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)


app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

server.listen(3000)

app.get('/', (req, res) => {
  res.send('HOMEPAGE')
})

// index page
app.get('/chatrooms', (req, res) => {
  res.render('index', { rooms: rooms }) 
})


// generate new room
app.post('/chatrooms/room', (req, res) => {
  if (rooms[req.body.room] != null) {
      // if the room name already exists, redirect to the index page
    return res.redirect('/chatrooms')
  }

  // create a new room
  rooms[req.body.room] = { users: {} }  

  res.redirect('/chatrooms')  

  // Send message that new room was created
  io.emit('room-created', `/chatrooms/${req.body.room}`)
})


app.get('/chatrooms/:room', (req, res) => { 
  if (rooms[req.params.room] == null) {
    // if the desired room name doesnt exist, redirect to the index page
    return res.redirect('/chatrooms')
  }

  // redirect to the desired room
  res.render('room', { roomName: req.params.room })
})

app.get('/agent', (req, res) => {
  res.send('<h1>AGENT UTILS PAGE</h1>')
})


// connecting to room(changing ejs)

io.on('connection', socket => { 
  // everytime a user loads oout website, it will call this function
  //  giving the user their own socket

  socket.on('new-user', (room, name) => { // catch the new-user event, name as the data
    socket.join(room)

    // add a new object to users array of the specified room with name as the value
    rooms[room].users[socket.id] = name  

    // notify other users inside that room when a new user is connected
    socket.to(room).broadcast.emit('user-connected', name)  
  })

  socket.on('send-chat-message', (room, message) => {
    // broadcast the message to every other person connected to the server except to the sender
    // passing the name and the message
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

// get all rooms where the user is in
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}
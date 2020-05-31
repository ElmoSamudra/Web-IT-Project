const express = require("express");
// const chat = express()
const chatRouter = express.Router();

const auth = require("../middleware/authentication");

//database
var Chatroom = require("../models/chatDB.js");

/******************* chat functions **********************************/
const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (existingUser) {
    return { error: "user already in chat" };
  }

  const user = { id, name, room };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// redirecting
chatRouter.get("/", auth, (req, res) => {
  res.send("chat here").status(200);
});

// connecting to room(changing ejs)
function ioInitialise(io) {
  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.emit("message", {
        user: "admin",
        text: `${user.name} welcome to the chat`,
      });
      socket.broadcast
        .to(user.room)
        .emit("message", {
          user: "admin",
          text: `${user.name} joined the chat`,
        });
      socket.join(user.room);

      callback();
    });

    // socket.on('new-user', async (room, name, userId) => {
    //   console.log(`new-user ${room} ${name}`);
    //   socket.join(room)
    //   rooms[room].users[socket.id] = name
    //   socket.to(room).broadcast.emit('user-connected', name)

    //   //add user to chatroom database
    //   let chatroomDB = await Chatroom.findOne({ name: room })

    //   if (chatroomDB.users.indexOf(userId) === -1){
    //     console.log("user joined" + room)
    //     await Chatroom.updateOne({ name:room }, {$push:{users: userId}})
    //   }
    // })

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit("message", { user: user.name, text: message });

      callback();
      // socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })

      //   //add message to database
      //   let chatroomDB = await Chatroom.findOne({ name: room })

      //   await Chatroom.updateOne(
      //     { name:room },
      //     {$push:{ messages:{ from: rooms[room].users[socket.id], body: message}
      //     }}
      //   )
    });

    socket.on("disconnect", () => {
      // getUserRooms(socket).forEach(room => {
      //   socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      //   delete rooms[room].users[socket.id]
      // })
      const user = removeUser(socket.id);
      console.log("disconnected");
    });
  });
}

//export
module.exports = chatRouter;
module.exports.sockets = ioInitialise;

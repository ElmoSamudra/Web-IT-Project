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

// redirecting
chatRouter.get("/", auth, (req, res) => {
  res.send("chat here").status(200);
});

// get the chat history of the user based on the roomname
chatRouter.post("/history", auth, async (req, res) => {
  const roomName = req.body.room;
  try {
    const chatHisto = await Chatroom.findOne({ name: roomName });
    res.send(chatHisto);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

// connecting to room(changing ejs)
async function ioInitialise(io) {
  io.on("connection", (socket) => {
    console.log("connected");
    socket.on("join", async ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.emit("message", {
        user: "admin",
        text: `${user.name} welcome to the chat`,
      });
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} joined the chat`,
      });
      socket.join(user.room);

      let chatroomDB = await Chatroom.findOne({ name: room });

      if (chatroomDB.users.indexOf(user.name) === -1) {
        console.log("user joined" + room);
        await Chatroom.updateOne(
          { name: room },
          { $push: { users: user.name } }
        );
      }

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

    socket.on("sendMessage", async (message, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit("message", { user: user.name, text: message });

      let chatroomDB = await Chatroom.findOne({ name: user.room });

      await Chatroom.updateOne(
        { name: user.room },
        { $push: { messages: { from: user.name, body: message } } }
      );

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

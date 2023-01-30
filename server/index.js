const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const { EventEmitter } = require("events");

const eventEmitter = new EventEmitter();

app.use(express.json());
app.use(cors());

// TODO: add auth middleware
// Here is a middleware function that will be called for every request
// socketIO.use((socket, next) => {
//   const username = socket.handshake.auth;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

// For this, only set socket.auth when the user selects a username
//   socket.auth = { username }
//   socket.connect()

const { addUser, removeUser, usersArr } = require("./user");
const {
  addAvailableSeller,
  removeAvailableSeller,
  availableSellers,
} = require("./seller");

socketIO.on("connection", (socket) => {
  socket.on("join", ({ name, room, maxUsers }, callBack) => {
    const { user, error } = addUser({ id: socket.id, name, room, maxUsers });

    if (error) return callBack(error);

    socket.join(user?.room);
    socket.emit("message", {
      user: "Bot",
      text: `Bienvenu dans ${user?.room} ${user.name} limité à ${maxUsers} utilisateurs!`,
    });

    socket.broadcast
      .to(user?.room)
      .emit("message", { user: "Bot", text: `${user?.name} has joined!` });
    callBack(null);

    socket.on("typing", (data) =>
      socket.broadcast.emit("typingResponse", data)
    );

    socket.on("sendMessage", ({ message }) => {
      socketIO.to(user?.room).emit("message", {
        user: user?.name,
        text: message,
      });
      socket.broadcast.emit("typingResponse", null);
    });

    socket.on("getRoomConnections", () => {
      socketIO.to(user?.room).emit("roomData", {
        room: user?.room,
        users: usersArr,
      });
    });
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    socketIO.to(user?.room).emit("message", {
      user: "Bot",
      text: `${user?.name} just left the room`,
    });
    socketIO.to(user?.room).emit("roomData", {
      room: user?.room,
      users: usersArr,
    });
    console.log("A disconnection has been made");
  });
});

socketIO.of("/seller").on("connection", (socket) => {
  socket.on("joinAvailableSellers", ({ nameSeller }, callBack) => {
    const { error } = addAvailableSeller({
      id: socket.id,
      nameSeller,
    });
    if (error) return callBack(error);
  });
  socket.on("getAvailableSellers", () => {
    socketIO.of("/seller").emit("availableSellers", {
      availableSellers,
    });
  });
  socket.on("disconnect", () => {
    removeAvailableSeller(socket.id);
    console.log("A seller disconnection has been made");
  });
});

app.get("/api/notif-stream", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/event-stream");

  eventEmitter.on("notif", (data) => {
    res.write("data: " + JSON.stringify(data) + " \n\n");
  });
});

app.post("/api/send-notif", (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  eventEmitter.emit("notif", { message });
  res.json({ message: "Notification sent!" });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

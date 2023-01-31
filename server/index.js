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

const { addUser, removeUser, usersArr } = require("./user");

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
  // private message
  socket.on("privateMessage", ({ message, to }) => {
    socketIO.to(to).emit("privateMessage", {
      user: socket.id,
      text: message,
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

// Private chat server

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  const isSeller = socket.handshake.auth.isSeller;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.isSeller = isSeller;
  next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
      isSeller: socket.isSeller,
    });
  }
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

const PORT_PRIVATE_CHAT = 4001;

httpServer.listen(PORT_PRIVATE_CHAT, () =>
  console.log(`server listening at http://localhost:${PORT_PRIVATE_CHAT}`)
);

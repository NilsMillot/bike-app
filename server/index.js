const express = require("express")
const app = express()
const cors = require("cors")
const http = require('http').Server(app);
const PORT = 4000
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});
const {EventEmitter} = require('events');

const eventEmitter = new EventEmitter();

app.use(express.json())
app.use(cors())
let users = []

socketIO.use(function(socket, next){
  // if (socket.handshake.query.userName){
    // if we finally use jwt, we can use this code
    // jwt.verify(socket.handshake.query.token, 'SECRET_KEY', function(err, decoded) {
      // if (err) return next(new Error('Authentication error'));
      // socket.decoded = decoded;
      next();
    // });
  // }
  // else {
    // next(new Error('Authentication error'));
  // }   
})
socketIO.on('connection', (socket) => { 
    // Connection now authenticated to receive further events
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      socketIO.emit("messageResponse", data)
    })

    socket.on("calcul", data => {
      const result = parseInt(data.num1) + parseInt(data.num2)
      socketIO.emit("calculResponse", {result, number1: data.num1, number2: data.num2})
    })

    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
      users.push(data)
      socketIO.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      socketIO.emit("newUserResponse", users)
      socket.disconnect()
    });
});

app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});

app.get("/api/notif-stream", (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/event-stream');

  eventEmitter.on("notif", (data) => {
    res.write('data: ' + JSON.stringify(data) + ' \n\n');
  })
})

app.post("/api/send-notif", (req, res) => {
  console.log(req.body);
  const message = req.body.message;
  eventEmitter.emit("notif", {message});
  res.json({message: "Notification sent!"})
})


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
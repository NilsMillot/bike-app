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

   
http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
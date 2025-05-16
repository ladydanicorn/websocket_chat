const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
    
  });

  socket.on('sendMessage', ({ room, username, message }) => {
    const timestamp = new Date().toLocaleString();
    io.to(room).emit('receiveMessage', { username, message, timestamp });
  });

  socket.on('editMessage', ({ room, messageIdx, newMessage }) => {
    io.to(room).emit('messageEdited', { messageIdx, newMessage });
  });

  socket.on('deleteMessage', ({ room, messageIdx }) => {
    io.to(room).emit('messageDeleted', { messageIdx });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('WebSocket server is running on port 3001');
});

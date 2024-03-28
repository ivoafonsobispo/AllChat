const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const axios = require('axios'); // for making HTTP requests
const cors = require('cors'); // Import the CORS middleware

// Enable CORS for all routes
app.use(cors());

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(8001, async () => {
  console.log('Express server listening on *:8001');

  // Once the server starts, connect to Next.js server
  try {
    const response = await axios.get('http://localhost:3000/chat');
    console.log('Connected to Next.js server:', response.data);
  } catch (error) {
    console.error('Error connecting to Next.js server:', error.message);
  }
});

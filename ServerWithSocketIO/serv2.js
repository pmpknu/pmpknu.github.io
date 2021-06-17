const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); const port = process.env.PORT || 3000;

let messages = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log(`"${socket.id}" connected`);
  io.emit('lmsg', JSON.stringify(messages));

  socket.on('smsg', (msg) => {
    messages.push(msg);
    io.emit('gmsg', JSON.stringify(msg));
    console.log(messages);
  });

  socket.on('disconnect', () => {
    console.log(`"${socket.id}" disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
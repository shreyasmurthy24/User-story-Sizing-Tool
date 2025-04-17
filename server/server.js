const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

server.listen(80, () => {
  console.log('HTTP server is running on port 80');
});

const wsServer = http.createServer(); 
const wss = new WebSocket.Server({ server: wsServer });

wsServer.listen(3000, () => {
  console.log('WebSocket server is running on ws://ec2-3-128-172-225.us-east-2.compute.amazonaws.com:3000');
});

const rooms = {};

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  const params = new URLSearchParams(req.url.split('?')[1]);
  const pin = params.get('pin');
  console.log(`Client connected to room with PIN: ${pin}`);

  ws.on('message', (message) => {
    console.log(`Message received: ${message}`);
    const data = JSON.parse(message);

    if (data.type === 'JOIN_ROOM') {
      if (!rooms[pin]) {
        rooms[pin] = [];
      }
      rooms[pin].push({ userName: data.userName, ws });
      console.log(`User ${data.userName} joined room ${pin}`);
      broadcast(pin, { type: 'USER_JOINED', users: rooms[pin].map(user => ({ userName: user.userName })) });
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected from room ${pin}`);
    if (rooms[pin]) {
      rooms[pin] = rooms[pin].filter(user => user.ws !== ws);
      broadcast(pin, { type: 'USER_LEFT', users: rooms[pin].map(user => ({ userName: user.userName })) });
    }
  });

  function broadcast(pin, message) {
    if (rooms[pin]) {
      rooms[pin].forEach(user => {
        user.ws.send(JSON.stringify(message));
      });
    }
  }
});

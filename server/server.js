const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');

const app = express();

const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/sizing-tool-test.amrock-shared-np.foc.zone/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/sizing-tool-test.amrock-shared-np.foc.zone/fullchain.pem'),
};

const server = https.createServer(sslOptions, app);
const wss = new WebSocket.Server({ server }); 

// Serve static files from the dist directory (one level up from server folder)
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

server.listen(443, '0.0.0.0', () => {
  console.log('WebSocket server is running on wss://sizing-tool-test.amrock-shared-np.foc.zone');
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

    if (data.type === 'NUMBER_CLICKED') {
      console.log(`Number clicked by ${data.userName}: ${data.number}`);
      broadcast(pin, { type: 'NUMBER_CLICKED', userName: data.userName, number: data.number });
    }

    if (data.type === 'REVEAL') {
      console.log(`Reveal action triggered for PIN: ${pin}`);
      broadcast(pin, { type: 'REVEAL', clickedNumbers: data.clickedNumbers });
    }

    if (data.type === 'RESET') {
      console.log(`Reset action triggered for PIN: ${pin}`);
      broadcast(pin, { type: 'RESET' });
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

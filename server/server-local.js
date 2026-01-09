const http = require('http');
const WebSocket = require('ws');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const PORT = 8080;

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

server.listen(PORT, () => {
  console.log(`Local WebSocket server is running on ws://localhost:${PORT}`);
});

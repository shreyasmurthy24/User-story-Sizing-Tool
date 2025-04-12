const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000, host: 'localhost' });
//const wss = new WebSocket.Server({ port: 3000, host: '0.0.0.0' });

const rooms = {};
// Log message updated to reflect localhost and port 4200
console.log('WebSocket server is running on ws://localhost:3000');
//console.log('WebSocket server is running on ws://0.0.0.0:3000');

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

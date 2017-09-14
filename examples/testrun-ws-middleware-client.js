const WebSocket = require('ws');


const ws = new WebSocket('ws://localhost:3000/json-rpc');

ws.on('open', function open() {
  console.log('connected');
  sendTest();
});

ws.on('message', function incoming(data) {
  console.log(data);
});

ws.on('close', function close() {
  console.log('disconnected');
});

setInterval(sendTest, 3000);

function sendTest() {
  ws.send(JSON.stringify({
    method: 'hello',
    params: ['a'],
    id: 1,
  }));
}

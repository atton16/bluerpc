const JSONRPC = require('../index');
const jsonRpcWsServer = new JSONRPC.Server.WS({ middlewareOnly: true });

jsonRpcWsServer.register('hello', function(){
  console.log('hello');
  return 'hello';
});

const express = require('express');
const app = express();

/**
 * HTTP requests
 */
app.use('/json-rpc', jsonRpcWsServer.middleware());
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/**
 * Using express's internal HTTP server
 */
const expressWs = require('express-ws')(app);
const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

server.on('connection', function(socket){
  console.log('HTTP client connected');
  socket.on('close', function(){
    console.log('HTTP client disconnected');
  });
});

/**
 * Using custom HTTP server
 */
// const http = require('http');
// const server = http.createServer(app);
// const expressWs = require('express-ws')(app, server);
// server.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });
// server.on('connection', function(socket){
//   console.log('HTTP client connected');
//   socket.on('close', function(){
//     console.log('HTTP client disconnected');
//   });
// });


/**
 * WebSocket
 */

app.ws('/json-rpc', jsonRpcWsServer.middleware());

expressWs.getWss().on('connection', function(socket){
  console.log('WS client connected');
  socket.on('close', function(){
    console.log('WS client disconnected');
  });
});

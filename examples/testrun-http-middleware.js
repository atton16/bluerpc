const JSONRPC = require('../index');
const jsonRpcHttpServer = new JSONRPC.Server.HTTP({ middlewareOnly: true });

jsonRpcHttpServer.register('hello', function(){
  console.log('hello');
  return 'hello';
});

const express = require('express');
const app = express();

app.use('/json-rpc', jsonRpcHttpServer.middleware());
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/**
 * Using express's internal HTTP server
 */
const server = app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

server.on('connection', function(socket){
  console.log('client connected');
  socket.on('close', function(){
    console.log('client disconnected');
  });
});

/**
 * Using custom HTTP server
 */
// const http = require('http');
// const server = http.createServer(app);
// server.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });
// server.on('connection', function(socket){
//   console.log('client connected');
//   socket.on('close', function(){
//     console.log('client disconnected');
//   });
// });

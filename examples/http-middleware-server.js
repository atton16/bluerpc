/**
 * 
 * BlueRPC HTTP Middleware Server example
 * Created by Attawit Kittikrairit
 * Dependencies: bluerpc, express, http
 *
 * Create express app which 
 * handle JSON-RPC calls over HTTP with the following methods
 * echo, setName, getName, helloWorld, nop
 * at path /json-rpc
 * It also serves hello world on GET /
 *
 * THE EXPRESS APP USE BUILT-IN HTTP SERVER
 * 
 */

const BlueRPC = require('bluerpc');
const BlueHTTPServer = BlueRPC.Server.HTTP;
const express = require('express');

/**
 * Initialize BlueRPC middleware server
 */
const blueServer = new BlueHTTPServer({ middlewareOnly: true });

/**
 * Register remote method with
 * name: echo
 * params[0]: echo data
 * return: params[0]
 */
blueServer.register('echo', function(params){
  console.log('echo(' + params[0] + '): ' + params[0]);
  return params[0];
});

/**
 * Register remote method with
 * name: setName
 * params[0]: name
 */
let name = undefined;
blueServer.register('setName', function(params){
  console.log('setName(' + params[0] + ')');
  name = params[0];
});

/**
 * Register remote method with
 * name: getName
 * return: name set by setName method
 */
blueServer.register('getName', function(params){
  console.log('getName(): ' + name);
  return name;
});

/**
 * Register remote method with
 * name: helloWorld
 * return: 'Hello World'
 */
blueServer.register('helloWorld', function(params){
  console.log('helloWorld(): \'Hello World\'');
  return 'Hello World';
});

/**
 * Register remote method with
 * name: nop
 */
blueServer.register('nop', function(params){
  console.log('nop()');
});

/**
 * Initialize Express application
 */
const app = express();

/**
 * Use BlueRPC Middleware on path /json-rpc
 */
app.use('/json-rpc', blueServer.middleware());

/**
 * Root path serves Hello World! text
 */
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/**
 * Using express's internal HTTP server
 */
const server = app.listen(3000, function () {
  console.log('listening on port 3000');
});

/**
 * Print out HTTP server connection status
 */
server.on('connection', function(socket){
  console.log('client connected');
  socket.on('close', function(){
    console.log('client disconnected');
  });
});

/**
 * 
 * BlueRPC HTTP Middleware Server example
 * Created by Attawit Kittikrairit
 * Dependencies: bluerpc, express, http, express-ws
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
const BlueWSServer = BlueRPC.Server.WS;
const express = require('express');

/**
 * Initialize BlueRPC middleware server
 */
const mw = new BlueWSServer({ middlewareOnly: true });

/**
 * Register remote method with
 * name: echo
 * params[0]: echo data
 * return: params[0]
 */
mw.register('echo', function(params){
  console.log('echo(' + params[0] + '): ' + params[0]);
  return params[0];
});

/**
 * Register remote method with
 * name: setName
 * params[0]: name
 */
let name = undefined;
mw.register('setName', function(params){
  console.log('setName(' + params[0] + ')');
  name = params[0];
  return;
});

/**
 * Register remote method with
 * name: getName
 * return: name set by setName method
 */
mw.register('getName', function(params){
  console.log('getName(): ' + name);
  return name;
});

/**
 * Register remote method with
 * name: helloWorld
 * return: 'Hello World'
 */
mw.register('helloWorld', function(params){
  console.log('helloWorld(): \'Hello World\'');
  return 'Hello World';
});

/**
 * Register remote method with
 * name: nop
 */
mw.register('nop', function(params){
  console.log('nop()');
  return;
});

/**
 * Initialize Express application
 * Also ass support for WebSocket
 */
const app = express();
const expressWs = require('express-ws')(app);

/**
 * Root path serves Hello World! text
 */
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/**
 * Use BlueRPC Middleware on path /json-rpc (WebSocket Only)
 */
app.ws('/json-rpc', mw.middleware());

/**
 * Use BlueRPC Middleware on path /json-rpc (HTTP Only)
 * For backward compatibility to HTTP Client
 */
app.use('/json-rpc', mw.middleware());

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
/**
 * Print out WS server connection status
 */
expressWs.getWss().on('connection', function(socket){
  console.log('WS client connected');
  socket.on('close', function(){
    console.log('WS client disconnected');
  });
});

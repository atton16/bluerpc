/**
 * 
 * BlueRPC WS Server example
 * Created by Attawit Kittikrairit
 * Dependencies: bluerpc
 *
 * Create JSON-RPC WS Server
 * and handle JSON-RPC over WS with the following methods:
 * echo, setName, getName, helloWorld, nop
 * 
 */

const BlueRPC = require('bluerpc');
const BlueWSServer = BlueRPC.Server.WS;

/**
 * Initialize BlueRPC server
 */
const server = new BlueWSServer();

/**
 * Register remote method with
 * name: echo
 * params[0]: echo data
 * return: params[0]
 */
server.register('echo', function(params){
  console.log('echo(' + params[0] + '): ' + params[0]);
  return params[0];
});

/**
 * Register remote method with
 * name: setName
 * params[0]: name
 */
let name = undefined;
server.register('setName', function(params){
  console.log('setName(' + params[0] + ')');
  name = params[0];
  return;
});

/**
 * Register remote method with
 * name: getName
 * return: name set by setName method
 */
server.register('getName', function(params){
  console.log('getName(): ' + name);
  return name;
});

/**
 * Register remote method with
 * name: helloWorld
 * return: 'Hello World'
 */
server.register('helloWorld', function(params){
  console.log('helloWorld(): \'Hello World\'');
  return 'Hello World';
});

/**
 * Register remote method with
 * name: nop
 */
server.register('nop', function(params){
  console.log('nop()');
  return;
});

/**
 * Print out connection status to console
 */
server.on('connect', function(){
  console.log('client connected');
});
server.on('close', function(){
  console.log('client disconnected');
});

/**
 * Start listening
 */
server.listen({
  host: '0.0.0.0',
  port: '8889',
}, () => {
  console.log('listening on 0.0.0.0:8889');
});

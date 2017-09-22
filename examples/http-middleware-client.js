/**
 * 
 * BlueRPC HTTP Middleware Client example
 * Created by Attawit Kittikrairit
 * Dependencies: bluerpc
 * 
 * 1. RPC call example
 * - Perform echo requests every 1s and print out the result from remote server
 * 2. RPC notification example
 * - Perform setName notification and getName request in sequence
 * 3. RPC batch call example
 * - Perform hello world request and nop notification with batch call
 * 
 */

const BlueRPC = require('bluerpc');
const BlueHTTPClient = BlueRPC.Client.HTTP;

/**
 * Initialize BlueRPC HTTP client
 */
const client = new BlueHTTPClient({
  host: '127.0.0.1', // BlueRPC server IP address
  port: '3000',      // BlueRPC server listening port
  path: '/json-rpc', // BlueRPC server path
});

/**
 * 
 * 1. RPC call exmaple
 * - Perform echo requests every 1s and print out the result from remote server
 * 
 * Perform RPC call every second.
 * Print out the return value from RPC server.
 */
const int = 1000; // Interval
let count = 0;    // Count
setInterval(function () {
  const c = ++count;
  client.request('echo', [c], function(err, result){
    if(err) console.log('echo('+ c +'): ' + err);
    if(result) console.log('echo('+ c +'): ' + result);
  });
}, int);

/**
 *
 * 2. RPC notification example
 * - Perform setName notification and getName request in sequence
 * 
 */
const name = 'Attawit';
client.notify('setName', [name]);
console.log('setName(' + name + ')');
setTimeout(function(){
  client.request('getName', [], function(err, result){
    if(err) console.log('setName(): ' + err);
    if(result) console.log('getName(): ' + result);
  });
}, 300);

/**
 *
 * 3. RPC batch call example
 * - Perform hello world request and nop notification with batch call
 * 
 */
const req = client.makeRequest('helloWorld', [], function(err, result){
  if(err) console.log('helloWorld(): ' + err);
  if(result) console.log('helloworld(): \'' + result + '\'');
});
const not = client.makeNotify('nop', []);
setTimeout(function(){
  client.batch([req, not]);
  console.log('batch: [helloWorld, nop]');
  console.log('nop()');
}, 600);

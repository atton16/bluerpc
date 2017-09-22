/**
 * 
 * BlueRPC WS Client example
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
const BlueWSClient = BlueRPC.Client.WS;

/**
 * Initialize BlueRPC WS client
 */
const client = new BlueWSClient({
  host: '127.0.0.1', // BlueRPC server IP address
  port: '8889',      // BlueRPC server listening port
});

/**
 * WS client also has the capability to handle connection events
 * We will start sending request once the client is connected
 */
client.on('connect', function(){
  console.log('connected');
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
  client.batch([req, not]);
  console.log('batch: [helloWorld, nop]');
  console.log('nop()');
});

client.on('close', function(){
  console.log('disconnected');
});

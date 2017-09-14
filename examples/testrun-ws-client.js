const BlueClient = require('../index').Client.WS;

const client = new BlueClient({
  host: '127.0.0.1',
  port: '8889',
});

client.on('connect', function(){
  console.log('connected');
  let count = 0;
  function send() {
    client.request('echo', [++count], function(err, result){
      if(err) console.log(err);
      if(result) console.log(result);
    });

  }


  send();
  setInterval(()=>{
    send();
  }, 1000);
});

client.on('close', function(){
  console.log('disconnected');
});

// setInterval(function(){
//   console.log('RPC Call');
//   client.request('hello', ['a'], function(err, result){
//     if(err) console.log(err);
//     if(result) console.log(result);
//   });
//   console.log('RPC Notify');
//   client.notify('hello', ['a']);
// }, 10000);

// setInterval(function(){
//   let requests = [];
//   requests.push(client.makeRequest('hello', ['a'], function(err, result){
//     if(err) console.log(err);
//     if(result) console.log(result);
//   }));
//   // requests.push(client.makeNotify('hello', ['a']));
//   console.log('RPC Batch: (Call: 1, Notify: 0)');
//   client.batch(requests);
// }, 10000);
// 

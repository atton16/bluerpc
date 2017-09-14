const JSONRPC = require('../index');
const JSONRPCWSServer = JSONRPC.Server.WS;


const server = new JSONRPCWSServer({
  // keepAlive: false,
  // keepAliveTimeout: 1000,
});
server.register('hello', function(params){
  console.log('hello');
  return 'hello';
});
server.register('echo', function(params){
  console.log(params[0]);
  return params[0];
});
server.on('connect', function(){
  console.log('client connected');
});
server.on('close', function(){
  console.log('client disconnected');
});
server.listen({
  host: '0.0.0.0',
  port: '8889',
}, () => {
  console.log('listening on 0.0.0.0:8889');
});

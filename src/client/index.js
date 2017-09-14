module.exports = {
  tcp: require('./jsonrpc-tcp-client'),
  http: require('./jsonrpc-http-client'),
  ws: require('./jsonrpc-ws-client'),
};

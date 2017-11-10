'use strict';

module.exports = {
  tcp: require('./jsonrpc-tcp-server'),
  http: require('./jsonrpc-http-server'),
  ws: require('./jsonrpc-ws-server')
};
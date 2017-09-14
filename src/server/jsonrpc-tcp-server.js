const net = require('net');
const JSONRPCServer = require('./jsonrpc-server');

class JSONRPCTCPServer extends JSONRPCServer {
  constructor(options) {
    super(options);
    this._server = net.createServer(((socket) => {
      socket.setEncoding('utf8');
      this._handleOnConnect(socket);
      socket.on('end', (() => this._handleOnEnd(socket)).bind(this));
      socket.on('data', ((data) => this._handleOnData(socket, data)).bind(this));
    }).bind(this));
  }

  listen(options, callback) {
    super.listen(options, callback);
    this._server.listen(this._listenOptions, callback);
  }

  _write(handler, dataStr) {
    handler.write(dataStr);
    if(this._options.keepAlive === false)
      handler.end();
  }


}

module.exports = JSONRPCTCPServer;

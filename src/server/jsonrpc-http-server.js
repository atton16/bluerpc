const http = require('http');
const JSONRPCServer = require('./jsonrpc-server');

class JSONRPCHTTPServer extends JSONRPCServer {
  constructor(options) {
    super(options);

    if(this._options.middlewareOnly)
      return;
    
    this._server = http.createServer((this.middleware()).bind(this));
    this._server.on('connection', ((socket) => {
      this._handleOnConnect(socket);
      socket.on('close', (() => {
        this._handleOnEnd(socket);
      }).bind(this));
    }).bind(this));
    this._server.timeout = this._options.timeout;
  }

  middleware() {
    return (function(req, res, next) {
      // WebSocket support: skip websocket request
      if(req.headers &&
         req.headers.upgrade &&
         req.headers.upgrade === 'websocket')
        return next();
      
      const handler = {req: req, res: res};
      let body;
      req.on('data', (data => body = data).bind(this));
      req.on('end', (() => this._handleOnData(handler, body)).bind(this));
    }).bind(this);
  }

  listen(options, callback) {
    super.listen(options, callback);
    this._server.listen(this._listenOptions, callback);
  }

  _write(handler, dataStr) {
    handler.res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    handler.res.end(dataStr);
  }


}

module.exports = JSONRPCHTTPServer;

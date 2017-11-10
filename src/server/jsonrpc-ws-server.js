const WebSocket = require('ws');
const isObject = require('isobject');
const JSONRPCHTTPServer = require('./jsonrpc-http-server');

/**
 * JSON-RPC v2 Websocket Server with HTTP backward compatibility
 */
class JSONRPCWSServer extends JSONRPCHTTPServer {
  constructor(options) {
    super(options);

    if(this._options.middlewareOnly)
      return;

    const server = this._server;
    this._wss = new WebSocket.Server({ server });
    this._wss.on('connection', ((ws, req) => {
      const handler = { ws: ws, req: req };
      ws.on('message', ((message) => this._handleOnData(handler, message)).bind(this));
    }).bind(this));
  }

  _write(handler, dataStr) {
    // Websocket
    if(isObject(handler) && Object.keys(handler).includes('ws')){
      return handler.ws.send(dataStr);
    }
    // Fallback to HTTP
    super._write(handler, dataStr);
  }

  middleware() {
    const superMw = super.middleware();
    return (function(arg1, arg2, next) {
      // Websocket
      if(arg1.upgradeReq &&
         arg1.upgradeReq.headers &&
         arg1.upgradeReq.headers.upgrade &&
         arg1.upgradeReq.headers.upgrade === 'websocket'){
        const handler = { ws: arg1, req: arg2 };
        arg1.on('message', ((message) => this._handleOnData(handler, message)).bind(this));
        return;
      }

      // Fallback to HTTP (arg1: req, arg2: res)
      superMw(arg1, arg2, next);
    }).bind(this);
  }
  
  close(callback) {
    super.close(callback);
    this._server.close(callback);
  }

}

module.exports = JSONRPCWSServer;

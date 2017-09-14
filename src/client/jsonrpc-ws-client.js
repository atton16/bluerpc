const WebSocket = require('ws');
const JSONRPCClient = require('./jsonrpc-client');

class JSONRPCWSClient extends JSONRPCClient {
  constructor(options) {
    super(options);
    const ws = new WebSocket(`ws://${this._options.host}:${this._options.port}${this._options.path}`);
    ws.on('open', (() => this._handleOnConnect(ws)).bind(this));
    ws.on('message', ((data) => this._handleOnData(ws, data)).bind(this));
    ws.on('close', (() => this._handleOnEnd(ws)).bind(this));
    this._client = ws;
  }

  _write(data) {
    this._client.send(data);
  }
}

module.exports = JSONRPCWSClient;

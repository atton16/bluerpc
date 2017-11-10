const net = require('net');
const JSONRPCClient = require('./jsonrpc-client');

class JSONRPCTCPClient extends JSONRPCClient {
  constructor(options) {
    super(options);
    const client = net.createConnection({
      host: this._options.host,
      port: this._options.port,
    }, () => {
      client.setEncoding('utf8');
      this._handleOnConnect(client);
      client.on('data', ((data) => this._handleOnData(client, data)).bind(this));
      client.on('end', (() => this._handleOnEnd(client)).bind(this));
    });
    this._client = client;
  }

  destroy() {
    super.destroy();
    this._client.end();
  }

  _write(data) {
    this._client.write(data);
  }
}

module.exports = JSONRPCTCPClient;

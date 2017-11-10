const http = require('http');
const JSONRPCClient = require('./jsonrpc-client');
const deepAssign = require('deep-assign');

class JSONRPCHTTPClient extends JSONRPCClient {
  constructor(options) {
    super(options);
    this._reqOptions = {
      hostname: this._options.host,
      port: this._options.port,
      path: this._options.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      agent: new http.Agent({
        // This should be the default settings
        keepAlive: true,    // Use http keep-alive header
        keepAliveMsecs: -1, // -1: Disable keep-alive packets
      }),
    };
  }
  
  destroy() {
    super.destroy();
    this._reqOptions.agent.destroy();
  }

  _write(data) {
    const options = deepAssign({}, this._reqOptions);
    options.headers['Content-Length'] = Buffer.byteLength(data);

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk );
      res.on('end', (() => this._handleOnData(this._agent, rawData)).bind(this));
    });

    // req.on('connect', ((res, socket, head) => {
    //   this._handleOnConnect(socket);
    //   socket.on('end', (() => {
    //     this._handleOnEnd(socket);
    //   }).bind(this));
    // }).bind(this));

    req.write(data);
    req.end();
  }
}

module.exports = JSONRPCHTTPClient;

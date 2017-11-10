class JSONRPCFactory {
  constructor() {
    this._v1 = new (require('./jsonrpc-v1'))();
    this._v2 = new (require('./jsonrpc-v2'))();
  }
  v1() { return this._v1; }
  v2() { return this._v2; }
}

module.exports = new JSONRPCFactory();

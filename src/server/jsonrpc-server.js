const prettyFormat = require('pretty-format');
const isObject = require('isobject');
const JSONRPCFactory = require('../lib');

class JSONRPCServer {
  constructor(options) {
    const optionsIsObj = isObject(options);
    this._options = {
      keepAlive: (optionsIsObj && options.keepAlive === false) ? false : true,
      timeout: (optionsIsObj && options.timeout >= 0) ? options.timeout : 0,
      middlewareOnly: (optionsIsObj && options.middlewareOnly === true) ? true : false,
    };
    this._jsonRPC = JSONRPCFactory.v2();
    this._methods = {};
    this._listenOptions = undefined;
    this._OnConnection = undefined;
    this._OnClose = undefined;
  }

  /**
   * Start the server
   * @param  {object}   options   Listening options object containing port and host.
   *                                default: {port: '8889', host: '0.0.0.0'}
   * @param  {Function} callback  Callback function when server is binded.
   */
  listen(options, callback) {
    if(this._options.middlewareOnly)
      throw new Error('This method is prohibited when using middlewareOnly option.');

    if (options && !isObject(options))
      throw new Error('options must be an object.');
    if (callback && typeof callback !== 'function')
      throw new Error('callback is not a function.');
    const _options = {};
    if (!options) options = {};
    _options.port = options.port ? options.port : '8889';
    _options.host = options.host ? options.host : '0.0.0.0';
    this._listenOptions = _options;
    return {options: _options, callback: callback};
  }
  
  /**
   * Stop the server
   * @param  {Function} callback  Callback function when server is binded.
   */
  close(callback) {
    if(this._options.middlewareOnly)
      throw new Error('This method is prohibited when using middlewareOnly option.');

  }

  /**
   * Return Connect/Express middleware
   * @return {Function} UNIMPLEMENTED middleware
   */
  middleware() {
    return (function(req, res) {
      throw new Error('UNIMPLEMENTED middleware');
    }).bind(this);
  }

  /**
   * Register connection event handlers
   * @param  {String}   name      Event name. Possible values: 'connect', 'close'
   * @param  {Function} callback  Event handler to be called when event emitted.
   */
  on(name, callback) {
    name = (typeof name !== 'string') ? prettyFormat(name) : name;
    if (typeof callback !== 'function')
      throw new Error('callback is not a function.');

    switch(name) {
    case 'connect':
      this._OnConnection = callback;
      break;

    case 'close':
      this._OnClose = callback;
      break;

    default:
      break;
    }
    return {name: name, callback: callback};
  }

  /**
   * Connection event handlers
   */
  _handleOnConnect(handler) {
    if(this._OnConnection !== undefined)
      return this._OnConnection(handler);
  }
  _handleOnEnd(handler) {
    if(this._OnClose !== undefined)
      return this._OnClose(handler);
  }
  _handleOnData(handler, data) {
    // Parse data
    try {
      data = JSON.parse(data);
    } catch(e) {
      return this._write(handler, this._jsonRPC.invalidJsonError());
    }

    // Check if it's a batch request
    if (Array.isArray(data)) {
      const retObjs = this._performBatch(data);
      if(retObjs.length > 0)
        return this._write(handler, JSON.stringify(retObjs));
    } else {
      const retObj = this._performReq(data);
      if (Object.keys(retObj).includes('response'))
        return this._write(handler, retObj.response);
    }

  }

  _performBatch(data) {
    const retObjs = [];
    for(let i = 0; i < data.length; i++) {
      const retObj = this._performReq(data[i]);
      if (Object.keys(retObj).includes('response'))
        retObjs.push(JSON.parse(retObj.response));
    }
    return retObjs;
  }

  _performReq(data) {
    if (!this._jsonRPC.isRequest(data))
      return { response: this._jsonRPC.invalidRequestError() };

    const req = data;

    // Check method existance
    if (!this._methodExist(req.method))
      return { response: this._jsonRPC.methodNotFoundError(req.id) };

    // Execute remote method
    let ret;
    try {
      ret = (this._methods[req.method])(req.params);
    } catch(e) {
      if(e.message === 'Invalid params')
        return { response: this._jsonRPC.invalidParamsError(req.id) };
      return { response: this._jsonRPC.methodExecutionError(e, req.id) };
    }

    if (!this._jsonRPC.isNotification(req))
      return { response: this._jsonRPC.response(ret, req.id) };
    return {};
  }

  _write(handler, dataStr) {
    // EMPTY IMPLEMENTATION
  }

  /**
   * Register JSON-RPC remote method
   * @param  {string}   name      Method name
   * @param  {Function} methodFn  Method function definition
   */
  register(name, methodFn) {
    name = (typeof name !== 'string') ? prettyFormat(name) : name;

    // Method with the given name already exist.
    if (Object.keys(this._methods).includes(name))
      throw new Error('Method with the given name already exist.');

    // methodFn is not a function.
    if (typeof methodFn !== 'function')
      throw new Error('methodFn is not a function.');

    this._methods[name] = methodFn;
  }

  /**
   * De-register JSON-RPC remote method
   * @param  {string} name  Method name
   */
  deRegister(name) {
    name = (typeof name !== 'string') ? prettyFormat(name) : name;
    if(this._methods[name] !== undefined) {
      this._methods[name] = undefined;
      delete this._methods[name];
    }
  }

  _methodExist(name) {
    name = (typeof name !== 'string') ? prettyFormat(name) : name;
    return this._methods[name] !== undefined;
  }
}

module.exports = JSONRPCServer;

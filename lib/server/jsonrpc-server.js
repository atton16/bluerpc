'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prettyFormat = require('pretty-format');
var isObject = require('isobject');
var JSONRPCFactory = require('../lib');

var JSONRPCServer = function () {
  function JSONRPCServer(options) {
    _classCallCheck(this, JSONRPCServer);

    var optionsIsObj = isObject(options);
    this._options = {
      keepAlive: optionsIsObj && options.keepAlive === false ? false : true,
      timeout: optionsIsObj && options.timeout >= 0 ? options.timeout : 0,
      middlewareOnly: optionsIsObj && options.middlewareOnly === true ? true : false
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


  _createClass(JSONRPCServer, [{
    key: 'listen',
    value: function listen(options, callback) {
      if (this._options.middlewareOnly) throw new Error('This method is prohibited when using middlewareOnly option.');

      if (options && !isObject(options)) throw new Error('options must be an object.');
      if (callback && typeof callback !== 'function') throw new Error('callback is not a function.');
      var _options = {};
      if (!options) options = {};
      _options.port = options.port ? options.port : '8889';
      _options.host = options.host ? options.host : '0.0.0.0';
      this._listenOptions = _options;
      return { options: _options, callback: callback };
    }

    /**
     * Stop the server
     * @param  {Function} callback  Callback function when server is binded.
     */

  }, {
    key: 'close',
    value: function close(callback) {
      if (this._options.middlewareOnly) throw new Error('This method is prohibited when using middlewareOnly option.');
    }

    /**
     * Return Connect/Express middleware
     * @return {Function} UNIMPLEMENTED middleware
     */

  }, {
    key: 'middleware',
    value: function middleware() {
      return function (req, res) {
        throw new Error('UNIMPLEMENTED middleware');
      }.bind(this);
    }

    /**
     * Register connection event handlers
     * @param  {String}   name      Event name. Possible values: 'connect', 'close'
     * @param  {Function} callback  Event handler to be called when event emitted.
     */

  }, {
    key: 'on',
    value: function on(name, callback) {
      name = typeof name !== 'string' ? prettyFormat(name) : name;
      if (typeof callback !== 'function') throw new Error('callback is not a function.');

      switch (name) {
        case 'connect':
          this._OnConnection = callback;
          break;

        case 'close':
          this._OnClose = callback;
          break;

        default:
          break;
      }
      return { name: name, callback: callback };
    }

    /**
     * Connection event handlers
     */

  }, {
    key: '_handleOnConnect',
    value: function _handleOnConnect(handler) {
      if (this._OnConnection !== undefined) return this._OnConnection(handler);
    }
  }, {
    key: '_handleOnEnd',
    value: function _handleOnEnd(handler) {
      if (this._OnClose !== undefined) return this._OnClose(handler);
    }
  }, {
    key: '_handleOnData',
    value: function _handleOnData(handler, data) {
      // Parse data
      try {
        data = JSON.parse(data);
      } catch (e) {
        return this._write(handler, this._jsonRPC.invalidJsonError());
      }

      // Check if it's a batch request
      if (Array.isArray(data)) {
        var retObjs = this._performBatch(data);
        if (retObjs.length > 0) return this._write(handler, JSON.stringify(retObjs));
      } else {
        var retObj = this._performReq(data);
        if (Object.keys(retObj).includes('response')) return this._write(handler, retObj.response);
      }
    }
  }, {
    key: '_performBatch',
    value: function _performBatch(data) {
      var retObjs = [];
      for (var i = 0; i < data.length; i++) {
        var retObj = this._performReq(data[i]);
        if (Object.keys(retObj).includes('response')) retObjs.push(JSON.parse(retObj.response));
      }
      return retObjs;
    }
  }, {
    key: '_performReq',
    value: function _performReq(data) {
      if (!this._jsonRPC.isRequest(data)) return { response: this._jsonRPC.invalidRequestError() };

      var req = data;

      // Check method existance
      if (!this._methodExist(req.method)) return { response: this._jsonRPC.methodNotFoundError(req.id) };

      // Execute remote method
      var ret = void 0;
      try {
        ret = this._methods[req.method](req.params);
      } catch (e) {
        if (e.message === 'Invalid params') return { response: this._jsonRPC.invalidParamsError(req.id) };
        return { response: this._jsonRPC.methodExecutionError(e, req.id) };
      }

      if (!this._jsonRPC.isNotification(req)) return { response: this._jsonRPC.response(ret, req.id) };
      return {};
    }
  }, {
    key: '_write',
    value: function _write(handler, dataStr) {}
    // EMPTY IMPLEMENTATION


    /**
     * Register JSON-RPC remote method
     * @param  {string}   name      Method name
     * @param  {Function} methodFn  Method function definition
     */

  }, {
    key: 'register',
    value: function register(name, methodFn) {
      name = typeof name !== 'string' ? prettyFormat(name) : name;

      // Method with the given name already exist.
      if (Object.keys(this._methods).includes(name)) throw new Error('Method with the given name already exist.');

      // methodFn is not a function.
      if (typeof methodFn !== 'function') throw new Error('methodFn is not a function.');

      this._methods[name] = methodFn;
    }

    /**
     * De-register JSON-RPC remote method
     * @param  {string} name  Method name
     */

  }, {
    key: 'deRegister',
    value: function deRegister(name) {
      name = typeof name !== 'string' ? prettyFormat(name) : name;
      if (this._methods[name] !== undefined) {
        this._methods[name] = undefined;
        delete this._methods[name];
      }
    }
  }, {
    key: '_methodExist',
    value: function _methodExist(name) {
      name = typeof name !== 'string' ? prettyFormat(name) : name;
      return this._methods[name] !== undefined;
    }
  }]);

  return JSONRPCServer;
}();

module.exports = JSONRPCServer;
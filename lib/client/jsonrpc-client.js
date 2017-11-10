'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prettyFormat = require('pretty-format');
var isObject = require('isobject');
var JSONRPCFactory = require('../lib');
var uuidv1 = require('uuid/v1');
var arrify = require('arrify');

var JSONRPCClient = function () {
  function JSONRPCClient(options) {
    _classCallCheck(this, JSONRPCClient);

    var optionsIsObj = isObject(options);
    this._options = {
      keepAlive: optionsIsObj && options.keepAlive === false ? false : true,
      host: optionsIsObj && options.host ? options.host : '127.0.0.1',
      port: optionsIsObj && options.port ? options.port : '8889',
      path: optionsIsObj && options.path ? options.path : '/'
    };
    this._jsonRPC = JSONRPCFactory.v2();
    this._client = undefined;
    this._requests = {}; // Object of {id: callback}
    this._OnConnection = undefined;
    this._OnClose = undefined;
    this._base = this;
  }

  _createClass(JSONRPCClient, [{
    key: 'destroy',
    value: function destroy() {}
  }, {
    key: 'request',
    value: function request(method, params, callback, id) {
      this._write(this._requestStr(method, params, callback, id));
    }
  }, {
    key: 'notify',
    value: function notify(method, params) {
      this._write(this._notifyStr(method, params));
    }
  }, {
    key: 'batch',
    value: function batch(wrappedRequests) {
      this._write(this._batchStr(wrappedRequests));
    }
  }, {
    key: 'makeRequest',
    value: function makeRequest(method, params, callback, id) {
      return { jsonStr: this._requestStr(method, params, callback, id, 'no_save'), callback: callback };
    }
  }, {
    key: 'makeNotify',
    value: function makeNotify(method, params) {
      return { jsonStr: this._notifyStr(method, params), callback: undefined };
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
  }, {
    key: '_requestStr',
    value: function _requestStr(method, params, callback, id, _save) {
      if (id === undefined) id = uuidv1();

      if (id === null) throw new Error('id must not be null');

      if (typeof callback !== 'function') throw new Error('Callback must be a function');

      if (Object.keys(this._requests).includes(id)) throw new Error('id must be unique while the request is waiting for callback');

      if (_save !== 'no_save' && typeof id !== 'string') id = prettyFormat(id);

      if (_save !== 'no_save') this._requests[id] = callback;

      return this._jsonRPC.request(method, params, id);
    }
  }, {
    key: '_notifyStr',
    value: function _notifyStr(method, params) {
      return this._jsonRPC.notify(method, params);
    }
  }, {
    key: '_batchStr',
    value: function _batchStr(wrappedRequests) {
      wrappedRequests = arrify(wrappedRequests);
      var len = wrappedRequests.length;
      var ret = [];
      for (var i = 0; i < len; i++) {
        var wrappedReq = wrappedRequests[i];
        var req = JSON.parse(wrappedReq.jsonStr);
        if (!this._jsonRPC.isRequest(req)) throw new Error('Invalid request object: ' + prettyFormat(req));

        if (req.id !== null) this._requests[req.id] = wrappedReq.callback;

        ret.push(req);
      }
      return JSON.stringify(ret);
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
      data = JSON.parse(data); // This will throw error if parse fails

      // Check if it's a batch response
      if (Array.isArray(data)) {
        var len = data.length;
        for (var i = 0; i < len; i++) {
          var res = data[i];
          if (res.id === null) continue;
          this._requests[res.id](res.error, res.result);
          this._requests[res.id] = undefined;
          delete this._requests[res.id];
        }
      } else {
        if (data.id === null) return;
        this._requests[data.id](data.error, data.result);
        this._requests[data.id] = undefined;
        delete this._requests[data.id];
      }
    }
  }]);

  return JSONRPCClient;
}();

module.exports = JSONRPCClient;
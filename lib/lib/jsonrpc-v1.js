'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var arrify = require('arrify');
var prettyFormat = require('pretty-format');
var isObject = require('isobject');

var JSONRPC_V1 = function () {
  function JSONRPC_V1() {
    _classCallCheck(this, JSONRPC_V1);
  }

  _createClass(JSONRPC_V1, [{
    key: 'request',
    value: function request(method, params, id, _raw) {
      method = typeof method !== 'string' ? prettyFormat(method) : method;
      var ret = { method: method, params: arrify(params), id: id };
      if (_raw === 'raw') return ret;else return JSON.stringify(ret);
    }
  }, {
    key: 'response',
    value: function response(result, id, _raw) {
      var ret = { result: result, error: null, id: id };
      if (_raw === 'raw') return ret;else return JSON.stringify(ret);
    }
  }, {
    key: 'error',
    value: function error(err, id, _raw) {
      var ret = { result: null, error: err, id: id };
      if (_raw === 'raw') return ret;else return JSON.stringify(ret);
    }
  }, {
    key: 'notify',
    value: function notify(method, params, _raw) {
      method = typeof method !== 'string' ? prettyFormat(method) : method;
      var ret = { method: method, params: arrify(params), id: null };
      if (_raw === 'raw') return ret;else return JSON.stringify(ret);
    }
  }, {
    key: 'isRequest',
    value: function isRequest(req) {
      if (!isObject(req)) return false;
      if (typeof req.method !== 'string') return false;
      if (!Array.isArray(req.params)) return false;
      if (req.id === undefined) return false;
      return true;
    }
  }, {
    key: 'isNotification',
    value: function isNotification(req) {
      if (!isObject(req)) return false;
      if (typeof req.method !== 'string') return false;
      if (!Array.isArray(req.params)) return false;
      if (req.id === undefined) return false;
      if (req.id === null) return true;
      return false;
    }
  }]);

  return JSONRPC_V1;
}();

module.exports = JSONRPC_V1;
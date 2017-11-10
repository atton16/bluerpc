'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var prettyFormat = require('pretty-format');
var JSONRPC_V1 = require('./jsonrpc-v1');

var JSONRPC_V2 = function (_JSONRPC_V) {
  _inherits(JSONRPC_V2, _JSONRPC_V);

  function JSONRPC_V2() {
    _classCallCheck(this, JSONRPC_V2);

    return _possibleConstructorReturn(this, (JSONRPC_V2.__proto__ || Object.getPrototypeOf(JSONRPC_V2)).apply(this, arguments));
  }

  _createClass(JSONRPC_V2, [{
    key: 'request',
    value: function request(method, params, id) {
      var ret = _get(JSONRPC_V2.prototype.__proto__ || Object.getPrototypeOf(JSONRPC_V2.prototype), 'request', this).call(this, method, params, id, 'raw');
      ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
      return JSON.stringify(ret);
    }
  }, {
    key: 'response',
    value: function response(result, id) {
      var ret = _get(JSONRPC_V2.prototype.__proto__ || Object.getPrototypeOf(JSONRPC_V2.prototype), 'response', this).call(this, result, id, 'raw');
      ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
      return JSON.stringify(ret);
    }

    // helper function

  }, {
    key: 'error',
    value: function error(code, message, meaning, id) {
      var ret = _get(JSONRPC_V2.prototype.__proto__ || Object.getPrototypeOf(JSONRPC_V2.prototype), 'error', this).call(this, { code: code, message: message, meaning: meaning }, id, 'raw');
      ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
      return JSON.stringify(ret);
    }
  }, {
    key: 'notify',
    value: function notify(method, params) {
      var ret = _get(JSONRPC_V2.prototype.__proto__ || Object.getPrototypeOf(JSONRPC_V2.prototype), 'notify', this).call(this, method, params, 'raw');
      ret['jsonrpc'] = '2.0'; // JSON-RPC 2.0 addition
      return JSON.stringify(ret);
    }
  }, {
    key: 'isRequest',
    value: function isRequest(req) {
      var compat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!_get(JSONRPC_V2.prototype.__proto__ || Object.getPrototypeOf(JSONRPC_V2.prototype), 'isRequest', this).call(this, req)) return false;
      if (compat === true) return true;
      if (req.jsonrpc !== '2.0') return false;
      return true;
    }

    // JSON-RPC 2.0 feature

  }, {
    key: 'batch',
    value: function batch(requests) {
      return requests;
    }
  }, {
    key: 'invalidJsonError',
    value: function invalidJsonError() {
      return this.error(-32700, 'Parse error', 'Invalid JSON was received by the server.\n' + 'An error occurred on the server while parsing the JSON text.', null);
    }
  }, {
    key: 'invalidRequestError',
    value: function invalidRequestError() {
      return this.error(-32600, 'Invalid Request', 'The JSON sent is not a valid Request object.', null);
    }
  }, {
    key: 'methodNotFoundError',
    value: function methodNotFoundError(id) {
      return this.error(-32601, 'Method not found', 'The method does not exist / is not available.', id);
    }
  }, {
    key: 'invalidParamsError',
    value: function invalidParamsError(id) {
      return this.error(-32602, 'Invalid params', 'Invalid method parameter(s).', id);
    }
  }, {
    key: 'internalError',
    value: function internalError(id) {
      return this.error(-32603, 'Internal error', 'Internal JSON-RPC error.', id);
    }

    /**
     * Implementation-defined server-errors.
     * @param  {number} code      Implementation-defined server-error code. Possible values: 0-100
     * @param  {string} meaning   Implementation-defined server-error meaning.
     * @return {JSONRPC Error} JSONRPC_V2 / JSONRPC_V1 error object.
     */

  }, {
    key: 'serverError',
    value: function serverError(code, meaning, id) {
      return this.error(-32000 - code, 'Server error', meaning, id);
    }
  }, {
    key: 'methodExecutionError',
    value: function methodExecutionError(err, id) {
      return this.serverError(0, prettyFormat(err), id);
    }
  }]);

  return JSONRPC_V2;
}(JSONRPC_V1);

module.exports = JSONRPC_V2;
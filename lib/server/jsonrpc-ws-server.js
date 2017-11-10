'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebSocket = require('ws');
var isObject = require('isobject');
var JSONRPCHTTPServer = require('./jsonrpc-http-server');

/**
 * JSON-RPC v2 Websocket Server with HTTP backward compatibility
 */

var JSONRPCWSServer = function (_JSONRPCHTTPServer) {
  _inherits(JSONRPCWSServer, _JSONRPCHTTPServer);

  function JSONRPCWSServer(options) {
    _classCallCheck(this, JSONRPCWSServer);

    var _this = _possibleConstructorReturn(this, (JSONRPCWSServer.__proto__ || Object.getPrototypeOf(JSONRPCWSServer)).call(this, options));

    if (_this._options.middlewareOnly) return _possibleConstructorReturn(_this);

    var server = _this._server;
    _this._wss = new WebSocket.Server({ server: server });
    _this._wss.on('connection', function (ws, req) {
      var handler = { ws: ws, req: req };
      ws.on('message', function (message) {
        return _this._handleOnData(handler, message);
      }.bind(_this));
    }.bind(_this));
    return _this;
  }

  _createClass(JSONRPCWSServer, [{
    key: '_write',
    value: function _write(handler, dataStr) {
      // Websocket
      if (isObject(handler) && Object.keys(handler).includes('ws')) {
        return handler.ws.send(dataStr);
      }
      // Fallback to HTTP
      _get(JSONRPCWSServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCWSServer.prototype), '_write', this).call(this, handler, dataStr);
    }
  }, {
    key: 'middleware',
    value: function middleware() {
      var superMw = _get(JSONRPCWSServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCWSServer.prototype), 'middleware', this).call(this);
      return function (arg1, arg2, next) {
        var _this2 = this;

        // Websocket
        if (arg1.upgradeReq && arg1.upgradeReq.headers && arg1.upgradeReq.headers.upgrade && arg1.upgradeReq.headers.upgrade === 'websocket') {
          var handler = { ws: arg1, req: arg2 };
          arg1.on('message', function (message) {
            return _this2._handleOnData(handler, message);
          }.bind(this));
          return;
        }

        // Fallback to HTTP (arg1: req, arg2: res)
        superMw(arg1, arg2, next);
      }.bind(this);
    }
  }, {
    key: 'close',
    value: function close(callback) {
      _get(JSONRPCWSServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCWSServer.prototype), 'close', this).call(this, callback);
      this._server.close(callback);
    }
  }]);

  return JSONRPCWSServer;
}(JSONRPCHTTPServer);

module.exports = JSONRPCWSServer;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require('http');
var JSONRPCServer = require('./jsonrpc-server');

var JSONRPCHTTPServer = function (_JSONRPCServer) {
  _inherits(JSONRPCHTTPServer, _JSONRPCServer);

  function JSONRPCHTTPServer(options) {
    _classCallCheck(this, JSONRPCHTTPServer);

    var _this = _possibleConstructorReturn(this, (JSONRPCHTTPServer.__proto__ || Object.getPrototypeOf(JSONRPCHTTPServer)).call(this, options));

    if (_this._options.middlewareOnly) return _possibleConstructorReturn(_this);

    _this._server = http.createServer(_this.middleware().bind(_this));
    _this._server.on('connection', function (socket) {
      _this._handleOnConnect(socket);
      socket.on('close', function () {
        _this._handleOnEnd(socket);
      }.bind(_this));
    }.bind(_this));
    _this._server.timeout = _this._options.timeout;
    return _this;
  }

  _createClass(JSONRPCHTTPServer, [{
    key: 'middleware',
    value: function middleware() {
      return function (req, res, next) {
        var _this2 = this;

        // WebSocket support: skip websocket request
        if (req.headers && req.headers.upgrade && req.headers.upgrade === 'websocket') return next();

        var handler = { req: req, res: res };
        var body = void 0;
        req.on('data', function (data) {
          return body = data;
        }.bind(this));
        req.on('end', function () {
          return _this2._handleOnData(handler, body);
        }.bind(this));
      }.bind(this);
    }
  }, {
    key: 'listen',
    value: function listen(options, callback) {
      _get(JSONRPCHTTPServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCHTTPServer.prototype), 'listen', this).call(this, options, callback);
      this._server.listen(this._listenOptions, callback);
    }
  }, {
    key: 'close',
    value: function close(callback) {
      _get(JSONRPCHTTPServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCHTTPServer.prototype), 'close', this).call(this, callback);
      this._server.close(callback);
    }
  }, {
    key: '_write',
    value: function _write(handler, dataStr) {
      handler.res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      handler.res.end(dataStr);
    }
  }]);

  return JSONRPCHTTPServer;
}(JSONRPCServer);

module.exports = JSONRPCHTTPServer;
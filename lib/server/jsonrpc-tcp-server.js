'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var net = require('net');
var JSONRPCServer = require('./jsonrpc-server');

var JSONRPCTCPServer = function (_JSONRPCServer) {
  _inherits(JSONRPCTCPServer, _JSONRPCServer);

  function JSONRPCTCPServer(options) {
    _classCallCheck(this, JSONRPCTCPServer);

    var _this = _possibleConstructorReturn(this, (JSONRPCTCPServer.__proto__ || Object.getPrototypeOf(JSONRPCTCPServer)).call(this, options));

    _this._server = net.createServer(function (socket) {
      socket.setEncoding('utf8');
      _this._handleOnConnect(socket);
      socket.on('end', function () {
        return _this._handleOnEnd(socket);
      }.bind(_this));
      socket.on('data', function (data) {
        return _this._handleOnData(socket, data);
      }.bind(_this));
    }.bind(_this));
    return _this;
  }

  _createClass(JSONRPCTCPServer, [{
    key: 'listen',
    value: function listen(options, callback) {
      _get(JSONRPCTCPServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCTCPServer.prototype), 'listen', this).call(this, options, callback);
      this._server.listen(this._listenOptions, callback);
    }
  }, {
    key: 'close',
    value: function close(callback) {
      _get(JSONRPCTCPServer.prototype.__proto__ || Object.getPrototypeOf(JSONRPCTCPServer.prototype), 'close', this).call(this, callback);
      this._server.close(callback);
    }
  }, {
    key: '_write',
    value: function _write(handler, dataStr) {
      handler.write(dataStr);
      if (this._options.keepAlive === false) handler.end();
    }
  }]);

  return JSONRPCTCPServer;
}(JSONRPCServer);

module.exports = JSONRPCTCPServer;
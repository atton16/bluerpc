'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WebSocket = require('ws');
var JSONRPCClient = require('./jsonrpc-client');

var JSONRPCWSClient = function (_JSONRPCClient) {
  _inherits(JSONRPCWSClient, _JSONRPCClient);

  function JSONRPCWSClient(options) {
    _classCallCheck(this, JSONRPCWSClient);

    var _this = _possibleConstructorReturn(this, (JSONRPCWSClient.__proto__ || Object.getPrototypeOf(JSONRPCWSClient)).call(this, options));

    var ws = new WebSocket('ws://' + _this._options.host + ':' + _this._options.port + _this._options.path);
    ws.on('open', function () {
      return _this._handleOnConnect(ws);
    }.bind(_this));
    ws.on('message', function (data) {
      return _this._handleOnData(ws, data);
    }.bind(_this));
    ws.on('close', function () {
      return _this._handleOnEnd(ws);
    }.bind(_this));
    _this._client = ws;
    return _this;
  }

  _createClass(JSONRPCWSClient, [{
    key: 'destroy',
    value: function destroy() {
      _get(JSONRPCWSClient.prototype.__proto__ || Object.getPrototypeOf(JSONRPCWSClient.prototype), 'destroy', this).call(this);
      this._client.close();
    }
  }, {
    key: '_write',
    value: function _write(data) {
      this._client.send(data);
    }
  }]);

  return JSONRPCWSClient;
}(JSONRPCClient);

module.exports = JSONRPCWSClient;
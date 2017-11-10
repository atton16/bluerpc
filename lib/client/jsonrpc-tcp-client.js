'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var net = require('net');
var JSONRPCClient = require('./jsonrpc-client');

var JSONRPCTCPClient = function (_JSONRPCClient) {
  _inherits(JSONRPCTCPClient, _JSONRPCClient);

  function JSONRPCTCPClient(options) {
    _classCallCheck(this, JSONRPCTCPClient);

    var _this = _possibleConstructorReturn(this, (JSONRPCTCPClient.__proto__ || Object.getPrototypeOf(JSONRPCTCPClient)).call(this, options));

    var client = net.createConnection({
      host: _this._options.host,
      port: _this._options.port
    }, function () {
      client.setEncoding('utf8');
      _this._handleOnConnect(client);
      client.on('data', function (data) {
        return _this._handleOnData(client, data);
      }.bind(_this));
      client.on('end', function () {
        return _this._handleOnEnd(client);
      }.bind(_this));
    });
    _this._client = client;
    return _this;
  }

  _createClass(JSONRPCTCPClient, [{
    key: 'destroy',
    value: function destroy() {
      _get(JSONRPCTCPClient.prototype.__proto__ || Object.getPrototypeOf(JSONRPCTCPClient.prototype), 'destroy', this).call(this);
      this._client.end();
    }
  }, {
    key: '_write',
    value: function _write(data) {
      this._client.write(data);
    }
  }]);

  return JSONRPCTCPClient;
}(JSONRPCClient);

module.exports = JSONRPCTCPClient;
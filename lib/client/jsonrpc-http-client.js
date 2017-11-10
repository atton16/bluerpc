'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var http = require('http');
var JSONRPCClient = require('./jsonrpc-client');
var deepAssign = require('deep-assign');

var JSONRPCHTTPClient = function (_JSONRPCClient) {
  _inherits(JSONRPCHTTPClient, _JSONRPCClient);

  function JSONRPCHTTPClient(options) {
    _classCallCheck(this, JSONRPCHTTPClient);

    var _this = _possibleConstructorReturn(this, (JSONRPCHTTPClient.__proto__ || Object.getPrototypeOf(JSONRPCHTTPClient)).call(this, options));

    _this._reqOptions = {
      hostname: _this._options.host,
      port: _this._options.port,
      path: _this._options.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      agent: new http.Agent({
        // This should be the default settings
        keepAlive: true, // Use http keep-alive header
        keepAliveMsecs: -1 // -1: Disable keep-alive packets
      })
    };
    return _this;
  }

  _createClass(JSONRPCHTTPClient, [{
    key: 'destroy',
    value: function destroy() {
      _get(JSONRPCHTTPClient.prototype.__proto__ || Object.getPrototypeOf(JSONRPCHTTPClient.prototype), 'destroy', this).call(this);
      this._reqOptions.agent.destroy();
    }
  }, {
    key: '_write',
    value: function _write(data) {
      var _this2 = this;

      var options = deepAssign({}, this._reqOptions);
      options.headers['Content-Length'] = Buffer.byteLength(data);

      var req = http.request(options, function (res) {
        var rawData = '';
        res.on('data', function (chunk) {
          return rawData += chunk;
        });
        res.on('end', function () {
          return _this2._handleOnData(_this2._agent, rawData);
        }.bind(_this2));
      });

      // req.on('connect', ((res, socket, head) => {
      //   this._handleOnConnect(socket);
      //   socket.on('end', (() => {
      //     this._handleOnEnd(socket);
      //   }).bind(this));
      // }).bind(this));

      req.write(data);
      req.end();
    }
  }]);

  return JSONRPCHTTPClient;
}(JSONRPCClient);

module.exports = JSONRPCHTTPClient;
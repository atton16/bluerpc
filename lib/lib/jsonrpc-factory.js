'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONRPCFactory = function () {
  function JSONRPCFactory() {
    _classCallCheck(this, JSONRPCFactory);

    this._v1 = new (require('./jsonrpc-v1'))();
    this._v2 = new (require('./jsonrpc-v2'))();
  }

  _createClass(JSONRPCFactory, [{
    key: 'v1',
    value: function v1() {
      return this._v1;
    }
  }, {
    key: 'v2',
    value: function v2() {
      return this._v2;
    }
  }]);

  return JSONRPCFactory;
}();

module.exports = new JSONRPCFactory();
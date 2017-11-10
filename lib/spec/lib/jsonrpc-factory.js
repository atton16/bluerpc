'use strict';

var JSONRPCFactory = require('../../lib');

var Names = {
  v1: 'JSONRPC_V1',
  v2: 'JSONRPC_V2'
};

describe('JSONRPCFactory (lib/jsonrpc-factory.js)', function () {
  it('v1 method should gives ' + Names.v1 + ' object', function () {
    expect(JSONRPCFactory.v1().constructor.name).toBe(Names.v1);
  });
  it(Names.v1 + ' should be singleton', function () {
    expect(JSONRPCFactory.v1()).toBe(JSONRPCFactory.v1());
  });
  it('v2 method should gives ' + Names.v2 + ' object', function () {
    expect(JSONRPCFactory.v2().constructor.name).toBe(Names.v2);
  });
  it(Names.v2 + ' should be singleton', function () {
    expect(JSONRPCFactory.v2()).toBe(JSONRPCFactory.v2());
  });
});
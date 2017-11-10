const JSONRPCFactory = require('../../lib');

const Names = {
  v1: 'JSONRPC_V1',
  v2: 'JSONRPC_V2',
};

describe('JSONRPCFactory (lib/jsonrpc-factory.js)', () => {
  it('v1 method should gives '+Names.v1+' object', () => {
    expect(JSONRPCFactory.v1().constructor.name).toBe(Names.v1);
  });
  it(Names.v1+' should be singleton', () => {
    expect(JSONRPCFactory.v1()).toBe(JSONRPCFactory.v1());
  });
  it('v2 method should gives '+Names.v2+' object', () => {
    expect(JSONRPCFactory.v2().constructor.name).toBe(Names.v2);
  });
  it(Names.v2+' should be singleton', () => {
    expect(JSONRPCFactory.v2()).toBe(JSONRPCFactory.v2());
  });

});

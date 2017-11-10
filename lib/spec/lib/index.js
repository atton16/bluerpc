'use strict';

var name = 'JSONRPCFactory';

describe('lib (lib/index.js)', function () {
  it('should export ' + name, function () {
    expect(require('../../lib/index').constructor.name).toBe(name);
  });
});
const name = 'JSONRPCFactory';

describe('lib (lib/index.js)', () => {
  it('should export '+name, () => {
    expect(require('../../lib/index').constructor.name).toBe(name);
  });
});

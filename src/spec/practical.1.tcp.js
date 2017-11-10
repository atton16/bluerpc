const BlueRPC = require('../../lib');

describe('TCP',
  require('./tests.skip.js')(
    BlueRPC.Server.TCP,
    BlueRPC.Client.TCP
  )
);

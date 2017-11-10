const BlueRPC = require('../../lib');

describe('WebSocket Middleware',
  require('./tests.skip.js')(
    BlueRPC.Server.WS,
    BlueRPC.Client.WS,
    'mw'
  )
);

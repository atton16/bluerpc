'use strict';

var BlueRPC = require('../../lib');

describe('WebSocket Middleware (Custom Server)', require('./tests.skip.js')(BlueRPC.Server.WS, BlueRPC.Client.WS, 'mw-custom'));
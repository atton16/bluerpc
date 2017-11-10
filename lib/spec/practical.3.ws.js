'use strict';

var BlueRPC = require('../../lib');

describe('WebSocket', require('./tests.skip.js')(BlueRPC.Server.WS, BlueRPC.Client.WS));
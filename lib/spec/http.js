'use strict';

var BlueRPC = require('../../lib');

describe('HTTP', require('./tests.skip.js')(BlueRPC.Server.HTTP, BlueRPC.Client.HTTP));
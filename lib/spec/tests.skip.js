'use strict';

var async = require('async');
var express = require('express');

module.exports = function (Server, Client, option) {
  return function () {
    var server = void 0,
        client = void 0,
        client2 = void 0,
        state = void 0,
        expressApp = void 0,
        expressWs = void 0,
        httpServer = void 0;

    function initServer(done) {
      state = {
        server: {
          clients: 0,
          store: []
        }
      };
      server = new Server();
      server.on('connect', function () {
        state.server.clients++;
      });
      server.on('close', function () {
        state.server.clients--;
      });
      server.register('echo', function (params) {
        return params[0];
      });
      server.register('save', function (params) {
        state.server.store.push(params[0]);
      });
      server.listen({}, function () {
        client = new Client();
        client2 = new Client();
        async.parallel([function (cb) {
          client.on('connect', function () {
            cb(null, null);
          });
        }, function (cb) {
          client2.on('connect', function () {
            cb(null, null);
          });
        }], function (err, results) {
          return done();
        });
      });
    }

    function initMw(done, option) {
      state = {
        server: {
          clients: 0,
          store: []
        }
      };
      server = new Server({ middlewareOnly: true });
      server.register('echo', function (params) {
        return params[0];
      });
      server.register('save', function (params) {
        state.server.store.push(params[0]);
      });

      expressApp = express();
      if (option === 'mw-custom') {
        var http = require('http');
        httpServer = http.createServer(expressApp);
        expressWs = require('express-ws')(expressApp, httpServer);
      } else {
        expressWs = require('express-ws')(expressApp);
      }

      expressApp.ws('/json-rpc', server.middleware());

      expressWs.getWss().on('connection', function (socket) {
        state.server.clients++;
        socket.on('close', function () {
          state.server.clients--;
        });
      });

      function listenCallback() {
        client = new Client({
          path: '/json-rpc'
        });
        client2 = new Client({
          path: '/json-rpc'
        });
        async.parallel([function (cb) {
          client.on('connect', function () {
            cb(null, null);
          });
        }, function (cb) {
          client2.on('connect', function () {
            cb(null, null);
          });
        }], function (err, results) {
          return done();
        });
      }

      if (option === 'mw-custom') {
        httpServer.listen(8889, listenCallback);
      } else {
        httpServer = expressApp.listen(8889, listenCallback);
      }
    }

    beforeEach(function (done) {
      if (option === 'mw' || option === 'mw-custom') {
        initMw(done);
      } else {
        initServer(done);
      }
    });

    afterEach(function (done) {
      client.destroy();
      client2.destroy();
      server.deRegister('echo');
      server.deRegister('save');
      if (option === 'mw' || option === 'mw-custom') {
        httpServer.close(done);
      } else {
        server.close(done);
      }
    });

    describe('Request', function () {
      it('client: should send and receive hello (2x)', function (done) {
        var message = 'hello';

        async.parallel([function (cb) {
          setTimeout(function () {
            client.request('echo', [message], function (err, result) {
              cb(err, result);
            });
          }, 0);
        }, function (cb) {
          setTimeout(function () {
            client.request('echo', [message], function (err, result) {
              cb(err, result);
            });
          }, 10);
        }], function (err, results) {
          expect(results[0]).toBe(message);
          expect(results[1]).toBe(message);
          done();
        });
      });

      it('client2: should send and receive world (2x)', function (done) {
        var message = 'world';

        async.parallel([function (cb) {
          setTimeout(function () {
            client2.request('echo', [message], function (err, result) {
              cb(err, result);
            });
          }, 0);
        }, function (cb) {
          setTimeout(function () {
            client2.request('echo', [message], function (err, result) {
              cb(err, result);
            });
          }, 10);
        }], function (err, results) {
          expect(results[0]).toBe(message);
          expect(results[1]).toBe(message);
          done();
        });
      });

      // it('should have 2 connections', (done) => {
      //   setTimeout(() => {
      //     expect(state.server.clients).toBe(2);
      //     done();
      //   }, 0);
      // });
    });

    describe('Notify', function () {
      it('should receive messages from client', function (done) {
        var messages = ['foo', 'bar'];
        async.parallel([function (cb) {
          setTimeout(function () {
            client.notify('save', [messages[0]]);
            cb(null, null);
          }, 0);
        }, function (cb) {
          setTimeout(function () {
            client.notify('save', [messages[1]]);
            cb(null, null);
          }, 10);
        }], function (err, results) {
          setTimeout(function () {
            expect(state.server.store.length).toBe(2);
            expect(state.server.store).toContain(messages[0]);
            expect(state.server.store).toContain(messages[1]);
            done();
          }, 0);
        });
      });

      // it('should have 2 connections', (done) => {
      //   setTimeout(() => {
      //     expect(state.server.clients).toBe(2);
      //     done();
      //   }, 300);
      // });
    });

    describe('Batch', function () {
      it('should send and receive batch(req: 1, notify: 1)', function (done) {
        var message = 'hello';
        var res = null;

        setTimeout(function () {
          var req = client.makeRequest('echo', [message], function (err, result) {
            res = result;
          });
          var not = client.makeNotify('save', [message]);
          client.batch([req, not]);
        }, 0);

        setTimeout(function () {
          expect(res).toBe(message);
          expect(state.server.store.length).toBe(1);
          expect(state.server.store).toContain(message);
          done();
        }, 10);
      });

      // it('should have 2 connections', (done) => {
      //   setTimeout(() => {
      //     expect(state.server.clients).toBe(2);
      //     done();
      //   }, 0);
      // });
    });
  };
};
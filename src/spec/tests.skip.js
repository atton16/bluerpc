const async = require('async');
const express = require('express');

module.exports = (Server, Client, option) => {
  return () => {
    let server, client, client2, state, expressApp, expressWs, httpServer;

    function initServer(done) {
      state = {
        server: {
          clients: 0,
          store: [],
        },
      };
      server = new Server();
      server.on('connect', () => {
        state.server.clients++;
      });
      server.on('close', () => {
        state.server.clients--;
      });
      server.register('echo', (params) => {
        return params[0];
      });
      server.register('save', (params) => {
        state.server.store.push(params[0]);
      });
      server.listen({}, () => {
        client = new Client();
        client2 = new Client();
        async.parallel([
          (cb) => {
            client.on('connect', () => {
              cb(null, null);
            });
          },
          (cb) => {
            client2.on('connect', () => {
              cb(null, null);
            });
          },
        ], (err, results) => done());
      });
    }

    function initMw(done, option) {
      state = {
        server: {
          clients: 0,
          store: [],
        },
      };
      server = new Server({ middlewareOnly: true });
      server.register('echo', (params) => {
        return params[0];
      });
      server.register('save', (params) => {
        state.server.store.push(params[0]);
      });

      expressApp = express();
      if (option === 'mw-custom') {
        const http = require('http');
        httpServer = http.createServer(expressApp);
        expressWs = require('express-ws')(expressApp, httpServer);
      } else {
        expressWs = require('express-ws')(expressApp);
      }

      expressApp.ws('/json-rpc', server.middleware());

      expressWs.getWss().on('connection', function(socket){
        state.server.clients++;
        socket.on('close', function(){
          state.server.clients--;
        });
      });

      function listenCallback () {
        client = new Client({
          path: '/json-rpc',
        });
        client2 = new Client({
          path: '/json-rpc',
        });
        async.parallel([
          (cb) => {
            client.on('connect', () => {
              cb(null, null);
            });
          },
          (cb) => {
            client2.on('connect', () => {
              cb(null, null);
            });
          },
        ], (err, results) => done());
      }

      if (option === 'mw-custom') {
        httpServer.listen(8889, listenCallback);
      } else {
        httpServer = expressApp.listen(8889, listenCallback);
      }
    }
    
    beforeEach((done) => {
      if(option === 'mw' || option === 'mw-custom') {
        initMw(done);
      } else {
        initServer(done);
      }
    });
  
    afterEach((done) => {
      client.destroy();
      client2.destroy();
      server.deRegister('echo');
      server.deRegister('save');
      if(option === 'mw' || option === 'mw-custom') {
        httpServer.close(done);
      } else {
        server.close(done);
      }
    });
  
    describe('Request', () => {
      it('client: should send and receive hello (2x)', (done) => {
        const message = 'hello';
        
        async.parallel([
          (cb) => {
            setTimeout(() => {
              client.request('echo', [message], (err, result) => {
                cb(err, result);
              });
            }, 0);
          },
          (cb) => {
            setTimeout(() => {
              client.request('echo', [message], (err, result) => {
                cb(err, result);
              });
            }, 10);
          },
        ], (err, results) => {
          expect(results[0]).toBe(message);
          expect(results[1]).toBe(message);
          done();
        });
      });
  
      it('client2: should send and receive world (2x)', (done) => {
        const message = 'world';
        
        async.parallel([
          (cb) => {
            setTimeout(() => {
              client2.request('echo', [message], (err, result) => {
                cb(err, result);
              });
            }, 0);
          },
          (cb) => {
            setTimeout(() => {
              client2.request('echo', [message], (err, result) => {
                cb(err, result);
              });
            }, 10);
          },
        ], (err, results) => {
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
  
    describe('Notify', () => {
      it('should receive messages from client', (done) => {
        const messages = ['foo', 'bar'];
        async.parallel([
          (cb) => {
            setTimeout(() => {
              client.notify('save', [messages[0]]);
              cb(null,null);
            }, 0);
          },
          (cb) => {
            setTimeout(() => {
              client.notify('save', [messages[1]]);
              cb(null,null);
            }, 10);
          },
        ], (err, results) => {
          setTimeout(() => {
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
  
    describe('Batch', () => {
      it('should send and receive batch(req: 1, notify: 1)', (done) => {
        const message = 'hello';
        let res = null;
  
        setTimeout(() => {
          const req = client.makeRequest('echo', [message], function(err, result){
            res = result;
          });
          const not = client.makeNotify('save', [message]);
          client.batch([req, not]);
        }, 0);
  
        setTimeout(() => {
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

const Servers = require('./server');
const Clients = require('./client');

module.exports = {
  Server: {
    TCP: Servers.tcp,
    HTTP: Servers.http,
    WS: Servers.ws,
  },
  Client: {
    TCP: Clients.tcp,
    HTTP: Clients.http,
    WS: Clients.ws,
  },
};

const http = require('http');

const postData = JSON.stringify({
  method: 'hello',
  params: ['a'],
  id: 1,
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/json-rpc',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData),
  },
  agent: new http.Agent({
    // This should be the default settings
    keepAlive: true,  // Use http keep-alive header
    keepAliveMsecs: -1, // -1: Disable keep-alive packets
  }),
};

sendTest();
setInterval(sendTest, 3000);

function sendTest() {
  const req = http.request(options, (res) => {
    res.on('data', (chunk) => {
      console.log(JSON.parse(chunk));
    });
    // res.on('end', () => {});
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
}

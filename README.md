# BlueRPC
BlueRPC is a **simple** and **high performance** JSON-RPC 2.0 library written in JavaScript for Node.js.

## The Package
The package consists of both **client** and **server** library. Additionally, the server can also be run as **Express/Connect** middleware.

## Achieving Highest Performance
BlueRPC uses single connection per client regardless of the underlying communication protocols. This result in much lower packet counts since only one handshake is required per client. We can see its benefit clearly in a high frequency server-to-server communication such as "Authentication via microservice" where thousands of requests per second is generated simultaneously.

## Drawback
Since only one connection is used per client. The server have to reserve some memory to keep the connection state.
It could potentially consume a lot of memory on the server in the scenario where there are a lot of clients connected to it.

## Underlying Protocols
The library **supports TCP, HTTP and WebSocket** protocols. The exception is that it **DOES NOT natively support HTTPS and WebSockets**. You have to use reverse proxy server to wrap the communication in the secure layer.

Following is the compatibility table.

| Library           |  TCP  | HTTP| WebSocket |
| ----------------- |:-----:|:---:|:---------:|
| Client            |   Y   |  Y  |     Y     |
| Server            |   Y   |  Y  |     Y     |
| Middleware Server |***N***|  Y  |     Y     |

## Examples
The examples can be found inside examples folder.

## Development
##### Completed
- Basic functionality
- Examples
##### Under development
- Unit test
##### Planned
- Load test
- Documentation

## Inspiration
- [Jayson](https://github.com/tedeh/jayson): a simple but featureful JSON-RPC 2.0/1.0 client and server for node.js
- Uber's [Multitransport JSON-RPC](https://github.com/uber/multitransport-jsonrpc) Client and Server

## Contribution
As the core functionality is completed. Now is the time for testing and writing documentation. You are more than welcome to help make this project more complete.

## Donation
If you like my work please help donate.
- PayPal: [https://paypal.me/AttawitK](https://paypal.me/AttawitK)
- Bitcoin: 1FN1hPzz1Z9tZwSDrHLeb57JGb4rJ1NviB

Your donation is much appreciated.

Thank you.
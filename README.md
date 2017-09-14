# BlueRPC
BlueRPC is a **simple** and **high performance** JSON-RPC 2.0 library written in JavaScript for Node.js.

## The Package
The package consists of both **client** and **server** library. Additionally, the server can also be run as **Express/Connect** middleware.

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
##### Under development
- Unit test
- Examples
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
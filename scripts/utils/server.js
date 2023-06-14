'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const node_http_1 = require('node:http');
(0, node_http_1.createServer)((_, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello world!');
}).listen(1002, () => console.log('Server running on port 1002'));

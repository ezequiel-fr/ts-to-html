import { createServer } from 'node:http';

createServer((_, res) => {
    res.setHeader('Content-Type', "text/html");
    res.end("Hello world!");
}).listen(1002, () => console.log("Server running on port 1002"))

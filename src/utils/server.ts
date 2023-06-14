import { createServer } from 'node:http';

import { clearAndLog } from './log';

createServer((_, res) => {
    res.setHeader('Content-Type', "text/html");
    res.end("Hello!");
}).listen(1002, () => clearAndLog("Server running on port 1002"));

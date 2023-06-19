import { watch, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { compile } from 'sass';
import { WebSocketServer } from 'ws';

import { compileAll, compileSassFile } from './utils/compiler';
import { clearAndLog } from './utils/log';
import Server from './utils/server';

// Compile files
(async () => await compileAll())();

// Server instance
const cb = () => clearAndLog("Waiting for changes...".cyan);
const server = Server(cb);

// WebSocket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    ws.on('error', console.error);
    ws.on('unexpected-response', console.error);
});
wss.on('error', console.error);

// Watchers
const watcher = watch(resolve(), { recursive: true });

watcher.on('change', async (_, fn) => {
    const filename = fn ? typeof fn === "string" ? fn : fn.toString() : "";

    // Check changed folder
    if (/^(?:public|src)[\\/][^\\/]+$/.test(filename)) {
        // Send to websocket
        if (/^public[\\/]index\.(html|htm|shtml)$/.test(filename)) {
            wss.clients.forEach(ws => ws.send(JSON.stringify({ type: "reload" })));
        } else if (/^public[\\/][^\\/]+\.scss$/.test(filename)) {
            // Compile SASS files
            const path = resolve(process.cwd(), filename);
            const compiled = await compileSassFile(path);
            const resultPath = path.replace(/\.scss$/, ".css");

            writeFileSync(resultPath, compiled);

            wss.clients.forEach(ws => ws.send(JSON.stringify({ type: "update", data: "css" })));
        } else {
            wss.clients.forEach(ws => ws.send(JSON.stringify({ filename })));
        }
    }
});

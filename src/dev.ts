import { watch } from 'node:fs';
import { resolve } from 'node:path';

import { clearAndLog } from './utils/log';
import Server from './utils/server';
import { WebSocketServer } from 'ws';

// Server instance
const cb = () => clearAndLog("Waiting for changes".cyan);
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

watcher.on('change', async (_, filename) => {
    // Check changed folder
    if (/^(?:public|src)[\\/][^\\/]+$/.test(filename.toString())) {
        // Send to websocket
        if (/^public[\\/]index\.(html|htm|shtml)$/) {
            wss.clients.forEach(ws => ws.send(JSON.stringify({ type: "reload" })));
        } else {
            wss.clients.forEach(ws => ws.send(JSON.stringify({ filename })));
        }
    }
});

import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve } from 'node:path';

import { WebSocketServer } from 'ws';

import { log } from './log';

const PORT = process.env.PORT || 1002;

// config env
const server = createServer((req, res) => {
    const endRes = (code: number, message?: string) => {
        res.statusCode = code;
        message && (res.statusMessage = JSON.stringify({ message }));
        return res.end();
    };

    if (String(req.method).toUpperCase() === "GET") {
        try {
            const url = req.url || "/";
            const path = resolve(process.cwd(), "public", url.length <= 1 ? "index.html" : "./" + url);

            if (existsSync(path)) {
                res.statusCode = 200;
                return res.end(readFileSync(path));
            } else return endRes(404, "Not found");
        } catch (error) {
            return endRes(500, "An internal error has occured.");
        }
    } else endRes(401, "Unauthorized");
});
server.listen(PORT, () => log(`Server running at ${PORT}`));

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';

import env from './utils/env';
import { clearAndLog } from './utils/log';

const mimes = require('./config/mime-types.json') as Record<string, string[]>;

clearAndLog("Server starting...");

// config env
env();

// get port to serve
const PORT = process.env.PORT || "1002";

// create server
createServer((req, res) => {
    try {
        const path = resolve(process.cwd(), join("build", req.url || "/"));

        if (existsSync(path)) {
            const getMime = (path: string) => {
                const extension = extname(path).slice(1); // ".jpg" => "jpg"
                let mimeType = "*/*";

                if (extension) {
                    let tmp = Object.keys(mimes).find(e => mimes[e].includes(extension));
                    if (tmp) mimeType = tmp;
                }

                return mimeType;
            };

            if (statSync(path).isFile()) {
                res.setHeader('Content-Type', getMime(path));
                return res.end(readFileSync(path));
            } else {
                const dir = readdirSync(path);
                const indexes = dir.filter(e => e.search(/^index/i) !== -1).sort()
                                   .sort(e => Number(mimes["text/html"].includes(e)));
                const newPath = join(path, indexes[0]);

                if (existsSync(newPath)) {
                    res.setHeader('Content-Type', getMime(newPath));
                    return res.end(readFileSync(newPath));
                }
            }
        }

        res.statusCode = 404;
        res.statusMessage = "Not found";
        res.end(JSON.stringify({ message: "Not found" }));
    } catch (error) {
        res.statusCode = 500;
        res.statusMessage = "An internal error has occured.";
        res.end(JSON.stringify({ message: "A internal error has occured." }));
    }
}).listen(PORT, () => clearAndLog(`Server running at: ${PORT}`.cyan));

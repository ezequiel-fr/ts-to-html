#!/usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', err => {
    throw err;
});

const args = process.argv.slice(2);

// Get script name and arguments provided
const scriptIndex = args.findIndex(x => x === 'build' || x === 'dev' || x === 'start');
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (["start", "build", "dev"].includes(script)) {
    const result = (0, child_process_1.spawnSync)(process.execPath, nodeArgs
        .concat(require.resolve("../scripts/" + script))
        .concat(args.slice(scriptIndex + 1)));
    if (result.signal) {
        if (result.signal === "SIGKILL" || result.signal === "SIGTERM") {
            console.log("Build failed because the process exited too early.");
        }
        process.exit(1);
    }
    process.exit(result.status || 0);
}
else {
    console.log(`Unknown script "${script}".`);
    console.log("Perhaps you need to update ts-to-html?");
    console.log("See: https://github.com/ezequiel-fr/ts-to-html");
}

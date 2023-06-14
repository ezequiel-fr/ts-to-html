#!/usr/bin/env node
"use strict";

exports.__esModule = true;
var child_process_1 = require("child_process");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', function (err) {
    throw err;
});

var args = process.argv.slice(2);

// Get script name and arguments provided
var scriptIndex = args.findIndex(function (x) { return x === 'build' || x === 'dev' || x === 'start'; });
var script = scriptIndex === -1 ? args[0] : args[scriptIndex];
var nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

if (["build", "dev", "start"].includes(script)) {
    var child = (0, child_process_1.spawn)(process.execPath, [nodeArgs, require.resolve("../scripts/" + script), args.slice(scriptIndex + 1)].flat());
    child.stderr.pipe(process.stderr);
    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    child.on('close', function (code, signal) {
        if (signal) {
            if (signal === "SIGKILL" || signal === "SIGTERM")
                console.log("Build failed because the process exited too early.");
            process.exit(1);
        }
        process.exit(code || 0);
    });
} else {
    console.log("Unknown script \"".concat(script, "\"."));
    console.log("Perhaps you need to update ts-to-html?");
    console.log("See: https://github.com/ezequiel-fr/ts-to-html");
}

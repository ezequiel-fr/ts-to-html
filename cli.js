#!/usr/bin/env node
"use strict";

exports.__esModule = true;
const { spawn } = require("node:child_process");
const { resolve } = require("node:path");

// Makes the script crash on unhandled rejections instead of silently
// ignoring them.
process.on('unhandledRejection', function (err) {
    throw err;
});

var args = process.argv.slice(2);

// Get script name and arguments provided
var scriptIndex = args.findIndex(x =>
    x === 'build' || x === 'dev' || x === 'init' || x === 'start'
);
var script = scriptIndex === -1 ? args[0] : args[scriptIndex];
var nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

function spawnChild() {
    var child = spawn(
        process.execPath,
        [nodeArgs, resolve(__dirname, "./scripts/" + script), args.slice(scriptIndex + 1)].flat(),
        { stdio: 'pipe' }
    );

    child.stdin.pipe(process.stdin);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('close', function (code, signal) {
        if (signal) {
            if (signal === "SIGKILL" || signal === "SIGTERM")
                console.log("Build failed because the process exited too early.");
            else process.exit(1);
        } else process.exit(code || 0);
    });

    return child;
}

if (["build", "dev", "init", "start"].includes(script)) {
    var child = spawnChild();

    // Restart if required by the user ("rs" cmd)
    process.stdin.setEncoding("utf8");
    process.stdin.on('data', data => {
        var input = data.toString().trim();

        if (input === "rs") {
            child.kill("SIGKILL");
            child = spawnChild();
        }
    });
    process.stdin.resume();
} else {
    console.log("Unknown script \"".concat(script, "\"."));
    console.log("Perhaps you need to update ts-to-html?");
    console.log("See: https://github.com/ezequiel-fr/ts-to-html");
}

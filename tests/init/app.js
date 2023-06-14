const { spawn } = require('node:child_process');
const { resolve } = require('node:path');

const pr = spawn(process.execPath, [resolve(process.cwd(), '../../cli.js'), "init", "--force"]);

process.openStdin();

pr.stderr.pipe(process.stderr);
pr.stdin.pipe(process.stdin);
pr.stdout.pipe(process.stdout);

pr.on('close', process.exit);
pr.on('exit', process.exit);

process.stdin.setEncoding('utf8');
process.stdin.resume();

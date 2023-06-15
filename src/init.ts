import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as path } from 'node:path';
import { green } from 'colors';

import { clearAndLog, log } from './utils/log';
import { parseArgs } from './utils/parse-args';

const args = parseArgs(process.argv.slice(2));
const cwd = path(process.cwd(), args.params[0]);

// Quick functions
const resolve = (...paths: string[]) => path(cwd, ...paths);
const createFromExample = (file: string, to?: string) => writeFileSync(
    resolve(to ? to : ".", file), readFileSync(path(__dirname, "../example", file))
);

// Create directories
if (!existsSync(cwd)) mkdirSync(cwd);

if (!existsSync(resolve('public'))) mkdirSync(resolve('public'));
if (!existsSync(resolve('src'))) mkdirSync(resolve('src'));

// Create .env files
createFromExample(".env");
createFromExample(".env.example");

// Create files into `public`
createFromExample("index.html", "public");
createFromExample("style.scss", "public");

// Create files into `src`
writeFileSync(resolve('src', 'index.ts'), 'console.log("Hello World!");\r\n');

// Init Git repo
const gitExists = (() => { try {
    execSync("git --version");
    return true;
} catch (err) {
    return false;
}})();

if (gitExists) {
    execSync("git init");
    log("Git repository initialized".blue);
} else {
    log("Git not installed on this machine.".blue);
}

clearAndLog(green("Project successfully initialized!"));
process.exit(0);

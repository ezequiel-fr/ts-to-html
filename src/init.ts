import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as path } from 'node:path';
import { green } from 'colors';

import { clearAndLog } from './utils/log';

const cwd = process.cwd();
const resolve = (...paths: string[]) => path(cwd, ...paths);

// Create directories
if (!existsSync(resolve('public'))) mkdirSync(resolve('public'));
if (!existsSync(resolve('src'))) mkdirSync(resolve('src'));

const createFromExample = (file: string, to?: string) => writeFileSync(
    resolve(to ? to : ".", file), readFileSync(path(__dirname, "../example", file))
);

// Create .env files
createFromExample(".env");
createFromExample(".env.example");

// Create files into `public`
createFromExample("index.html", "public");
createFromExample("style.scss", "public");

// Create files into `src`
writeFileSync(resolve('src', 'index.ts'), 'console.log("Hello World!");\r\n');

clearAndLog(green("Project successfully initialized!"));
process.exit(0);

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { resolve as path } from 'node:path';

import 'colors';

import { clearAndLog, log } from './utils/log';
import { parseArgs } from './utils/parse-args';

const args = parseArgs(process.argv.slice(2));
const cwd = path(process.cwd(), args.params[0]);

// Quick functions
const resolve = (...paths: string[]) => path(cwd, ...paths);
const exec = (cmd: string) => execSync(cmd, { cwd });

const createFromExample = (file: string, to?: string) => writeFileSync(
    resolve(to ? to : ".", file), readFileSync(path(__dirname, "../example", file))
);

function isInstalled(cmd: string) {
    try {
        execSync(cmd + " --version");
        return true;
    } catch (error) {
        return false;
    }
};

// Clear shell
clearAndLog("Initializing project...".green);

// Create directories
if (!existsSync(cwd)) mkdirSync(cwd);

if (!existsSync(resolve('public'))) mkdirSync(resolve('public'));
if (!existsSync(resolve('src'))) mkdirSync(resolve('src'));

// Create gitignore file
createFromExample("gitignore");
renameSync(resolve("gitignore"), resolve(".gitignore"));

// Create .env files
createFromExample(".env");
createFromExample(".env.example");

// Create files into `public`
createFromExample("index.html", "public");
createFromExample("style.scss", "public");

// Create files into `src`
writeFileSync(resolve('src', 'index.ts'), 'console.log("Hello World!");\r\n// tmp\r\nrequire("./sync.ts")\r\n');
// tmp file
createFromExample("sync.ts", "src");

// Update `package.json` execution scripts
const pkgJson = resolve('package.json');
const npm = isInstalled("npm") ? "npm" : isInstalled("yarn") ? "yarn" : null;

log(`Initializing Node.js project using [${npm}]`.cyan);

if (!existsSync(pkgJson)) {
    npm ? exec(npm + " init -y") : log(
        "No supported package manager found.".red,
        `${"See:".red} ${"https://github.com/ezequiel-fr/ts-to-html".reset}`,
    );

	writeFileSync(pkgJson, JSON.stringify({
		...JSON.parse(readFileSync(pkgJson).toString()),
		scripts: {},
	}));
}

const data: { [key: string]: any } = {
	name: args.params[0],
	version: "1.0.0",
	private: true,
	dependencies: {
		"ts-to-html": "^" + JSON.parse(readFileSync(path(
			__dirname, "../package.json"
		), "utf8")).version,
	},
	scripts: {
		build: "ts-to-html build",
		start: "ts-to-html start",
		dev: "ts-to-html dev",
	},
};

writeFileSync(pkgJson, JSON.stringify(data, null, 2).concat("\r\n"));

// Init using npm or yarn
if (npm) exec(npm + " install");

// Init Git repo
if (!args.flags.includes("no-git")) {
    if (isInstalled("git")) {
        exec("git init");
        log("Git repository initialized".cyan);
    } else {
        log("Git not installed on this machine.".red);
    }
}

log("Project successfully initialized!".green);

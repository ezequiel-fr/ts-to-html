import { Configuration } from 'webpack';
import { ErrorSASS, ResultSASS } from './utils/compiler';

import {
    existsSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    rmdirSync,
    statSync,
    unlinkSync,
    writeFileSync
} from 'node:fs';
import { basename, join, resolve as path } from 'node:path';

import { JSDOM } from 'jsdom';

import { compileSASS, compileTS } from './utils/compiler';
import { clearAndLog } from './utils/log';
import config, { Modes } from './config/webpack';

const { minify } = require('html-minifier');

// Resolve snippet
const resolve = (...paths: string[]) => path(process.cwd(), "build", ...paths);

const PUBLIC_URL = process.env.PUBLIC_URL || "";

// Start building
clearAndLog("Building project...");
const dir = readdirSync(path(process.cwd(), "public"));

// Remove last build and create a new one
if (existsSync(resolve())) {
    const rmDir = (path: string) => {
        if (!existsSync(path)) return;
        const files = readdirSync(path);

        for (const file of files) {
            const filePath = join(path, file);
            const fileStat = statSync(filePath);

            (fileStat.isDirectory() ? rmDir : unlinkSync)(filePath);
        }

        rmdirSync(path);
    };

    rmDir(resolve());
}

mkdirSync(resolve());
mkdirSync(resolve("assets"));

// Compile TS in production mode
const webpackConfig: Configuration = {
    ...config,
    mode: Modes.production,
    output: {
        path: resolve("assets"),
        filename: "app.js",
    }
};

(async () => await compileTS(webpackConfig))();

// HTML file content into DOMElement
const dom = new JSDOM(readFileSync(resolve("../public/index.html")));
const { document } = dom.window;

// Add the script tag
const script = document.createElement('script');

script.type = "text/javascript";
script.src = PUBLIC_URL + "/assets/app.js";

document.head.appendChild(script);

// Update CSS location
document.querySelectorAll('link').forEach(e => (
    e.href && /\.css$/.test(e.href) && (e.href = PUBLIC_URL + "/assets"
        + e.href.replace(/%PUBLIC_URL%/g, "")
)));

// Update HTML file
writeFileSync(resolve("index.html"), minify(dom.serialize(), {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true,
}).replace(/%PUBLIC_URL%/g, PUBLIC_URL));

// Copy .env file into build dir
writeFileSync(resolve(".env"), readFileSync(resolve("../.env")));

// Compile SASS files
compileSASS(
    dir.filter(e => e.endsWith('.scss')).map(e => join(path(process.cwd(), "public"), e))
).forEach(e => {
    if (Object.prototype.hasOwnProperty.call(e, "error"))
        console.error((e as ErrorSASS).error);
    else writeFileSync(
        resolve("assets", basename((e as ResultSASS).file, "scss") + "css"),
        (e as ResultSASS).css,
    );
});

// Build ended
clearAndLog("Project build.".green);

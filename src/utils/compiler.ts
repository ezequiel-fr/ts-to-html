import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { compile } from 'sass';
import { webpack } from 'webpack';

import config from '../config/webpack';
import { clearAndLog } from './log';

export const compileTS = () => new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.run((err, stats) => {
        if (err) reject(err);
        resolve(stats?.toString({ colors: true }));
    });
});

type ResultSASS = { file: string, css: string };
type ErrorSASS<T = unknown> = { error: T };

export const compileSASS = (...files: string[] | string[][]) => {
    const paths = files.flat();
    const result: (ResultSASS | ErrorSASS)[] = [];

    for (const file of paths) {
        try {
            result.push({ file, css: compile(file, { style: "compressed" }).css });
        } catch (error) {
            result.push({ error });
        }
    }

    return result;
};

export const compileAll = async () => {
    clearAndLog("Compiling...".yellow);

    // Compile TS
    await compileTS();

    // Get SASS files
    const dir = readdirSync(resolve(process.cwd(), "public")).map(e => resolve(
        process.cwd(), "public", e
    ));
    const sassFiles = dir.filter(e => e.endsWith('.scss'));

    // Compile SASS
    compileSASS(sassFiles).forEach(e => {
        if (Object.prototype.hasOwnProperty.call(e, "error"))
            console.error((e as ErrorSASS).error);
        else writeFileSync(
            (e as ResultSASS).file.replace(/\.scss$/, '.css'),
            (e as ResultSASS).css,
        );
    });
};

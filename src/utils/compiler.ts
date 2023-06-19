import { readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import { compile } from 'sass';
import { webpack } from 'webpack';

import webpackConfig from '../config/webpack';
import { clearAndLog } from './log';

export const compileTS = (config = webpackConfig) => new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.run((err, stats) => {
        if (err) reject(err);
        resolve(stats?.toString({ colors: true }));
    });
});

export type ResultSASS = { file: string, css: string };
export type ErrorSASS<T = unknown> = { error: T };

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

export const compileSassFile = async (input: string, minified = false) => {
    // prefix and compile CSS
    const { css } = await postcss([autoprefixer]).process(
        compile(input, { style: minified ? "compressed" : "expanded" }).css,
        { from: undefined },
    );

    // Return CSS
    return css;
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
    for (const file of sassFiles) {
        const css = await compileSassFile(file);

        writeFileSync(file.replace(/\.scss$/, '.css'), css);
    }
};

import { Configuration } from 'webpack';

import { existsSync } from 'node:fs';
import { resolve as path } from 'node:path';

import env from '../utils/env';

// Config env
env();

// Get mode
export enum Modes {
    development = "development",
    production = "production",
    none = "none",
};

const mode = (() => {
    const appEnv = process.env.APP_ENV || Modes.development;

    return Object.values(Modes).includes(appEnv as Modes)
        ? appEnv
        : Modes.development;
})() as Modes;

// resolve snippet
const resolve = (...paths: string[]) => path(process.cwd(), ...paths);

// entry
const tsFile = resolve("src/index.ts");

// config
const config: Configuration = {
    mode,
    entry: existsSync(tsFile) ? tsFile : resolve("src/index.js"),
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: resolve("public"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.js)$/,
                exclude: /(node_modules|public)/i,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        compilerOptions: {
                            target: "es6",
                            module: "es6",
                        },
                    },
                },
            }
        ]
    },
};

export default config;

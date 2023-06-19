export declare const compileTS: (config?: import("webpack").Configuration) => Promise<unknown>;
export declare type ResultSASS = {
    file: string;
    css: string;
};
export declare type ErrorSASS<T = unknown> = {
    error: T;
};
export declare const compileSASS: (...files: string[] | string[][]) => (ResultSASS | ErrorSASS<unknown>)[];
export declare const compileSassFile: (input: string, minified?: boolean) => Promise<string>;
export declare const compileAll: () => Promise<void>;

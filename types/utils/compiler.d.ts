export declare const compileTS: () => Promise<unknown>;
declare type ResultSASS = {
    file: string;
    css: string;
};
declare type ErrorSASS<T = unknown> = {
    error: T;
};
export declare const compileSASS: (...files: string[] | string[][]) => (ResultSASS | ErrorSASS<unknown>)[];
export declare const compileAll: () => Promise<void>;
export {};

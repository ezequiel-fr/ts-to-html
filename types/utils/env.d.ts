declare function env(): Record<string, string> | {
    error: unknown;
};
export default env;

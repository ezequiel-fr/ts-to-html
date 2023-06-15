export function parseArgs(args: string[]) {
    const flags: string[] = [], params: string[] = [];

    for (const arg of args) {
        if (arg.startsWith("--")) {
            // i.e : "--am" => ["am"]
            const flag = arg.slice(2);
            flags.push(flag);
        } else if (arg.startsWith("-")) {
            // i.e : "-am" => ["a", "m"]
            const flagChars = arg.slice(1).split("");
            flagChars.push(...flagChars);
        } else params.push(arg);
    };

    return { flags, params };
};

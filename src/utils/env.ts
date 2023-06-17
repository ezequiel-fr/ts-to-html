import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function env() {
    let path = resolve(process.cwd(), '.env');

    const parse = (src: Buffer | string) => {
        // eslint-disable-next-line
        const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg; // prettier-ignore
        const obj: Record<string, string> = {};
    
        let lines = src.toString('utf8').replace(/\r\n?/mg, '\n'),
            match: RegExpExecArray | null;
    
        while ((match = LINE.exec(lines))) {
            let key = match[1],
                value = match[2] || "";
    
            value = value.trim();
    
            // Check if double quoted
            const maybeQuote = value[0];
    
            value = value.replace(/^(['"`])([\s\S]*)\1$/mg, '$2');
            if (maybeQuote === '"') value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
    
            obj[key] = value;
        }
    
        return obj;
    }

    try {
        const parsed = parse(readFileSync(path, { encoding: 'utf8' }));

        // Don't override the existing arguments
        Object.keys(parsed).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
                process.env[key] = parsed[key];
            }
        });

        return parsed;
    } catch (error) {
        return { error };
    }
}

export default env;

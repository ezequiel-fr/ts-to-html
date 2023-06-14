import { reset } from 'colors';

/**
 * Works like a classic console.log, but in this case if a custom color is applied to the console,
 * the color must be reset to the initial value.
 */
export const log = (...args: any[]) => console.log(...args, reset(""));

/**
 * Worls like `console.clear` function but the only function that works in this context.
 */
export const clear = () => process.stdout.write('\x1Bc');

/**
 * Same as
```js
clear(); // followed by
log();
```
 */
export const clearAndLog = (...args: any[]) => {
    clear();
    log(...args);
};

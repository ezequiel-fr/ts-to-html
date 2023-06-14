/**
 * Works like a classic console.log, but in this case if a custom color is applied to the console,
 * the color must be reset to the initial value.
 */
export declare const log: (...args: any[]) => void;
/**
 * Worls like `console.clear` function but the only function that works in this context.
 */
export declare const clear: () => boolean;
/**
 * Same as
```js
clear(); // followed by
log();
```
 */
export declare const clearAndLog: (...args: any[]) => void;

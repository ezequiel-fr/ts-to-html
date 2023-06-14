import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import colors from 'colors';

console.log("Hello world!");
writeFileSync(resolve(__dirname, "../test.log"), "Hi bro!");

console.log(colors.blue("Building project"));
console.log("".reset);

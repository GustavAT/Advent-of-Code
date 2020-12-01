import fs from 'fs';

// Read input file and parse all strings to number
const input = fs.readFileSync('./res/input01.txt', 'utf-8')
    .split('\n')
    .map((numberStr) => parseInt(numberStr));

let result: number | undefined = undefined;

for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
        if (input[i] + input[j] === 2020) {
            result = input[i] * input[j];

            i = input.length;
            break;
        }
    }
}

console.log(result);

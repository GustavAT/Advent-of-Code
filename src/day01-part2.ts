import fs from 'fs';

// Read input file and parse all strings to number
const input = fs.readFileSync('./res/input01.txt', 'utf-8')
    .split('\n')
    .map((numberStr) => parseInt(numberStr));

let result: number | undefined = undefined;

for (let i = 0; i < input.length - 2; i++) {
    for (let j = i + 1; j < input.length - 1; j++) {
        for (let k = j + 1; k < input.length; k++) {
            if (input[i] + input[j] + input[k] === 2020) {
                result = input[i] * input[j] * input[k];

                i = input.length;
                j = input.length;
                break;
            }
        }
    }
}

console.log(result);

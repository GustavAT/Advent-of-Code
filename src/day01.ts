import fs from 'fs';

const readInput = () => fs.readFileSync('./res/input01.txt', 'utf-8')
    .split('\n')
    .map((numberStr) => parseInt(numberStr));

const part1 = (input: number[]): number | undefined => {
    for (let i = 0; i < input.length - 1; i++) {
        for (let j = i + 1; j < input.length; j++) {
            if (input[i] + input[j] === 2020) {
                return input[i] * input[j];
            }
        }
    }

    return undefined;
}

const part2 = (input: number[]): number | undefined => {
    for (let i = 0; i < input.length - 2; i++) {
        for (let j = i + 1; j < input.length - 1; j++) {
            for (let k = j + 1; k < input.length; k++) {
                if (input[i] + input[j] + input[k] === 2020) {
                    return input[i] * input[j] * input[k];
                }
            }
        }
    }

    return undefined;
}

const input = readInput();
console.log('part1:', part1(input));
console.log('part2:', part2(input));

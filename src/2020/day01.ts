import { readAllLinesFilterEmpty } from '../util';

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

const input = readAllLinesFilterEmpty('./res/2020/input01.txt').map((number) => parseInt(number));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

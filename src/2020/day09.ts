import { readAllNumbers } from "../io.util";

const isSum = (a: number[], sum: number): boolean => {      // Day 1 solution
    for (let i = 0; i < a.length - 1; i++) {
        for (let j = i + 1; j < a.length; j++) {
            if (a[i] + a[j] === sum) {
                return true;
            }
        }
    }

    return false;
}

const part1 = (input: number[]): number => {
    for (let i = 25; i < input.length; i++) {               // Start with the 26th number
        const target = input[i];

        if (!isSum(input.slice(i - 25, i), target)) {       // Find sum in the previous 25 numbers
            return target;
        }
    }

    return -1;
}

const part2 = (input: number[]): number => {
    const target = part1(input);

    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {        // Subsequence starting at i
            const seq = input.slice(i, j);
            const sum = seq.reduce((sum, x) => sum + x);

            if (sum === target) {
                return Math.min(...seq) + Math.max(...seq); // Found the sequence
            } else if (sum > target) {                      // Sequence does not sum to target number; break inner loop
                break;
            }
        }
    }

    return -1;
}

const input = readAllNumbers('./res/2020/input09.txt');
console.log('Invalid (part 1):', part1(input));
console.log('Invalid (part 2):', part2(input));

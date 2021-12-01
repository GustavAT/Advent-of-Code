import { sum } from '../arrays.util';
import { readAllNumbers } from '../io.util';

const part1 = (input: number[]): number => {
  let count = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i - 1] < input[i]) {
      count++;
    }
  }

  return count;
};

const part2 = (input: number[]): number => {
  let count = 0;

  for (let i = 3; i < input.length; i++) {
    const sum1 = sum(input.slice(i - 3, i));        // Sliding window [..., X, X, X, _, ...]
    const sum2 = sum(input.slice(i - 2, i + 1));    // Sliding window [..., _, X, X, X, ...]

    if (sum1 < sum2) {
      count++;
    }
  }

  return count;
};

const input = readAllNumbers('./res/2021/input01.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

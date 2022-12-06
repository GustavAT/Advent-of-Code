import { readFirstLine } from '../io.util';

const moveSlidingWindow = (data: string, windowSize: number): number => {
  for (let i = 0; i < input.length - windowSize + 1; i++) {     // Move a sliding window across the input data
    const window = new Set(input.slice(i, i + windowSize));     // Put current window into a set
    if (window.size === windowSize) {                           // All characters in current window are unique if the set size = window size
      return i + windowSize;                                    // Return index at the end of the sliding window
    }
  }

  return -1;
}

const part1 = (input: string): number => moveSlidingWindow(input, 4);

const part2 = (input: string): number => moveSlidingWindow(input, 14);

const input = readFirstLine('./res/2022/day06.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

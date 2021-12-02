import { readLinesWithRegExp } from '../io.util';

const LINE_REGEX = /(\w+)\s(\d)/;                             // Match (word+)(whitespace)(number)

const part1 = (input: [string, number][]): number => {
  const groups = input.reduce((all, [direction, value]) => {
    all[direction] = all[direction]
      ? all[direction] + value                                // Update existing value
      : value;                                                // First time writing direction to map
    return all;
  }, {} as { [key: string]: number});                         // Group values by their direction

  return groups['forward'] * (groups['down'] - groups['up']);
};

const part2 = (input: [string, number][]): number => {
  let horizontal = 0, depth = 0, aim = 0;

  for (const [direction, value] of input) {
    if (direction === 'forward') {
      horizontal += value;
      depth += value * aim;
    } else if (direction === 'down') {
      aim += value;
    } else {
      aim -= value;
    }
  }

  return horizontal * depth;
};

const input = readLinesWithRegExp('./res/2021/input02.txt', LINE_REGEX)
  .map(([,direction, value]) => [direction, +value] as [string, number]);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

import { readAllLinesFilterEmpty } from '../io.util';

const getPriority = (item: string): number => {
  if (item === item.toUpperCase()) {
    return item.charCodeAt(0) - 64 + 26;        // A ... 65, 26 offset as uppercase start at 27
  }

  return item.charCodeAt(0) - 96;               // a ... 97
};

const part1 = (input: string[]): number => {
  let priority = 0;

  for (let i = 0; i < input.length; i++) {
    const line = input[i];                      // Split line in half: first, second
    const first = [...line.slice(0, line.length / 2)];
    const second = [...line.slice(line.length / 2, line.length)];

    // Find all elements in 'first' that have at least 1 occurrence in 'second'
    const common = first.filter(item1 => second.some(item2 => item1 === item2));
    priority += getPriority(common[0]);
  }
  return priority;
};

const part2 = (input: string[]): number => {
  let priority = 0;

  for (let i = 0; i < input.length; i += 3) {
    const line1 = [...input[i]];
    const line2 = [...input[i + 1]];
    const line3 = [...input[i + 2]];

    const common = line1
      .filter(item1 => line2.some(item2 => item1 === item2))  // Items in line1 with at least 1 occurrence in line2
      .filter(item => line3.some(item3 => item === item3));   // Common items with at least 1 occurrence in line3

    priority += getPriority(common[0]);
  }

  return priority;
};

const input = readAllLinesFilterEmpty('./res/2022/day03.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

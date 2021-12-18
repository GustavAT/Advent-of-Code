import { readAllLinesFilterEmpty } from '../io.util';

const PARSE_REGEX = /\d+|\[|]/;                                                   // Match number|'['|']'

type SnailFish = { values: number[]; depths: number[] };                          // Helper type

/**
 * Main idea: Maintain two arrays: 1 for values and 1 for depth values
 * @param line
 */
const parse = (line: string): SnailFish => {
  let depth = 0;
  const values = [];
  const depths = [];

  for (; ;) {
    const match = line.match(PARSE_REGEX);                                        // Get next number or '[' or ']'
    if (!match) {
      break;                                                                      // Line parsed completely
    }

    const target = match[0];
    if (target === '[') {                                                         // Increase depth
      depth++;
    } else if (target === ']') {
      depth--;                                                                    // Decrease depth
    } else {
      values.push(+target);                                                       // Add number and its depth level
      depths.push(depth);
    }

    line = line.replace(PARSE_REGEX, '');                                         // Remove processed match from line
  }

  return {values, depths};
};

const add = (left: SnailFish, right: SnailFish): SnailFish => {
  const values = [...left.values, ...right.values];                               // Deep-copy all values
  const depths = [...left.depths, ...right.depths].map((n) => n + 1);             // Deep-copy all depths and increase by 1

  return {values, depths};
};

const explode = (n: SnailFish): boolean => {
  const index = n.depths.findIndex((d) => d > 4);                                 // Pair with depth >=5 exists?
  if (index === -1) {
    return false;                                                                 // All exploded
  }

  const pair = n.values.splice(index, 2, 0);                                      // Replace pair by 0
  const depth = n.depths[index];
  n.depths.splice(index, 2, depth - 1);                                           // Decrease depth of pair by 1

  if (index > 0) {
    n.values[index - 1] += pair[0];                                               // Increase left neighbour by left value of pair
  }
  if (index < n.values.length - 1) {
    n.values[index + 1] += pair[1];                                               // Increase right neighbour by right value of pair
  }

  return true;
};

const split = (n: SnailFish): boolean => {
  const index = n.values.findIndex((v) => v > 9);                                 // Value >= 10 exists?
  if (index === -1) {
    return false;                                                                 // No split possible
  }

  const value = n.values[index];
  const newValue = [Math.floor(value / 2), Math.ceil(value / 2)];                 // Create a new pair from value
  n.values.splice(index, 1, ...newValue);                                         // Replace value by pair

  const depth = n.depths[index];
  const newDepths = [depth + 1, depth + 1];
  n.depths.splice(index, 1, ...newDepths);                                        // Increase depth level of pair by 1

  return true;
};

const reduce = (n: SnailFish): void => {
  let hasExploded = true;
  let hasSplit = true;
  while (hasExploded && hasSplit) {                                               // Repeat until no pair has exploded or value split
    const hasExploded = explode(n);                                               // Always try to explode
    if (hasExploded) {
      continue;
    }

    hasSplit = split(n);                                                          // Nothing exploded, try to split
  }
};

const magnitude = (n: SnailFish): number => {
  while (n.values.length > 1) {
    const index = n.depths.findIndex((d, i) => n.depths[i] === n.depths[i + 1]);  // Find two consecutive numbers with an equal depth level
    const depth = n.depths[index];
    const pair = [n.values[index], n.values[index + 1]];
    n.values.splice(index, 2, (3 * pair[0] + 2 * pair[1]));                       // Replace pair with 3*left + 2*right
    n.depths.splice(index, 2, depth - 1);                                         // Decrease depth level of new value by 1
  }

  return n.values[0];
};

const copy = (n: SnailFish): SnailFish => {
  return {values: [...n.values], depths: [...n.depths]};                          // Copy snail-fish number
};

const part1 = (input: SnailFish[]): number => {
  const numbers = [...input];
  let n = numbers.shift()!;
  for (const next of numbers) {
    n = add(n, next);
    reduce(n);
  }

  return magnitude(n);
};

const part2 = (input: SnailFish[]): number => {
  const magnitudes: number[] = [];
  const numbers = [...input];

  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = 0; j < numbers.length; j++) {
      const n1 = copy(numbers[i]);
      const n2 = copy(numbers[j]);

      const sum1 = add(n1, n2);
      reduce(sum1);
      magnitudes.push(magnitude(sum1));

      const sum2 = add(n2, n1);
      reduce(sum2);
      magnitudes.push(magnitude(sum2));
    }
  }

  return Math.max(...magnitudes);
};

const input = readAllLinesFilterEmpty('./res/2021/input18.txt')
  .map((line) => parse(line));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

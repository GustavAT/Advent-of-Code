import { sort } from '../arrays.util';
import { readAllLines } from '../io.util';

const parse = (input: string[]): { polymer: string, rules: Record<string, string> } => {
  const polymer = input[0];                                   // First line contains polymer

  const rules: Record<string, string> = {};
  for (let i = 2; i < input.length - 1; i++) {                // Remaining lines contain rules XY -> Z
    const [left, right] = input[i].split(' -> ');
    rules[left] = right;
  }

  return {polymer, rules};
};

const initialize = (polymer: string): Record<string, number> => {
  const counts: Record<string, number> = {};                  // Count each pair in polymer string
  for (let i = 0; i < polymer.length - 1; i++) {              // Example: ABCAB -> AB: 2, BC: 1, CA: 1
    const pair = polymer[i] + polymer[i + 1];
    counts[pair] = (counts[pair] ?? 0) + 1;
  }

  return counts;
};

const expand = (counts: Record<string, number>, rules: Record<string, string>): Record<string, number> => {
  const newCounts: Record<string, number> = {};

  for (const pair in counts) {
    const count = counts[pair];                               // Always one rule applies to a pair
    const left = pair[0] + rules[pair]!;                      // A pair results in exactly two pairs
    const right = rules[pair]! + pair[1];                     // LR -> X | LX and XR
    newCounts[left] = (newCounts[left] ?? 0) + count;         // Update counts to the new/existing pairs
    newCounts[right] = (newCounts[right] ?? 0) + count;
  }

  return newCounts;
};

const countChars = (counts: Record<string, number>): Record<string, number> => {
  const charCounts: Record<string, number> = {};
  for (const pair in counts) {                                // Count all characters in all pairs
    const count = counts[pair];
    charCounts[pair[0]] = (charCounts[pair[0]] ?? 0) + count;
    charCounts[pair[1]] = (charCounts[pair[1]] ?? 0) + count;
  }

  return charCounts;
};

const execute = (input: string[], steps: number): number => {
  const {polymer, rules} = parse(input);
  let pairCounts = initialize(polymer);

  for (let step = 0; step < steps; step++) {
    pairCounts = expand(pairCounts, rules);                   // Expand the polymer for n steps
  }

  const charCounts = Object.entries(countChars(pairCounts))   // Count each character
    .map(([, count]) => Math.ceil(count / 2));                // Most characters are counted twice. Use Math.ceil to correct
  const sorted = sort(charCounts);                            // Sort by count ascending

  return sorted[sorted.length - 1] - sorted[0];               // Biggest - smallest
};

const part1 = (input: string[]): number => execute(input, 10);

const part2 = (input: string[]): number => execute(input, 40);

const input = readAllLines('./res/2021/input14.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

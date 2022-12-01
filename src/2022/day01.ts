import { reverse, sort, sum } from '../arrays.util';
import { readAllLines } from '../io.util';
import { maximum } from '../sets.util';
import { groupInput } from '../util';

const part1 = (input: number[][]): number => {
  const calories = input.map(snacks => sum(snacks));                  // Sum calories of each elf
  return maximum(calories)!;                                          // Find the most calories
};

const part2 = (input: number[][]): number => {
  const calories = reverse(sort(input.map(snacks => sum(snacks))));   // Order the sum of calories of each elf descending
  return calories[0] + calories[1] + calories[2];                     // Pick the first 3 (most calories)
};

const input = groupInput(readAllLines('./res/2022/day01.txt'))
  .map(group => group.map(number => +number));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

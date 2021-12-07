import { sum } from '../arrays.util';
import { readNumbersFirstLine } from '../io.util';
import { identity } from '../util';

const gaussSum = (n: number): number => (n * (n + 1)) / 2;      // Gauss sum formula: sum numbers 0 .. n

/**
 * Calculate the optimal fuel cost to align all crabs at the same horizontal position
 * @param positions Crab positions
 * @param costFn Cost function to calculate fuel when moving n positions
 */
const getFuelCost = (positions: number[], costFn: (n: number) => number): number => {
  const min = Math.min(...input);                               // Smallest crab position; can't go below that
  const max = Math.max(...input);                               // Greatest crab position; can't go above that

  let fuel = Number.POSITIVE_INFINITY;
  for (let i = min; i <= max; i++) {                            // Check every position for it's fuel consumption
    const offsets = input.map((n) => costFn(Math.abs(n - i)));  // Calculate offsets for each crab position to the current position
    const f = sum(offsets);

    if (f < fuel) {                                             // Sum of current offsets < known minimum fuel consumption: found the new minimum
      fuel = f;
    }
  }

  return fuel;
};

const part1 = (input: number[]): number => getFuelCost(input, identity);

const part2 = (input: number[]): number => getFuelCost(input, gaussSum);

const input = readNumbersFirstLine('./res/2021/input07.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

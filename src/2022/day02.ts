import { sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';

/**
 * Win:  6
 * Draw: 3
 * Loss: 0
 */

// A, X ... rock | B, Y ... paper | C, Z ... scissors
const SCORES_PART_1: Record<string, number> = {
  'AX': 4,  // 1 + 3
  'AY': 8,  // 2 + 6
  'AZ': 3,  // 3 + 0
  'BX': 1,  // 1 + 0
  'BY': 5,  // 2 + 3
  'BZ': 9,  // 3 + 6
  'CX': 7,  // 1 + 6
  'CY': 2,  // 2 + 0
  'CZ': 6   // 3 + 3
};

// A ... rock, B ... paper, C ... scissors
// X ... loss, Y ... draw, Z ... win
const SCORES_PART_2: Record<string, number> = {
  'AX': 3,  // 3 + 0
  'AY': 4,  // 1 + 3
  'AZ': 8,  // 2 + 6
  'BX': 1,  // 1 + 0
  'BY': 5,  // 2 + 3
  'BZ': 9,  // 3 + 6
  'CX': 2,  // 2 + 0
  'CY': 6,  // 3 + 3
  'CZ': 7   // 1 + 6
};

const part1 = (input: string[]): number => {
  return sum(input.map((game) => SCORES_PART_1[game]));
};

const part2 = (input: string[]): number => {
  return sum(input.map((game) => SCORES_PART_2[game]));
};

const input = readAllLinesFilterEmpty('./res/2022/day02.txt')
  .map((line) => line.replace(' ', ''));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

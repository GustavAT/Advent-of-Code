import { sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';
import { contains } from '../sets.util';

const LINE_REGEX = /[a-g]+/g;                                                     // Sequence of characters [a-g]

const part1 = (input: string[][][]): number => {                                  // 2, 3, 4, 7 are unique by their number of segments
  const sums = input.map(([, digits]) => digits.filter((d) => [2, 3, 4, 7].includes(d.length)).length);

  return sum(sums);
};

const decode = (digits: string[]): Record<string, number> => {
  const mapping: Record<string, number> = {};

  const one = digits.find((d) => d.length === 2)!;                                // 1 has 2 segments
  mapping[one] = 1;

  const seven = digits.find((d) => d.length === 3)!;                              // 7 has 3 segments
  mapping[seven] = 7;

  const four = digits.find((d) => d.length === 4)!;                               // 4 has 4 segments
  mapping[four] = 4;

  const eight = digits.find((d) => d.length === 7)!;                              // 8 has 7 segments
  mapping[eight] = 8;

  const digits069 = digits.filter((d) => d.length === 6);                         // 0, 6, 9 have six segments

  const nine = digits069.find((d) => contains([...d], [...four]))!;               // 9 overlaps 4
  mapping[nine] = 9;

  const zero = digits069.find((d) => contains([...d], [...one]) && d !== nine)!;  // 0 overlaps 1 and is not 9
  mapping[zero] = 0;

  const six = digits069.find((d) => d !== nine && d !== zero)!;                   // 6 is not 9 or 0
  mapping[six] = 6;

  const digits235 = digits.filter((d) => d.length === 5);                         // 2, 3, 5 have five segments

  const three = digits235.find((d) => contains([...d], [...one]))!;               // 3 overlaps 1
  mapping[three] = 3;

  const five = digits235.find((d) => contains([...six], [...d]))!;                // 6 overlaps 5
  mapping[five] = 5;

  const two = digits235.find((d) => d !== three && d !== five)!;                  // 2 is not 3 or 5
  mapping[two] = 2;

  return mapping;
};

const calculate = (mapping: Record<string, number>, digits: string[]): number => {
  const numbers = digits
    .reverse()                                                                    // Index matches decimal power
    .map((d, i) => mapping[d] * Math.pow(10, i));                                 // a_i = m[d] * 10^i

  return sum(numbers);
};

const part2 = (input: string[][][]): number => {
  const sums = input.map(([digits, output]) => calculate(decode(digits), output));

  return sum(sums);
};

const input = readAllLinesFilterEmpty('./res/2021/input08.txt')
  .map((line) => line.match(LINE_REGEX)!)                                         // Get all digits
  .map((matches) => matches.map((match) => [...match].sort()                      // Sort each digit alphabetically for simplicity
    .join('')))
  .map((matches) => [matches.slice(0, 10), matches.slice(-4)]);                   // [0...9] = observed digits, [10...13] = output digits
console.log('part1:', part1(input));
console.log('part2:', part2(input));

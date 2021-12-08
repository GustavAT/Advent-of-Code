import { sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';
import { minus } from '../sets.util';

const LINE_REGEX = /[a-g]+/g;                                       // Sequence of characters [a-g]

const part1 = (input: string[][][]): number => {                    // Filter digits that have length of 2 = 1, 3 = 7, 4 = 4 or 7 = 8 segments
  const digits = input.map(([,output]) => output.filter((d) => [2,3,4,7].includes(d.length)));

  return sum(digits.map((d) => d.length));
};

/**
 * Creates a unique segment -> character mapping considering the following 7-segment display:
 *  000
 * 1   2
 * 1   2
 *  333
 * 4   5
 * 4   5
 *  666
 * @param digits Digits 0-9 represented as segments that light up
 */
const getMapping = (digits: string[]): Record<number, string> => {
  const segments = [...Array(7)].map(() => '');

  // 1 - Segments 2,5 on
  const seg25 = [...digits.find((d) => d.length === 2)!];           // 1 is unique, 2 segments

  // 7 - Segments 0, 2, 5 on
  const seg025 = [...digits.find((d) => d.length === 3)!];          // 7 is unique, 3 segments
  const seg0 = minus(seg025, seg25)[0];                             // 7 = 1 + segment 0
  segments[0] = seg0;

  // 4 - Segments 1, 2, 3, 5 on
  const seg1235 = [...digits.find((s) => s.length === 4)!];         // 4 is unique
  const seg13 = minus(seg1235, seg25);                              // 4 = 1 + segment 2,3

  // 9 - All except 4 on - Determine segment 6
  const seg01235 = [seg0, ...seg13, ...seg25];
  const seg6 = digits.filter((d) => d.length === 6)                 // Possible: 0, 6, 9
    .map((d) => minus([...d], seg01235))                            // 9 = 1, 4, 7 + segment 6
    .find((s) => s.length === 1)![0];                               // 0: remaining 5, 6 | 6: remaining 5, 6 | 9 segments 6
  segments[6] = seg6;

  // 3 - Segment 0, 2, 3, 5, 6 on - Determine segment 3 and 1
  const seg0256 = [seg0, ...seg25, seg6];
  const seg3 = digits.filter((d) => d.length === 5)                 // Possible 2, 3, 5
    .map((d) => minus([...d], seg0256))                             // 3 = 1 + segment 0, 6 + segment 3
    .find((s) => s.length === 1)![0];                               // 2: remaining 5, 3 | 3 remaining: 3 | 5 remaining: 1, 3
  segments[3] = seg3;
  segments[1] = minus(seg13, [seg3])[0];                            // segment 1 must be the other

  // 8 - All segments on - Determine last unknown segment 4
  const seg013256 = [seg0, ...seg13, ...seg25, seg6];
  const seg4 = minus([...'abcdefg'], seg013256)[0];                 // Know all segments except 4
  segments[4] = seg4;

  // 2 - Segment 0, 2, 3, 4, 6 on - Determine segment 4
  const seg0346 = [seg0, seg3, seg4, seg6];
  const seg2 = digits.filter((d) => d.length === 5)                 // Possible 2, 3, 5
    .map((d) => minus([...d], seg0346))                             // 2: remaining seg 2 | 3: remaining: 2, 5 | 5 remaining: 1, 5
    .find((d) => d.length === 1)![0];
  segments[2] = seg2;
  segments[5] = minus(seg25, [seg2])[0];                            // segment 5 must be the other

  return segments;
};

const getOutput = (mapping: Record<number, string>, output: string[]): number => {
  const map = [
    mapping[0] + mapping[1] + mapping[2] + mapping[4] + mapping[5] + mapping[6],
    mapping[2] + mapping[5],
    mapping[0] + mapping[2] + mapping[3] + mapping[4] + mapping[6],
    mapping[0] + mapping[2] + mapping[3] + mapping[5] + mapping[6],
    mapping[1] + mapping[2] + mapping[3] + mapping[5],
    mapping[0] + mapping[1] + mapping[3] + mapping[5] + mapping[6],
    mapping[0] + mapping[1] + mapping[3] + mapping[4] + mapping[5] + mapping[6],
    mapping[0] + mapping[2] + mapping[5],
    mapping[0] + mapping[1] + mapping[2] + mapping[3] + mapping[4] + mapping[5] + mapping[6],
    mapping[0] + mapping[1] + mapping[2] + mapping[3] + mapping[5] + mapping[6],
  ]                                                                 // Create mappings for [0-9] sorted alphabetically
    .map((d) => [...d].sort().join(''));                            // Index = segments on for that number

  let sum = 0;
  let factor = 1000;
  for (const digit of output) {
    const sorted = [...digit].sort().join('');
    sum += map.indexOf(sorted) * factor;
    factor /= 10;
  }


  return sum;
};

const part2 = (input: string[][][]): number => {
  const entries = input;

  let sum = 0;
  for (const [digits, output] of entries) {
    const mapping = getMapping(digits);
    sum += getOutput(mapping, output);
  }

  return sum;
};

const input = readAllLinesFilterEmpty('./res/2021/input08.txt')
  .map((line) => line.match(LINE_REGEX)!)
  .map((match) => [match.slice(0, 10), match.slice(-4)]);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

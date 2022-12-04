import { readLinesWithRegExp } from '../io.util';

const PAIR_REGEXP = /(\d+)-(\d+),(\d+)-(\d+)/;                                  // (p1.1-p1.2),(p2.1-p2.2)
type Pair = { p1: [number, number], p2: [number, number] };

const fullOverlap = (pair: Pair): boolean =>
  (pair.p1[0] <= pair.p2[0] && pair.p2[1] <= pair.p1[1])                        // p2 fully included in p1
  ||
  (pair.p2[0] <= pair.p1[0] && pair.p1[1] <= pair.p2[1]);                       // p1 fully included in p2
const partialOverlap = (pair: Pair): boolean =>
  pair.p1[1] >= pair.p2[0] && pair.p1[0] <= pair.p2[1];                         // p1 and p2 overlap in at least 1 position

const part1 = (input: Pair[]): number => input.filter(fullOverlap).length;      // Count full overlaps

const part2 = (input: Pair[]): number => input.filter(partialOverlap).length;   // Count partial overlaps

const input = readLinesWithRegExp('./res/2022/day04.txt', PAIR_REGEXP)
  .map(result => (
    {
      p1: [+result[1], +result[2]],
      p2: [+result[3], +result[4]],
    } as Pair
  ));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

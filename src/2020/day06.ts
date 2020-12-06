import { intersect, groupInput, readAllLines } from '../util';

const groupToSizeDistinct = (group: string[]): number =>
    new Set(group
        .reduce((string, current) => string + current, '')
        .split('')).size;

const part1 = (input: string[]): number => groupInput(input)
    .map(groupToSizeDistinct)
    .reduce((sum, x) => sum + x, 0);

const groupToSizeCommon = (groups: string[]): number => groups
    .reduce((c, g) => intersect(c, g.split('')), groups[0].split(''))
    .length;

const part2 = (input: string[]): number => groupInput(input)
    .map(groupToSizeCommon)
    .reduce((sum, x) => sum + x, 0);

const input = readAllLines('./res/2020/input06.txt');
console.log('Distinct answers (part 1):', part1(input));
console.log('Common answers (part 2):', part2(input));

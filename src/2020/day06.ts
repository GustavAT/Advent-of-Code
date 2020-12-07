import { readAllLines } from '../io.util';
import { intersect, union } from '../sets.util';
import { groupInput } from '../util';

const groupUnion = (groups: string[]): string[] =>
    groups.reduce((c, g) => union(c, [...g.split('')]), [] as string[]);

const part1 = (input: string[]): number => groupInput(input)
    .map((g) => groupUnion(g).length)
    .reduce((sum, x) => sum + x, 0);

const groupIntersect = (groups: string[]): string[] =>
    groups.reduce((c, g) => intersect(c, g.split('')), groups[0].split(''));

const part2 = (input: string[]): number => groupInput(input)
    .map((g) => groupIntersect(g).length)
    .reduce((sum, x) => sum + x, 0);

const input = readAllLines('./res/2020/input06.txt');
console.log('Distinct answers (part 1):', part1(input));
console.log('Common answers (part 2):', part2(input));

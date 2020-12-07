import { distinct, readAllLinesFilterEmpty } from '../util';

/**
 * Regexp that matches the following patterns
 * - "1 dotted lavendar bag"
 * - "no other bags"
 * - "4 wavy coral bags"
 */
const BAG_PATTERN = /(\d)?\s?(\w+\s\w+)\sbags?/g;

const createInverseMap = (input: string[]): Record<string, string[]> => {
    const bags: Record<string, string[]> = {};

    for (const line of input) {
        const [key, ...nestedBags] = [...line.matchAll(BAG_PATTERN)];
        nestedBags.forEach((b) => { // add 'key' as value for each nested bag
            bags[b[2]] = bags[b[2]] === undefined ? [key[2]] : [...bags[b[2]], key[2]]; // b[0] full match, b[1] count, b[2] color
        });
    }

    return bags;
}

const getBags = (current: string, rules: Record<string, string[]>): string[] => {
    const bags = rules[current] || [];
    const parentBags = bags.reduce((all, b) => [...all, ...getBags(b, rules)], [] as string[]);

    return [...bags, ...parentBags];
}

const part1 = (input: string[]): number => {
    const rules = createInverseMap(input);
    const allBags = getBags('shiny gold', rules);

    return distinct(allBags).length;
}

const createMap = (input: string[]): Record<string, { count: number, bag: string }[]> => {
    const rules: Record<string, { count: number, bag: string }[]> = {};

    for (const line of input) {
        const [key, ...nestedBags] = [...line.matchAll(BAG_PATTERN)]

        rules[key[2]] = nestedBags
            .filter((b) => b[1] !== undefined) // filter 'no other'
            .map((b) => ({ count: parseInt(b[1]), bag: b[2] })); // b[0] full match, b[1] count, b[2] color
    }

    return rules;
}

const countBags = (rules: Record<string, { count: number, bag: string }[]>, current: string): number => {
    const innerBags = rules[current] || [];

    return innerBags.reduce((sum, b) => sum + b.count * countBags(rules, b.bag), 1); // sum up nested bags
}

const part2 = (input: string[]): number => {
    const rules = createMap(input);

    return countBags(rules, 'shiny gold') - 1;
}

const r = readAllLinesFilterEmpty('./res/2020/input07.txt');
console.log('(part 1):', part1(r));
console.log('(part 2):', part2(r));

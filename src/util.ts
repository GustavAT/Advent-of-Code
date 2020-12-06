import fs from 'fs';

export const readAllLinesFilterEmpty = (path: string): string[] => readAllLines(path)
    .filter((line) => line.length > 0);

export const readAllLines = (path: string): string[] => fs.readFileSync(path, 'utf-8')
    .split('\n');

export const intersect = <T> (a: T[], b: T[]): T[] =>
    a.filter((x) => b.includes(x));

export const groupInput = (input: string[]): string[][] => {
    const groups: string[][] = [];

    let group = [];
    for (const line of input) {
        if (line.length === 0) {
            groups.push(group);
            group = [];
        } else {
            group.push(line);
        }
    }

    return groups;
}

import fs from 'fs';

export const readAllLinesFilterEmpty = (path: string): string[] => readAllLines(path)
    .filter((line) => line.length > 0);

export const readAllLines = (path: string): string[] => fs.readFileSync(path, 'utf-8')
    .split('\n');

export const readAllNumbers = (path: string): number[] =>
    readAllLinesFilterEmpty(path).map((n) => parseInt(n));

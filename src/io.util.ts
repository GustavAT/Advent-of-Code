import fs from 'fs';

export const readAllLinesFilterEmpty = (path: string): string[] => readAllLines(path)
    .filter((line) => line.length > 0);

export const readAllLines = (path: string): string[] => fs.readFileSync(path, 'utf-8')
    .split('\n');

export const readAllNumbers = (path: string): number[] =>
    readAllLinesFilterEmpty(path).map((n) => parseInt(n));

export const readFirstLine = (path: string): string =>
  readAllLines(path)[0];

export const readNumbersFirstLine = (path: string): number[] =>
  readFirstLine(path).split(',').map(Number);

export const readAllNumbers2d = (path: string): number[][] =>
  readAllLinesFilterEmpty(path).map((line) => [...line].map((s) => +s));

export const readLinesWithRegExp = (path: string, regex: RegExp) =>
  readAllLinesFilterEmpty(path)
    .map((line) => line.match(regex)!);

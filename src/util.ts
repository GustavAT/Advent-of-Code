import fs from 'fs';

export type Map = { [key: string]: number };

export const readAllLines = (path: string): string[] => fs.readFileSync(path, 'utf-8')
    .split('\n')
    .filter((line) => line.length > 0);

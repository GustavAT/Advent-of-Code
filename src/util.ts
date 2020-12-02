import fs from 'fs';

export const readAllLines = (path: string): string[] => fs.readFileSync(path, 'utf-8')
    .split('\n')
    .filter((line) => line.length > 0);

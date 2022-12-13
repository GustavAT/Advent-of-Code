import { findPath } from '../a-star.search';
import { sort } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';

const parseGrid = (input: string[]): {
  grid: number[][],
  start: [number, number],
  finish: [number, number],
  alternativeStarts: [number, number][],
} => {
  const width = input[0].length;
  const height = input.length;
  const grid = [...Array(height)].map(() => Array(width));

  let start: [number, number] = [-1, -1];
  let finish: [number, number] = [-1, -1];
  const alternativeStarts: [number, number][] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      let charCode = input[y].charCodeAt(x);
      if (charCode === 83) {
        charCode = 97;
        start = [x, y];
      } else if (charCode === 69) {
        charCode = 122;
        finish = [x, y];
      }

      if (charCode === 97) {
        alternativeStarts.push([x, y]);
      }

      grid[y][x] = charCode - 97;
    }
  }

  return {
    grid,
    start,
    finish,
    alternativeStarts,
  };
};

const costFn = ([x1, y1]: [number, number], [x2, y2]: [number, number], g: number[][]) => {
  const cost = g[y1][x1] - g[y2][x2];
  if (cost < -1) {
    return Number.POSITIVE_INFINITY;
  }

  return 1;
};

const part1 = ({grid, start, finish}: { grid: number[][], start: [number, number], finish: [number, number] }): number => {
  const path = findPath(grid, start, finish, costFn);

  return path.length - 1;
};

const part2 = ({grid, alternativeStarts, finish}: { grid: number[][], alternativeStarts: [number, number][], finish: [number, number] }): number => {
  const costs = [];

  for (const start of alternativeStarts) {
    const path = findPath(grid, start, finish, costFn);
    if (path.length > 0) {
      costs.push(path.length - 1);
    }
  }

  return sort(costs)[0];
};

const input = readAllLinesFilterEmpty('./res/2022/day12.txt');
console.log('part1:', part1(parseGrid(input)));
console.log('part2:', part2(parseGrid(input)));

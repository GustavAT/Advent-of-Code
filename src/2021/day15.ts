import { findPath } from '../a-star.search';
import { readAllNumbers2d } from '../io.util';

const getCosts = (grid: number[][]): number => {
  const from: [number, number] = [0, 0];                                                      // Start position
  const to: [number, number] = [grid[0].length - 1, grid.length - 1];                         // End position
  const costFn = (a: [number, number], b: [number, number], g: number[][]) => g[b[1]][b[0]];  // Cost function to reach A from B
  const path = findPath(grid, from, to, costFn);                                              // Slow A* implementation
  const cost = path.reduce((acc, [x, y]) => acc + grid[y][x], 0);      // Sum costs for path

  return cost - grid[0][0];                                                                   // Remove cost for starting position
};

const multiplyGrid = (grid: number[][], multiplier: number): number[][] => {
  const height = grid.length;

  const newGrid: number[][] = [];

  for (let i = 0; i < height * multiplier; i++) {
    const sourceI = i % height;                     // i: row in new grid, sourceI: row in source grid

    newGrid[i] = [];
    for (let j = 0; j < multiplier; j++) {          // Copy rows
      const values = grid[sourceI]
        .map((v) => v + Math.floor(i / height) + j) // Updated cost = i + j offset in cloned grid
        .map((v) => v > 9 ? v - 9 : v);             // Wrap overflowing costs
      newGrid[i].push(...values);
    }
  }

  return newGrid;
};

const part1 = (input: number[][]): number => getCosts(input);

const part2 = (input: number[][]): number => {
  const grid = multiplyGrid(input, 5);
  
  return getCosts(grid);
};

const input = readAllNumbers2d('./res/2021/input15.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

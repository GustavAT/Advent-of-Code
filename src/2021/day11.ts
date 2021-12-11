import { sum } from '../arrays.util';
import { readAllNumbers2d } from '../io.util';

const getNextFlashes = (grid: number[][]): [number, number][] => {
  const flashes: [number, number][] = [];

  for (const i in grid) {
    for (const j in grid[i]) {                        // Iterate over all cells
      if (grid[i][j] >= 10) {                         // Cell with energy value > 9 will light up
        flashes.push([+i, +j]);
      }
    }
  }

  return flashes;
};

const increaseAdjacent = (grid: number[][], [i, j]: [number, number]): void => {
  const adjacent = [                                  // Adjacent cells relative to given position [i,j]
    [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
    [i, j - 1], [i, j + 1],
    [i + 1, j - 1], [i + 1, j], [i + 1, j + 1],
  ]
    .filter(([gI, gJ]) => grid[gI]?.[gJ]);            // Filter position outside grid and already light up cells (undefined, 0)

  for (const [x, y] of adjacent) {
    grid[x][y] += 1;                                  // Increase adjacent cell by 1
  }
};

const increaseAll = (grid: number[][]): void => {     // Increase all by 1
  for (const line of grid) {
    for (const i in line) {
      line[i] += 1;
    }
  }
};

const simulateStep = (grid: number[][]): number => {
  let count = 0;

  for (; ;) {
    const flashes = getNextFlashes(grid);             // Get positions that light up next

    if (flashes.length === 0) {                       // Grid stabilized
      break;
    }

    count += flashes.length;

    for (const [i, j] of flashes) {
      grid[i][j] = 0;                                 // Reset position that lights up
      increaseAdjacent(grid, [i, j]);                 // Light up adjacent cells
    }
  }

  return count;
};

const part1 = (input: number[][]): number => {
  const grid = input.map((line) => [...line]);        // Deep copy input
  let flashes = 0;

  for (let step = 0; step < 100; step++) {            // Simulate 100 steps
    increaseAll(grid);                                // 1. Increase all by 1
    flashes += simulateStep(grid);                    // 2. Simulate lights
  }

  return flashes;
};

const part2 = (input: number[][]): number => {
  const grid = input.map((line) => [...line]);        // Deep copy input

  for (let step = 0; step < 1000; step++) {           // Try the next 1000 steps
    increaseAll(grid);                                // 1. Increase all by 1
    simulateStep(grid);                               // 2. Simulate lights

    if (sum(grid.map((line) => sum(line))) === 0) {   // Sum of all cells = 0 -> synchronized
      return step + 1;
    }
  }

  return -1;
};

const input = readAllNumbers2d('./res/2021/input11.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

import { readAllLinesFilterEmpty } from '../io.util';
import { toKey } from '../util';

type Grid = Map<string, number>;                                  // Use a map as the grid's coordinates expand to the negative plane

const ADJACENT: [number, number][] = [                            // Adjacent pixels including self. Note: 0/0 = top left
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
];

const parse = (input: string[]): { lookup: string, grid: Grid, bounds: [number, number] } => {
  const size = input[input.length - 1].length;                    // Grid size
  const grid: Grid = new Map();

  for (let i = 1; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      grid.set(toKey(j, i - 1), input[i][j] === '.' ? 0 : 1);     // Map '.' to 0 and '#' to 1 for each pixel in the input grid
    }
  }

  return {lookup: input[0], grid, bounds: [0, size]};
};

const newValue = (
  x: number,
  y: number,
  lookup: string,
  grid: Grid,
  blank: number,
): number => {
  const pixels = ADJACENT                                         // Get all adjacent pixel list
    .map(([aX, aY]) => grid.get(toKey(x + aX, y + aY)) ?? blank)  // Get value of adjacent pixel (0 or 1) or 'blank' value if outside the known grid
    .join('');
  const index = parseInt(pixels, 2);                              // Convert binary to number

  return +(lookup[index] === '#');                                  // Lookup index and convert character back to number (0 or 1)
};

const countLit = (grid: Grid): number => {
  let count = 0;

  for (const [, value] of grid) {
    if (value) {                                                    // Lit pixel has value 1 == truthy value
      count++;
    }
  }

  return count;
};

const simulateStep = (
  lookup: string,
  grid: Grid,
  iteration: number,
  bounds: [number, number],
): { grid: Grid, bounds: [number, number] } => {
  const blank = iteration % 2 ? +(lookup[0] === '#') : 0;           // First and last characters of lookup are '#' and '.' => infinite grid blinks => determine state of unknown pixels of the grid
  const newGrid: Grid = new Map();

  for (let x = bounds[0] - 1; x < bounds[1] + 1; x++) {             // Iterate grid and it's border
    for (let y = bounds[0] - 1; y < bounds[1] + 1; y++) {
      const value = newValue(x, y, lookup, grid, blank);            // Determine and set new value
      newGrid.set(toKey(x, y), value);
    }
  }

  return {grid: newGrid, bounds: [bounds[0] - 1, bounds[1] + 1]};   // Next iteration continues with the border extended by 1
};

const simulate = (input: string[], steps: number): number => {
  let {lookup, grid, bounds} = parse(input);

  for (let step = 0; step < steps; step++) {
    const result = simulateStep(lookup, grid, step, bounds);
    grid = result.grid;
    bounds = result.bounds;
  }

  return countLit(grid);
};

const part1 = (input: string[]): number => simulate(input, 2);

const part2 = (input: string[]): number => simulate(input, 50);

const input = readAllLinesFilterEmpty('./res/2021/input20.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

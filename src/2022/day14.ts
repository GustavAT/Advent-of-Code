import { readAllLinesFilterEmpty } from '../io.util';

const parseWalls = (input: string[]): { grid: string[][]; offset: number } => {
  let bottom = 0;
  let left = 500;
  let right = 500;
  for (const line of input) {             // Find left, right and bottom
    const parts = line.split(' -> ');
    for (let i = 0; i < parts.length; i++) {
      const [x, y] = parts[i].split(',')  // Current pair to x,y
        .map(Number);
      if (y > bottom) {                   // Expand to right
        bottom = y;
      }
      if (x < left) {                     // Expand to left
        left = x;
      }
      if (x > right) {                    // Expand to right
        right = x;
      }
    }
  }

  const ground = bottom + 2;              // Bottom row is 2 below bottom wall
  const width = ground * 2 + 1;           // 1 extra for the middle
  const grid = [...Array(ground + 1)].map(() => Array(width)
    .fill(''));
  grid[ground].fill('#');                 // Fill bottom row

  const offset = 500 - ground;

  for (const line of input) {
    const parts = line.split(' -> ');
    for (let i = 0; i < parts.length - 1; i++) {
      const [x1, y1] = parts[i].split(',')
        .map(Number);
      const [x2, y2] = parts[i + 1].split(',')
        .map(Number);
      if (x1 === x2) {                    // Vertical wall
        const start = Math.min(y1, y2);   // Start/From is the smaller coordinate
        const end = Math.max(y1, y2);     // End/To is the bigger coordinate
        for (let j = start; j <= end; j++) {
          grid[j][x1 - offset] = '#';
        }
      }
      if (y1 === y2) {                    // Horizontal wall
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let j = start; j <= end; j++) {
          grid[y1][j - offset] = '#';
        }
      }
    }
  }

  return {grid, offset: ground};
};

const simulate = (grid: string[][], offset: number): [number, number] => {
  let units = 1;                                        // Units of sand on the grid
  let unitsOnWalls = -1;                                // Units of sand on the wall (before bottom row fills up)
  let unitPos = [offset, 0];                            // Sand spawn
  grid[0][offset] = 'o';
  for (; ;) {
    const [x, y] = unitPos;
    if (y >= grid.length - 2 && unitsOnWalls === -1) {  // (part 1): First unit falls on the bottom row
      unitsOnWalls = units - 1;                         // -1 as last sand falls off
    }

    if (grid[y + 1][x] === '') {                        // Fall down, below is free
      grid[y][x] = '';
      grid[y + 1][x] = 'o';
      unitPos = [x, y + 1];
    } else if (grid[y + 1][x - 1] === '') {             // Fall to the left, below is occupied
      grid[y][x] = '';
      grid[y + 1][x - 1] = 'o';
      unitPos = [x - 1, y + 1];
    } else if (grid[y + 1][x + 1] === '') {             // Fall to the right, below and left is occupied
      grid[y][x] = '';
      grid[y + 1][x + 1] = 'o';
      unitPos = [x + 1, y + 1];
    } else {                                            // Spawn new sand
      if (grid[0][offset] === 'o') {                    // Sand fills to the top
        break;
      }
      unitPos = [offset, 0];                            // Reset sand spawn and increment units
      grid[0][offset] = 'o';
      units++;
    }
  }

  return [unitsOnWalls, units];
};

const part1 = (result: [number, number]): number => result[0];

const part2 = (result: [number, number]): number => result[1];

const {grid, offset} = parseWalls(readAllLinesFilterEmpty('./res/2022/day14.txt'));
const result = simulate(grid, offset);
console.log('part1:', part1(result));
console.log('part2:', part2(result));

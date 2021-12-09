import { product, sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';

const adjacent = (i: number, j: number): [number, number][] => ([
  [i - 1, j],
  [i, j + 1],
  [i + 1, j],
  [i, j - 1],
]);

const isLowest = (grid: number[][], i: number, j: number): boolean => {
  if (grid[i][j] === 9) {                                     // 9 cannot be the lowest number
    return false;
  }

  return adjacent(i, j)
    .every(([aI, aJ]) => (grid[aI]?.[aJ] ?? 9) > grid[i][j]); // Adjacent numbers must be smaller, 9 is assigned to off-grid numbers
};

const getDepths = (grid: number[][]): [number, number][] => {
  const lowest: [number, number][] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (isLowest(grid, i, j)) {
        lowest.push([i, j]);                                  // Current number is the lowest
        j++;                                                  // Skip next number as it cannot be the lowest
      }
    }
  }

  return lowest;
};

/**
 * Expand the basin around a given start point and count it's fields.
 * @param grid Gird
 * @param start Start position
 */
const expand = (grid: number[][], start: [number, number]): any => {
  const queue: [number, number][] = [start];                  // Positions not checked yet
  const seen: [number, number][] = [];                        // Visited positions

  while (queue.length > 0) {
    const [i, j] = queue.shift()!;                            // Pop first element in queue

    if (seen.some(([sI, sJ]) => sI === i && sJ === j)) {      // Element was already visited, skip iteration
      continue;
    }

    seen.push([i, j]);                                        // Mark current position as seen

    const unseen = adjacent(i, j)                             // Get adjacent positions
      .filter(([aI, aJ]) => {
        const n = grid[aI]?.[aJ] ?? 9;                        // Position must be greater than current
        return n > grid[i][j] && n !== 9;                     // Position must not equal 9
      });

    queue.push(...unseen);                                    // Add new positions to the queue. The queue could contain duplicates at this point
  }

  return seen.length;
};

const part1 = (input: number[][]): number => {
  const riskLevels = getDepths(input)
    .map(([i, j]) => input[i][j] + 1);                        // Add 1 to each lowest point

  return sum(riskLevels);
};

const part2 = (input: number[][]): number => {
  const basins = getDepths(input)
    .map((d) => expand(input, d))                             // Expand each lowest point and count
    .sort((a, b) => a - b)                                    // Sort ascending
    .splice(-3);                                              // Get 3 biggest basins

  return product(basins);
};

const input = readAllLinesFilterEmpty('./res/2021/input09.txt')
  .map((line) => line.split('')
    .map(Number));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

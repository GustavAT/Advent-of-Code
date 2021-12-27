import { readAllLinesFilterEmpty } from '../io.util';
import { fromKey, toKey } from '../util';

type NextFn = (i: number, j: number) => [number, number];

const parse = (grid: string[][]): { cucumbers: Map<string, string>, bounds: [number, number] } => {
  const bounds: [number, number] = [grid[0].length, grid.length];
  const cucumbers = new Map<string, string>();                  // Map holding cucumber positions

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j];
      if (cell !== '.') {
        cucumbers.set(toKey(i, j), cell);                       // Skip empty '.' positions
      }
    }
  }

  return {cucumbers, bounds};
};

const move = (
  cucumbers: Map<string, string>,                               // Current cucumbers
  direction: '>' | 'v',                                         // Direction to move: right or down
  nextFn: NextFn,                                               // Function to determine next position of a cucumber
): { cucumbers: Map<string, string>, hasMoved: boolean } => {
  const newCucumbers = new Map<string, string>();
  let hasMoved = false;

  for (const [key, value] of cucumbers) {
    if (value === direction) {                                  // Move cucumbers of given direction
      const [i, j] = fromKey(key);
      const next = toKey(...nextFn(i, j));                      // Position where cucumber would move

      if (cucumbers.has(next)) {                                // Next position is occupied by other cucumber
        newCucumbers.set(key, value);                           // Don't move current cucumber
      } else {
        newCucumbers.set(next, value);                          // Move current cucumber to empty position
        hasMoved = true;
      }
    } else {
      newCucumbers.set(key, value);                             // Other cucumbers
    }
  }

  return {cucumbers: newCucumbers, hasMoved};
};

const nextRight = (width: number): NextFn => {                  // Determine next position of cucumbers moving right
  return (i, j) => [i, (j + 1) % width];                        // Wrap around right edge
};

const nextDown = (height: number): NextFn => {                  // Determine next position of cucumbers moving down
  return (i, j) => [(i + 1) % height, j];                       // Wrap around bottom edge
};

const part1 = (input: string[][]): number => {
  let {cucumbers, bounds} = parse(input);
  const nextRightFn = nextRight(bounds[0]);
  const nextDownFn = nextDown(bounds[1]);

  let hasMoved = true;
  let i = 0;

  while (hasMoved) {
    let rightMove = move(cucumbers, '>', nextRightFn);          // Move right first
    let downMove = move(rightMove.cucumbers, 'v', nextDownFn);  // Move down afterwards

    cucumbers = downMove.cucumbers;
    hasMoved = rightMove.hasMoved || downMove.hasMoved;         // Continue if cucumbers moved right or down
    i++;
  }


  return i;
};

const input = readAllLinesFilterEmpty('./res/2021/input25.txt')
  .map((line) => line.split(''));
console.log('part1:', part1(input));

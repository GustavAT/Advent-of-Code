import { sum } from '../arrays.util';
import { readAllLines } from '../io.util';
import { groupInput, transpose } from '../util';

const WHITESPACE_REGEX = /\s+/;                     // All whitespace characters (space, tab, newline)

const parseInput = (input: string[]): { numbers: number[], boards: number[][][] } => {
  const numbers = input[0]                          // First row contains numbers
    .split(',')
    .map((n) => +n);

  const boards = groupInput(input.slice(2))         // Parse bingo boards starting at line 3
    .map((board) =>
      board.map((line) =>                           // Iterate each board
        line
          .split(WHITESPACE_REGEX)                  // Split by spaces
          .filter((n) => n !== '')
          .map((n) => +n)));

  return {numbers, boards};
};

const markBoard = (board: number[][], number: number): void => {
  board.forEach((row) => {                          // Iterate rows
    const index = row.indexOf(number);

    if (index > -1) {                               // Found target number
      row[index] = -1;                              // Mark with -1
      return;                                       // Number is unique per bingo board
    }
  });
};

const getScore = (board: number[][]): number => {
  const bingo = [...board, ...transpose(board)]     // Transpose to get columns as rows
    .some((row) => sum(row) === -5);                // Bingo rows/columns only have -1s

  if (bingo) {
          const numbers = board
            .flat()
            .filter((n) => n > -1);                 // Sum all numbers except marked ones

          return sum(numbers);
  }

  return -1;                                        // Not yet bingo
};

const part1 = (input: string[]): number => {
  const {numbers, boards} = parseInput(input);

  for (const n of numbers) {
    for (const i in boards) {
      const board = boards[i];
      markBoard(board, n);

      const score = getScore(board);
      if (score > -1) {
        return score * n;                           // First board to reach bingo = board with score > -1
      }
    }
  }

  return -1;
};

const part2 = (input: string[]): number => {
  let {numbers, boards} = parseInput(input);

  for (const n of numbers) {
    const boardsToRemove = [];                      // Indices of boards that have bingo and will get removed after the current iteration

    for (const i in boards) {
      const board = boards[i];
      markBoard(board, n);

      const score = getScore(board);
      if (score > -1) {
        if (boards.length > 1) {                    // Still boards left, keep removing boards
          boardsToRemove.push(+i);
        } else {
          return score * n;                         // Last winning board
        }
      }
    }

    for (let i = boardsToRemove.length; i-- > 0;) {
      boards.splice(boardsToRemove[i], 1);          // Remove boards with bingo
    }
  }

  return -1;
};

const input = readAllLines('./res/2021/input04.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

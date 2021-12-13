import { readAllLines } from '../io.util';
import { distinct } from '../sets.util';
import { toKey } from '../util';

const LINE_REGEX = /fold\salong\s(\w)=(\d+)/;

const parse = (input: string[]): [[number, number][], [string, number][]] => {
  const dots: [number, number][] = [], instructions: [string, number][] = [];

  let i = 0;
  for (; ; i++) {
    if (input[i] === '') {                                // Dot coords until first line break
      i++;
      break;
    }

    const [x, y] = input[i].split(',');                   // x, y
    dots.push([+x, +y]);
  }

  for (; i < input.length - 1; i++) {                     // Instructions after first line break
    const [, pos, value] = input[i].match(LINE_REGEX)!;   // fold along (x/y)=value
    instructions.push([pos, +value]);
  }

  return [dots, instructions];
};

const fold = (dots: [number, number][], [pos, value]: [string, number]): void => {
  for (let i = dots.length - 1; i >= 0; i--) {
    if (pos === 'x' && dots[i][0] > value) {              // Fold is along x-axis
      dots[i][0] = 2 * value - dots[i][0];                // Project x to other half of the paper
    } else if (pos === 'y' && dots[i][1] > value) {       // Fold is along y-axis
      dots[i][1] = 2 * value - dots[i][1];                // Project y to other half of the paper
    }
  }
};

const part1 = (input: string[]): number => {
  const [dots, instructions] = parse(input);

  fold(dots, instructions[0]);                            // First fold

  return distinct(dots.map((d) => toKey(...d))).length;   // Count distinct coordinates = dots visible
};

const part2 = (input: string[]): string => {
  const [dots, instructions] = parse(input);

  for (const instruction of instructions) {
    fold(dots, instruction);
  }

  const width = Math.min(...instructions                  // Width is size of last fold in x direction
    .filter(([pos]) => pos === 'x')
    .map(([, v]) => v));
  const height = Math.min(...instructions                 // Height is size of last fold in y direction
    .filter(([pos]) => pos === 'y')
    .map(([, v]) => v));

  const code = [...Array(height)]
    .map(() => [...Array(width)].map(() => ' '));         // Initialize empty 2d array for our code
  for (const [x, y] of dots) {
    code[y][x] = '#';                                     // Mark each dot
  }

  return '\n' + code
    .map((line) => line.join(''))                         // Beatify code
    .join('\n');
};

const input = readAllLines('./res/2021/input13.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

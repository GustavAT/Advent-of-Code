import { readAllLines } from '../io.util';

const MOVE_REGEXP = /move\s(\d+)\sfrom\s(\d+)\sto\s(\d+)/;
type Move = { count: number, from: number, to: number };

const parseInput = (input: string[]): { stacks: string[][]; moves: Move[] } => {
  let separator = -1;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      separator = i;
      break;
    }
  }

  const stackCount = (input[0].length + 1) / 4;                       // Each stacks takes 3 chars + 1 space
  const stacks: string[][] = [...Array(stackCount)].map(() => []);
  for (let i = 0; i < separator - 1; i++) {
    const line = input[i];
    for (let j = 0; j < stackCount; j++) {
      const current = line[j * 4 + 1];
      if (current != ' ') {                                           // Advance by offset and check if not empty
        stacks[j].push(current);
      }
    }
  }

  stacks.map((stack) => stack.reverse());                             // Could be skipped

  const moves = input
    .slice(separator + 1, input.length - 1)
    .map((line) => line.match(MOVE_REGEXP))
    .map((matches) => ({
      count: +matches![1],
      from: +matches![2],
      to: +matches![3],
    }));

  return {
    stacks,
    moves,
  };
};

const rearrange = (stacks: string[][], moves: Move[], reverse: boolean): string => {
  for (let i = 0; i < moves.length; i++) {
    const {count, from, to} = moves[i];

    const source = stacks[from - 1];                                  // Source stack
    const crates = source.splice(source.length - count, count);       // Remove top X from source stack
    if (reverse) {                                                    // Put crates back in reverse order
      crates.reverse();
    }
    stacks[to - 1].push(...crates);                                   // Put crates back onto target stack
  }

  return stacks
    .map((stack) => stack[stack.length - 1])                          // Get top crate of each stack
    .join('');
};

const part1 = (input: string[]): string => {
  const {stacks, moves} = parseInput(input);

  return rearrange(stacks, moves, true);
};

const part2 = (input: string[]): string => {
  const {stacks, moves} = parseInput(input);

  return rearrange(stacks, moves, false);
};

const input = readAllLines('./res/2022/day05.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

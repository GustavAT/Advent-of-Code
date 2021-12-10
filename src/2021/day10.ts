import { reverse, sort, sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';

const SCORES_P1: Record<string, number> = {')': 3, ']': 57, '}': 1197, '>': 25137};
const SCORES_P2: Record<string, number> = {'(': 1, '[': 2, '{': 3, '<': 4};
const CLOSING: Record<string, string> = {'(': ')', '[': ']', '{': '}', '<': '>'};

const validate = (line: string): [string | undefined, string[]] => {
  const stack = [];                                     // Use a stack to validate brackets

  for (const c of [...line]) {
    if ('([{<'.includes(c)) {                           // Put opening brackets on the stack
      stack.push(c);
    } else {                                            // Found a closing bracket
      const expected = stack.pop()!;                    // Pop last opening bracket from stack
      if (c !== CLOSING[expected]) {                    // No match: invalid bracket-string
        return [c, stack];                              // Return invalid bracket character with stack
      }
    }
  }

  return [undefined, stack];                            // Closing brackets match opening brackets, stack contains remaining opening brackets
};

const getScoreP2 = (stack: string[]): number =>
  reverse(stack)
    .reduce((score, c) => score * 5 + SCORES_P2[c], 0); // score = score * 5 + bracket_score

const part1 = (input: string[]): number => {
  const scores = input.map((line) => validate(line))    // Validate each line
    .filter(([c]) => c !== undefined)                   // Filter invalid lines
    .map(([c]) => SCORES_P1[c!]);                       // Calculate score

  return sum(scores);
};

const part2 = (input: string[]): number => {
  const scores = input.map((line) => validate(line))    // Validate each line
    .filter(([c]) => c === undefined)                   // Filter valid lines
    .map(([, stack]) => getScoreP2(stack));             // Calculate score
  const middle = Math.floor(scores.length / 2);

  return sort(scores)[middle];                          // Sort by score and return the middle element
};

const input = readAllLinesFilterEmpty('./res/2021/input10.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

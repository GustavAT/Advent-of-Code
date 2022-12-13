import { sort } from '../arrays.util';
import { readAllLines } from '../io.util';
import { groupInput } from '../util';

type Monkey = {
  id: number,
  items: number[],
  divisor: number,
  success: number,
  failed: number,
  operation: (x: number) => number,
};

const parseMonkey = (group: string[]): Monkey => {
  const id = +group[0].charAt(group[0].length - 2);
  const items = group[1]
    .split(':')[1]
    .trim()
    .split(', ')
    .map((x) => +x);
  const [op1, operation, op2] = group[2].split('=')[1].trim()
    .split(' ');
  const divisor = +group[3].split('by')[1].trim();
  const success = +group[4].charAt(group[4].length - 1);
  const failed = +group[5].charAt(group[5].length - 1);

  return {
    id,
    items,                                                      // items the monkey is currently holding
    operation: (old) => {                                       // Function that performs the calculation
      const left = op1 === 'old' ? old : +op1;
      const right = op2 === 'old' ? old : +op2;
      return operation === '+'
        ? left! + right!
        : left! * right!;
    },
    divisor,
    success,                                                    // Monkey id if the condition holds
    failed,                                                     // Monkey id if the condition fails
  };
};

const simulateMonkeys = (monkeys: Monkey[], iterations: number, reduceFn: (x: number) => number): number => {
  const inspections = [...Array(monkeys.length).fill(0)];

  for (let turn = 0; turn < iterations; turn++) {               // Iterate all turns
    for (const monkey of monkeys) {                             // Iterate each monkey
      while (monkey.items.length > 0) {                         // Iterate all items the monkey currently holds
        inspections[monkey.id]++;                               // Monkey inspects an item
        const current = monkey.items.shift()!;
        let result = monkey.operation(current);                 // Perform calculation
        result = reduceFn(result);                              // Apply function to reduce result (depends on part 1/2)

        if (result % monkey.divisor === 0) {                    // Check for condition
          monkeys[monkey.success].items.push(result);           // Add item to next monkey
        } else {
          monkeys[monkey.failed].items.push(result);
        }
      }
    }
  }

  const sorted = sort(inspections);                             // Sort by number of inspections

  return sorted[sorted.length - 1] * sorted[sorted.length - 2]; // Take top 2 counts
}

const part1 = (input: string[][]): number => {
  const monkeys = input.map((group) => parseMonkey(group));
  const reduceFn = (x: number) => Math.floor(x / 3);            // Divide by 3 after each inspection
  return simulateMonkeys(monkeys, 20, reduceFn);
};

const part2 = (input: string[][]): number => {
  const monkeys = input.map((group) => parseMonkey(group));
  const factor = monkeys.reduce(
    (value, current) => value * current.divisor,                // Calculate greatest common divisor (GCD)
    1,                                                          // Monkey divisors happen to be primes
  );
  const reduceFn = (x: number) => x % factor;                   // Modulo result by GCD to reduce result and not bias upcoming monkey decisions

  return simulateMonkeys(monkeys, 10_000, reduceFn);
};

const input = groupInput(readAllLines('./res/2022/day11.txt'));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

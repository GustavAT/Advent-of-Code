import { sum } from '../arrays.util';
import { readNumbersFirstLine } from '../io.util';

const simulate = (fish: number[], days: number): number => {
  let groups = [...Array(9)].map(() => 0);
  fish.forEach((fish) => groups[fish] += 1);                // Group fish by their spawn rate

  for (let day = 0; day < days; day++) {
    groups = [...groups.slice(1), ...groups.slice(0, 1)];   // Advance by 1 day: shift fish by 1 to left
    groups[6] += groups[8];                                 // Fish at day 6 are reset: increase by the number of new fish
    // groups[(day + 7) % 9] = groups[day % 9];             // Alternative: Spawn rate = index shifts. Fish with 0 days left to spawn = [day % 9]
  }

  return sum(groups);
};

const part1 = (input: number[]): number => simulate(input, 80);

const part2 = (input: number[]): number => simulate(input, 256);

const input = readNumbersFirstLine('./res/2021/input06.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

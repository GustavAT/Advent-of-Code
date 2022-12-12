import {  readAllLinesFilterEmpty } from '../io.util';

const simulateProgram = (instructions: string[]): number => {
  const screen = [...Array(6)].map(() => Array(40).fill('.'));        // Screen 6x40
  let screenLineIndex;                                                // Current CRT line
  let litPixel = 1;                                                   // Index of lit pixel 0 - 239

  let cycle = 1;                                                      // Current cycle
  let counter = 1;                                                    // Register
  let result = 0;                                                     // Result (part 1)

  for (const instruction of instructions) {
    if ((cycle - 20) % 40 === 0) {                                    // Every 40th instruction counts (part 1)
      result += cycle * counter;
    }

    screenLineIndex = Math.floor((cycle - 1) / 40);                   // Update CRT line
    litPixel = (cycle - 1) % 40;                                      // Lit pixel within CRT line
    if ([counter - 1, counter, counter + 1].includes(litPixel)) {     // 3 pixels starting from counter can be lit
      screen[screenLineIndex][litPixel] = '#';                        // Lit pixel
    }

    if (instruction.startsWith('addx')) {                             // Ignore noop, addx special treatment
      cycle++;                                                        // Increment cycle

      screenLineIndex = Math.floor((cycle - 1) / 40);                 // Same as before
      litPixel = (cycle - 1) % 40;
      if ([counter - 1, counter, counter + 1].includes(litPixel)) {
        screen[screenLineIndex][litPixel] = '#';
      }

      const count = +instruction.split(' ')[1];                       // Get count

      if ((cycle - 20) % 40 === 0) {                                  // Check in-between cycle (same as before)
        result += counter * cycle;
      }

      counter += count;                                               // Increase counter
    }

    cycle++;                                                          // Increment cycle
  }

  console.table(screen.map((line) => line.join('')));                 // Print screen (part 2)

  return result;
};

const part1 = (input: string[]): number => {
  return simulateProgram(input);
};

const input = readAllLinesFilterEmpty('./res/2022/day10.txt');
console.log('part1:', part1(input));

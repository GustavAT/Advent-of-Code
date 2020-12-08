import { readAllLinesFilterEmpty } from "../io.util";

type Instruction = { op: string; arg: number };

const parseInstructions = (input: string[]): Instruction[] => input.map((line) => {
    const [op, arg] = line.split(' ');

    return { op, arg: parseInt(arg) };
});

const execute = (programm: Instruction[], failIfLoop: boolean): number => {
    const visited = new Set();
    let pc = 0;                                 // Programm counter
    let acc = 0;                                // Accumulator

    while (pc < programm.length) {              // Terminte if end of programm is reached
        if (visited.has(pc)) {                  // Loop detected
            return failIfLoop ? NaN : acc;      // Part1: return acc; Part2: return NaN
        }
        visited.add(pc);

        const { op, arg } = programm[pc];
        if (op === 'acc') {
            acc += arg;
            pc++;
        } else if (op === 'jmp') {
            pc += arg;
        } else {
            pc++;
        }
    }

    return acc;
}

const part1 = (programm: Instruction[]): number =>
    execute(programm, false);                   // Execute programm, return 'acc' if loop detected

const part2 = (programm: Instruction[]): number => {
    for (let i = 0; i < programm.length; i++) {
        const { op, arg } = programm[i];

        if (op === 'acc') {                     // Skip 'acc' instructions
            continue;
        }

        programm[i] = {
            op: op === 'jmp' ? 'nop' : 'jmp',   // Swap 'jmp' with 'nop' instructions
            arg,
        };

        const acc = execute(programm, true);    // Execute modified programm
        if (!isNaN(acc)) {                      // Terminated successfully
            return acc;
        }

        programm[i] = { op, arg };              // Loop detected; restore old instruction
    }

    return -1;
}

const input = readAllLinesFilterEmpty('./res/2020/input08.txt');
const programm = parseInstructions(input);
console.log('Accumulator value (part 1):', part1(programm));
console.log('Accumulator value (part 2):', part2(programm));

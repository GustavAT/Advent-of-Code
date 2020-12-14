import { readAllLinesFilterEmpty } from '../io.util';

const MASK_REGEX = /mask\s=\s([01X]+)/;         // Pattern: 'mask = (1 | 0 | X)+'
const MEM_REGEX = /mem\[(\d+)\]\s=\s(\d+)/;     // Patterns: 'mem[(NUMBER+)] = (NUMBER+)'

type WriteToMemoryFn = (mem: Record<number, number>, mask: string, address: number, value: number) => void;

const applyMask = (mask: string, value: number, ignore: string): string => {
    const number = Math.abs(value)
        .toString(2)                            // Convert to binary string representation 
        .padStart(mask.length, '0')             // Pad left with '0' to fill up to mask's length
        .split('');

    for (let i = 0; i < mask.length; i++) {
        if (mask[i] !== ignore) {               // Ignored characters will leave the number untouched
            number[i] = mask[i];
        }
    }

    return number.join('');
}

const writeMemory = (input: string[], writeToMemory: WriteToMemoryFn): number => {
    const mem: Record<string, number> = {};

    let mask = '';
    for (const line of input) {                             // Generic algorithm; uses given function to write to memory
        const maskMatch = line.match(MASK_REGEX);

        if (maskMatch) {
            mask = maskMatch[1];                            // Line that specifies a mask
        } else {
            const memMatch = line.match(MEM_REGEX)!;        // Guaranteed memory instruction
            const address = parseInt(memMatch[1]);
            const value = parseInt(memMatch[2]);
            writeToMemory(mem, mask, address, value);       // Write to memory
        }
    }

    return Object.keys(mem).reduce((sum, key) => sum + mem[key], 0);
}

const writeToMemory1 = (mem: Record<number, number>, mask: string, address: number, value: number): void => {
    const maskedValue = applyMask(mask, value, 'X');    // Apply mask to value ignoring 'X'
    mem[address] = parseInt(maskedValue, 2);            // Write to memory
}

const part1 = (input: string[]): number => {
    return writeMemory(input, writeToMemory1);
}

const generateAddresses = (value: string): string[] => {    // Recursively replace all 'X' by '1' and '0'
    if (!value.includes('X')) {                             // All 'X' replaced, return value
        return [value];
    }

    return [
        ...generateAddresses(value.replace('X', '0')),      // Replace 'X' by 0
        ...generateAddresses(value.replace('X', '1')),      // Replace 'X' by 1
    ];
}

const writeToMemory2 = (mem: Record<number, number>, mask: string, address: number, value: number): void => {
    const maskedAddress = applyMask(mask, address, '0');    // Apply mask ignoring '0'
    generateAddresses(maskedAddress)                        // Generate all addresses by replacing 'X' with '1' and '0'
        .map((addr) => parseInt(addr, 2))                   // Map binary number string to number
        .forEach((addr) => mem[addr] = value);              // Write to memory
}

const part2 = (input: string[]): number => {
    return writeMemory(input, writeToMemory2);
}

const input = readAllLinesFilterEmpty('./res/2020/input14.txt');
console.log('Sum:', part1(input));
console.log('Sum:', part2(input));

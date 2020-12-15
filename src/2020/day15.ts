import { readAllLinesFilterEmpty } from '../io.util';

const parseInput = (input: string[]): number[] =>
    input[0].split(',').map((n) => parseInt(n));

/**
 * Computes n-th number in the Van Eck sequence A181391 for given seed numbers.
 * If m < n such that a(m) = a(n) then a(n + 1) = n - m
 * otherwise a(n + 1) = 0
 * 
 * This implementation uses Map to store last seen indices.
 * Using an array to store the sequence would be too slow and memory consuming.
 */
const computeVanEck = (seed: number[], n: number): number => {
    const lastSeen = new Map();                             // Last-seen indices for each number
    let successor = -1;

    for (let i = 0; i < n - 1; i++) {
        const current = i < seed.length                     // Edge case for seed numbers
            ? seed[i]                                       // Use seed number
            : successor!;                                   // Use number from last turn
        successor = lastSeen.get(current) === undefined     // Number already seen?
            ? 0                                             // No: Use '0'
            : i - lastSeen.get(current);                    // Yes: Calculate successor
        lastSeen.set(current, i);                           // Set current index as last seen
    }

    return successor;
}

const part1 = (input: string[]): number =>
    computeVanEck(parseInput(input), 2020);

const part2 = (input: string[]): number =>
    computeVanEck(parseInput(input), 30000000);

const input = readAllLinesFilterEmpty('./res/2020/input15.txt');
console.log('Sum:', part1(input));
console.log('Sum:', part2(input));

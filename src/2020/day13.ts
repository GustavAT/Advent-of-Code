import { readAllLinesFilterEmpty } from '../io.util';
import { extendedEuclid } from '../util';

type Notes = { time: number; buses: number[] };

const parseInput1 = (input: string[]): Notes =>
    ({
        time: parseInt(input[0]),
        buses: input[1].split(',').filter((bus) => bus !== 'x').map((bus) => parseInt(bus)),
    })

const part1 = (input: string[]): number => {
    const notes = parseInput1(input);

    const minTime = notes.buses
        .map((bus) => [bus - notes.time % bus, bus])                                    // Map to [waiting time, bus]
        .reduce((min, c) => c[0] < min[0] ? c : min, [Number.POSITIVE_INFINITY, -1]);   // Minimum waiting time

    return minTime[0] * minTime[1];
}

const parseInput2 = (input: string[]): [number, number][] =>
    input[1]
        .split(',')                                             // Split for each bus
        .map((bus, idx) => [bus, idx] as [string, number])      // Map to [bus, index]
        .filter(([busNr, _]) => busNr !== 'x')                  // Filter not known bus-line 'x'
        .map(([nr, index]) => {
            const busNr = parseInt(nr);                         
            const mod = (busNr - index) % busNr;                // Calculate remainder

            return [busNr, mod < 0 ? mod + busNr : mod];        // Make remainder positive
        });

/**
 * Solve using the Chinese Reminder Theorem
 * 
 * x = a (mod m)
 * <=>
 * a = (bus - index) % bus
 * m = bus
 * x = (bus - index) % bus (mod bus)   // for all busses
 * 
 * For each bus calculate:
 * M = product(m)   <=> product(bus)
 * Mi = M / m       <=> M / bus
 * r*m + s*Mi = 1   <=> r*bus + s*Mi
 * e = s*Mi
 * 
 * x = sum(a*e)   <=> sum((bus - index) % bus * e) // for all buses
 * 
 * time = x % M
 * 
 * @param input input
 */
const part2 = (input: string[]): bigint => {                                // Solve using CRT
    const mods = parseInput2(input);                                        // Map input to [bus (m), bus - index (a)];
    const M = mods.reduce((product, [m, _]) => product * BigInt(m), 1n);    // Product of all mods
    let sum = 0n;

    for (const [m, a] of mods) {
        const Mi = M / BigInt(m);

        const [_, __, s] = extendedEuclid(BigInt(m), BigInt(Mi));
        const e = s * Mi;

        sum += e * BigInt(a);
    }

    const time = sum % M;

    return time < 0 ? time + M : time;
}

const input = readAllLinesFilterEmpty('./res/2020/input13.txt');
console.log('Earliest:', part1(input));
console.log('Earliest:', part2(input));

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

const parseInput2 = (input: string[]): [bigint, bigint][] =>
    input[1]
        .split(',')                                             // Split for each bus
        .map((bus, idx) => [bus, idx] as [string, number])      // Map to [bus, index]
        .filter(([busNr]) => busNr !== 'x')                     // Filter not known bus-line 'x'
        .map(([nr, index]) => {
            const busNr = BigInt(nr);
            const mod = (busNr - BigInt(index)) % busNr;        // Calculate remainder

            return [busNr, mod < 0 ? mod + busNr : mod];        // Make remainder positive
        });

/**
 * Solve using the Chinese Reminder Theorem
 * 
 * x ≡ a (mod m)
 * 
 * M = ∏(m)
 * 
 * // for each m do:
 * M` = M / m
 * r*m + s*M` = 1       // Use extended euclid to find two integers r, s
 * e = s*M`             // Substitute s*M` by e
 * 
 * x` = ∑(a*e)
 * x` ≡ x (mod M)
 * 
 * Using:
 * a = (bus - index) % bus
 * m = bus
 * x = time
 * 
 * @param input input
 */
const part2 = (input: string[]): bigint => {
    const mods = parseInput2(input);                                        // Map input to [m, a];
    const M = mods.reduce((product, [m, _]) => product * m, 1n);            // Calculate M
    let x = 0n;

    for (const [m, a] of mods) {
        const Mi = M / m;
        const [, , s] = extendedEuclid(m, Mi);                              // Use extended euclid to calculate r,s
        const e = s * Mi;                                                   // Substitue s*M` by e

        x += e * a;
    }

    const time = x % M;                                                     // x ≡ time (mod M)

    return time < 0 ? time + M : time;                                      // Add M if time is negative
}

const input = readAllLinesFilterEmpty('./res/2020/input13.txt');
console.log('Earliest:', part1(input));
console.log('Earliest:', part2(input));

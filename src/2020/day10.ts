import { readAllNumbers } from "../io.util";

const part1 = (input: number[]): number => {
    input.sort((a, b) => a - b);                        // Sort input ascending
    const diffs = [0, 1, 0, 1];                         // Store diff counts; [1] = 1 for first element [3] = 1 for last element (diff 3)

    for (let i = 1; i < input.length; i++) {
        diffs[input[i] - input[i - 1]]++;               // Store diff between two consective numbers (either 1, 2 or 3)
    }

    return diffs[1] * diffs[3];
}

const part2 = (input: number[]): number => {
    input.sort((a, b) => a - b);                        // Sort input ascending
    const waysTo: Record<number, number> = { 0: 1 };    // Store number of ways to each number; start with 0 (1 way to reach 0) 

    for (let i = 0; i < input.length; i++) {            // Using dynamic programming
        const number = input[i];
        waysTo[number] =                                // A jolt is reach by three previous jolts
            (waysTo[number - 1] || 0) +                 // Example: jolt 10 is reachable by 9, 8 and 7
            (waysTo[number - 2] || 0) +                 // Sum number of ways to all previous jolts = waysTo[9] + waysTo[8] + waysTo[7]
            (waysTo[number - 3] || 0);                  // If a jolt is not existing, e.g. 8: add 0: waysTo[9] + 0 + waysTo[7]
    }

    return waysTo[input[input.length - 1]];             // Number of ways to your jolt (last element in numbers)
}

const input = readAllNumbers('./res/2020/input10.txt');
console.log('Invalid (part 1):', part1(input));
console.log('Invalid (part 2):', part2(input));

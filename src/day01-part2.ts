// --- Part Two ---
// The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

// Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

// In your expense report, what is the product of the three entries that sum to 2020?

import fs from 'fs';

// Read input file and parse all strings to number
const input = fs.readFileSync('./res/input01.txt', 'utf-8')
    .split('\n')
    .map((numberStr) => parseInt(numberStr));

let result: number | undefined = undefined;

for (let i = 0; i < input.length - 2; i++) {
    for (let j = i + 1; j < input.length - 1; j++) {
        for (let k = j + 1; k < input.length; k++) {
            if (input[i] + input[j] + input[k] === 2020) {
                result = input[i] * input[j] * input[k];

                i = input.length;
                j = input.length;
                break;
            }
        }
    }
}

console.log(result);

import { readAllLinesFilterEmpty } from "../util";

const calc = (input: string, min: number, max: number): number => {
    if (min === max) {
        return min;
    }

    // take lower half
    if (input[0] === 'F' || input[0] === 'L') {
        return calc(input.substr(1), min, min + Math.floor((max - min) / 2));
    }

    // take upper half
    return calc(input.substr(1), min + Math.ceil((max - min) / 2), max);
}
const calcSeats = (input: string[]): number[] => {
    return input.map((line) => {
        const row = calc(line.slice(0, 7), 0, 127);
        const column = calc(line.slice(7), 0, 7);

        return row * 8 + column;
    });
}

const part1 = (input: string[]): number => Math.max(...calcSeats(input));

const part2 = (input: string[]): number => {
    const seats = calcSeats(input).sort((a, b) => a - b);

    for (let i = 0; i < seats.length; i++) {
        if (seats[i] + 2 === seats[i + 1]) {
            return seats[i] + 1;
        }
    }

    return -1;
}

const input = readAllLinesFilterEmpty('./res/2020/input05.txt');
console.log('(part 1):', part1(input));
console.log('(part 2):', part2(input));

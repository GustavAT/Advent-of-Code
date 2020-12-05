import { readAllLinesFilterEmpty } from "../util";

const parseLine = (line: string): number =>
    parseInt(line.replace(/(F|L)/g, '0').replace(/(B|R)/g, '1'), 2);

const calcSeats = (input: string[]): number[] => input.map((line) =>
    (parseLine(line.slice(0, 7)) << 3) + parseLine(line.slice(7)));

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

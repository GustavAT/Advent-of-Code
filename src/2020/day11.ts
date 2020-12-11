import { readAllLinesFilterEmpty } from "../io.util";
import { count } from "../sets.util";

type AdjacentSeatsFn = (seats: string[][], row: number, column: number) => string[];
type GameOfSeatsOptions = { occupiedThreshold: number; adjacentSeatsFn: AdjacentSeatsFn };

const getSeat = (seats: string[][], row: number, column: number, options: GameOfSeatsOptions): string => {
    const seat = seats[row][column];
    const adjacentSeats = options                                                           // Get adjacent seats and filter 'undefined' (non existing seats)
        .adjacentSeatsFn(seats, row, column)
        .filter((s) => s);

    if (seat === 'L' && !adjacentSeats.includes('#')) {                                     // Empty seats 'L' with no adjacent occupied seats get occupied '#'
        return '#';
    } else if (seat === '#' && count(adjacentSeats, '#') >= options.occupiedThreshold) {    // Occupied seats '#' with >= (threshold) seats get empty 'L'
        return 'L';
    }

    return seat;                                                                            // Other seats '.' stay unchanged
}

const simulateStep = (seats: string[][], options: GameOfSeatsOptions): string[][] => {
    const newSeats: string[][] = [];

    for (let i = 0; i < seats.length; i++) {
        newSeats.push([]);
        for (let j = 0; j < seats[i].length; j++) {
            const seat = seats[i][j];

            if (seat === '.') {
                newSeats[i][j] = '.';                                                       // Empty seats '.' stay unchanged
            } else {
                newSeats[i][j] = getSeat(seats, i, j, options);                             // Determine the seat's state
            }
        }
    }

    return newSeats;
}

const runGameOfSeats = (seats: string[][], options: GameOfSeatsOptions): number => {
    for (; ;) {
        const newSeats = simulateStep(seats, options);
        if (newSeats.toString() === seats.toString()) {                                     // Check if the current state equals the previous state
            return seats.toString().split('#').length - 1;                                  // Count occupied seats
        }
        seats = newSeats;
    }
}

const getAdjacentSeats1 = (seats: string[][], row: number, column: number): string[] =>
    [
        seats[row - 1]?.[column - 1],
        seats[row - 1]?.[column],
        seats[row - 1]?.[column + 1],
        seats[row][column - 1],
        seats[row][column + 1],
        seats[row + 1]?.[column - 1],
        seats[row + 1]?.[column],
        seats[row + 1]?.[column + 1]
    ];


const part1 = (input: string[]): number => {
    let seats = input.map((line) => line.split(''));

    return runGameOfSeats(seats, { occupiedThreshold: 4, adjacentSeatsFn: getAdjacentSeats1 });
}

const getNextSeat = (seats: string[][], row: number, column: number, rowStep: number, columnStep: number): string => {
    let i = row;
    let j = column;

    for (; ;) {                                                                             // Find the next empty 'L' or occupied '#' seat in a direction
        i += rowStep;
        j += columnStep;

        const seat = seats[i]?.[j];                                                         // Out-of-bounds seat map to 'undefined'
        if (seat !== '.') {                                                                 // Move to the next seat for '.'; otherwise return current seat
            return seat;
        }
    }
}

const getAdjacentSeats2 = (seats: string[][], row: number, column: number): string[] =>
    [
        getNextSeat(seats, row, column, -1, -1),
        getNextSeat(seats, row, column, -1, 0),
        getNextSeat(seats, row, column, -1, 1),
        getNextSeat(seats, row, column, 0, -1),
        getNextSeat(seats, row, column, 0, 1),
        getNextSeat(seats, row, column, 1, -1),
        getNextSeat(seats, row, column, 1, 0),
        getNextSeat(seats, row, column, 1, 1),
    ];

const part2 = (input: string[]): number => {
    let seats = input.map((line) => line.split(''));

    return runGameOfSeats(seats, { occupiedThreshold: 5, adjacentSeatsFn: getAdjacentSeats2 });
}

const input = readAllLinesFilterEmpty('./res/2020/input11.txt');
console.log('Occupied seats (part 1):', part1(input));
console.log('Occupied seats (part 2):', part2(input));

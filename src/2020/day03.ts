import { readAllLinesFilterEmpty } from "../util";

const trees = (input: string[], rowStep: number, columnStep: number): number => {
    let trees = 0;

    for (let row = 0, column = 0; row < input.length; row += rowStep, column += columnStep) {
        const line = input[row];

        // Repeat the pattern
        if (column >= line.length) {
            column = column - line.length;
        }

        if (line[column] === '#') {
            trees++;
        }
    }

    return trees;
}

const part1 = (input: string[]): number => {
    return trees(input, 1, 3);
}

const part2 = (input: string[]): number => {
    return trees(input, 1, 1) *
        trees(input, 1, 3) *
        trees(input, 1, 5) *
        trees(input, 1, 7) *
        trees(input, 2, 1);
}

const input = readAllLinesFilterEmpty('./res/2020/input03.txt');
console.log('Trees encountered (part 1):', part1(input));
console.log('Trees encountered (part 2):', part2(input));
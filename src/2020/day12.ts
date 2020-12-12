import { readAllLinesFilterEmpty } from "../io.util";

type Instruction = { type: string; value: number };

const DIRECTIONS = ['N', 'E', 'S', 'W'];
const MULTIPLIER: Record<string, [number, number]> = { 'N': [0, 1], 'E': [1, 0], 'S': [0, -1], 'W': [-1, 0] };

const parseInstructions = (input: string[]): Instruction[] =>
    input.map((line) => ({
        type: line.substr(0, 1),            // 1st chart = type; rest = value
        value: parseInt(line.substr(1)),
    }));

const move = (direction: string, value: number, pos: [number, number]): [number, number] => {
    const multiplier = MULTIPLIER[direction];

    return [pos[0] + value * multiplier[0], pos[1] + value * multiplier[1]];        // Move point by some value in a direction
}

const rotate1 = (facing: string, instruction: Instruction): string => {
    const currentIndex = DIRECTIONS.indexOf(facing);
    const offset = instruction.value / 90 * (instruction.type === 'R' ? 1 : -1);    // Rotation by 90/180/270 degree = move index to left/right in the DIRECTIONS array

    return DIRECTIONS[(currentIndex + offset + 4) % 4];                             // Get the new direction by applying the offset
}

const part1 = (input: string[]): number => {
    const instructions = parseInstructions(input);
    let facing = 'E';
    let ship: [number, number] = [0, 0];

    for (const instruc of instructions) {
        if (instruc.type === 'L' || instruc.type === 'R') {                     // Rotation for L/R
            facing = rotate1(facing, instruc);
        } else {
            const direction = instruc.type === 'F' ? facing : instruc.type;     // Determine direction to move
            ship = move(direction, instruc.value, ship);                        // Move ship by the value in the desired direction
        }
    }

    return Math.abs(ship[0]) + Math.abs(ship[1]);
}

const rotate2 = (pos: [number, number], instruction: Instruction): [number, number] => {
    const degree = instruction.type === 'L'     // Convert a L rotation to a R rotation
        ? 360 - instruction.value
        : instruction.value;

    if (degree === 90) {                        // 90 degree:  [x,y] --> [y,-x]
        return [pos[1], pos[0] * -1];
    } else if (degree === 180) {                // 180 degree: [x,y] --> [-x,-y]
        return [pos[0] * -1, pos[1] * -1];
    } else {                                    // 270 degree: [x,y] --> [-y,x]
        return [pos[1] * -1, pos[0]];
    }
}

const part2 = (input: string[]): number => {
    const instructions = parseInstructions(input);
    let ship: [number, number] = [0, 0];                        // Ship; absolute coordinates
    let wp: [number, number] = [10, 1];                         // Waypoint; always relative to ship

    for (const instruc of instructions) {
        if (instruc.type === 'L' || instruc.type === 'R') {     // Rotate waypoint around [0,0] (relative)
            wp = rotate2(wp, instruc);
        } else if (instruc.type === 'F') {                      // Move ship
            ship = [
                ship[0] + wp[0] * instruc.value,
                ship[1] + wp[1] * instruc.value,
            ];
        } else {                                                // Move waypoint
            wp = move(instruc.type, instruc.value, wp);
        }
    }

    return Math.abs(ship[0]) + Math.abs(ship[1]);
}

const input = readAllLinesFilterEmpty('./res/2020/input12.txt');
console.log('Distance (part 1):', part1(input));
console.log('Distance (part 2):', part2(input));

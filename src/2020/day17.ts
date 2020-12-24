import { readAllLinesFilterEmpty } from '../io.util';
import { fromKey, toKey } from '../util';

type Cubes = Map<string, string>;

const parseInput3D = (input: string[]): Cubes => {
    const field = input.map((line) => line.split(''));
    const cubes = new Map();

    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] === '#') {                      // Only consider active cubes '#'
                cubes.set(toKey(x, y, 0), field[y][x]);     // Add a new cube to the map (z is 0 because the puzzle input is on plane 0)
            }
        }
    }

    return cubes;
}

const getNeighbours3D = (ignoreSelf: boolean): [number, number, number][] => {      // Calculate neighbouring positions around [0,0,0].
    const neighbours: [number, number, number][] = [];

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                if (ignoreSelf && x === 0 && y === 0 && z === 0) {                  // If ignoreSelf is true, position [0,0,0] will not be added to the list of neighbours
                    continue
                }

                neighbours.push([x, y, z]);
            }
        }
    }

    return neighbours;
}

const expand3D = (cubes: Cubes): Cubes => {                     // Idea: for each active cube: calculate neighbours around that cube.
    const newCubes = new Map(cubes);                            // Each of these places must be checked in the simulation step
    const neighbours = getNeighbours3D(false);

    for (const [key] of cubes) {
        const [x, y, z] = fromKey(key);
        for (const [nX, nY, nZ] of neighbours) {
            const newPos = toKey(x + nX, y + nY, z + nZ);       // Get neighbouring positions relative to the current cube
            newCubes.set(newPos, cubes.get(newPos) || '.');     // Add '.' if the cube is inactive, otherwise add the existing value (active cube)
        }
    }

    return newCubes;
}

const reduce = (cubes: Cubes): Cubes => {   // Idea: Only active cubes '#' are considered for the next simulation step
    const newCubes = new Map();             // Remove all inactive cubes '.'

    for (const [key, value] of cubes) {
        if (value === '#') {
            newCubes.set(key, value);
        }
    }

    return newCubes;
}

const simulateStep3D = (cube: Cubes): Cubes => {
    const targetCubes = expand3D(cube);             // Determine all cubes that must be checked in the current iteration
    const newCubes = new Map(targetCubes);          // New cubes state
    const neighbours = getNeighbours3D(true);       // Get relative neighbours excluding the center [0,0,0]

    for (const [key, value] of targetCubes) {
        const [x, y, z] = fromKey(key);
        const active = neighbours.map(([nX, nY, nZ]) => {                   // Map relative neighbour position to absolute positions around the current cube.
            return cube.get(toKey(x + nX, y + nY, z + nZ)) || '.';          // Get the cubes at these positions; inactive '.' if not existing
        })
            .filter((s) => s === '#')                                       // Filter active cubes '#'
            .length;                                                        // Count

        if (value === '#') {                                                // Current cube active '#' and 2 or 3 active neighbours: stay active; become inactive otherwise
            newCubes.set(key, (active === 2 || active === 3) ? '#' : '.');
        } else {                                                            // Current cube inactive '.' and exactly 3 active neighbours: become active; stay inactive otherwise
            newCubes.set(key, (active === 3) ? '#' : '.');
        }
    }

    return reduce(newCubes);                        // Prune inactive cubes '.'; they are not needed in the next simulation step
}

const part1 = (input: string[]): number => {
    let cubes = parseInput3D(input);

    for (let i = 0; i < 6; i++) {
        cubes = simulateStep3D(cubes);
    }

    return cubes.size;                  // The map holds only active cubes '#', hence cube.size
}

const parseInput4D = (input: string[]): Cubes => {
    const field = input.map((line) => line.split(''));
    const cubes = new Map();

    for (let y = 0; y < field.length; y++) {
        for (let x = 0; x < field[y].length; x++) {
            if (field[y][x] === '#') {
                cubes.set(toKey(x, y, 0, 0), field[y][x]);
            }
        }
    }

    return cubes;
}

const getNeighbours4D = (ignoreSelf: boolean): [number, number, number ,number][] => {
    const neighbours: [number, number, number ,number][] = [];

    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                for (let w = -1; w <= 1; w++) {
                    if (ignoreSelf && x === 0 && y === 0 && z === 0 && w === 0) {
                        continue
                    }
    
                    neighbours.push([x, y, z, w]);
                }                
            }
        }
    }

    return neighbours;
}

const expand4D = (cubes: Cubes): Cubes => {
    const newCubes = new Map(cubes);
    const neighbours = getNeighbours4D(false);

    for (const [key] of cubes) {
        const [x, y, z, w] = fromKey(key);
        for (const [nX, nY, nZ, nW] of neighbours) {
            const newPos = toKey(x + nX, y + nY, z + nZ, w + nW);
            newCubes.set(newPos, cubes.get(newPos) || '.');
        }
    }

    return newCubes;
}

const simulateStep4D = (cubes: Cubes): Cubes => {
    const targetCubes = expand4D(cubes);
    const newCubes = new Map(targetCubes);
    const neighbours = getNeighbours4D(true);

    for (const [key, value] of targetCubes) {
        const [x, y, z, w] = fromKey(key);
        const active = neighbours.map(([nX, nY, nZ, nW]) => {        
            return cubes.get(toKey(x + nX, y + nY, z + nZ, w + nW)) || '.';
        })
            .filter((s) => s === '#')
            .length;

        if (value === '#') {
            newCubes.set(key, (active === 2 || active === 3) ? '#' : '.');
        } else {
            newCubes.set(key, (active === 3) ? '#' : '.');
        }
    }

    return reduce(newCubes);
}

const part2 = (input: string[]): number => {
    let cubes = parseInput4D(input);        // 4D is analogous to 3D; just with 1 coordinate more.
                                            // I could have refactored this to work with n-dimensions, but ¯\_(ツ)_/¯
    for (let i = 0; i < 6; i++) {
        cubes = simulateStep4D(cubes);
    }

    return cubes.size;
}

const input = readAllLinesFilterEmpty('./res/2020/input17.txt');
console.log('Cubes (part 1):', part1(input));
console.log('Cubes (part 2):', part2(input));

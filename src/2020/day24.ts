import { readAllLinesFilterEmpty } from '../io.util';
import { fromKey, toKey } from '../util';

type Floor = Map<string, boolean>;
type Direction = 'nw' | 'ne' | 'e' | 'se' | 'sw' | 'w';

const DIRECTION_REGEXP = /(nw|ne|e|se|sw|w)/g;                              // Directions are unambiguous
const HEX_ADJACENT = [[0, -1], [1, -1], [1, 0], [0, 1], [-1, 1], [-1, 0]];  // Adjacent tiles in a row-oriented hex-grid; order: NW, NE, E, SE, SW, W

const parseInput = (input: string[]): Direction[][] => {
    return input.map((line) => {
        const matches = line.matchAll(DIRECTION_REGEXP);                    

        return Array.from(matches).map((match) => match[0] as Direction);   // Each match contains a direction
    })
}

const calculateTilePosition = (path: Direction[]): [number, number] => {
    let pos: [number, number] = [0, 0];             // Start from a 0/0 tile

    for (const direction of path) {
        switch (direction) {
            case 'nw':
                pos = [pos[0], pos[1] - 1];
                break;
            case 'ne':
                pos = [pos[0] + 1, pos[1] - 1];
                break;
            case 'e':
                pos = [pos[0] + 1, pos[1]]
                break;
            case 'se':
                pos = [pos[0], pos[1] + 1];
                break;
            case 'sw':
                pos = [pos[0] - 1, pos[1] + 1];
                break;
            case 'w':
                pos = [pos[0] - 1, pos[1]];
                break;
        }
    }

    return pos;
}

const initializeFloor = (paths: Direction[][]): Floor => {
    const tiles = new Map();                                        // Store black tiles as true, white tiles as false

    for (const path of paths) {
        const position = toKey(...calculateTilePosition(path));     // toKey as Map cannot have types other than number/string as key
        tiles.set(position, !tiles.get(position));                  // tiles.get returns either undefined/boolean
    }

    return tiles;
}

const countBlackTiles = (tiles: Floor): number =>
    Array.from(tiles.values()).filter((tile) => tile).length;       // Count black 'true' tiles

const part1 = (input: string[]): number => {
    const paths = parseInput(input);
    const tiles = initializeFloor(paths);

    return countBlackTiles(tiles);
}

const expandTiles = (tiles: Floor): Floor => {              // Expand the hex-grid by its outer adjacent tiles
    const newTiles = new Map();
    const expanded = new Map(tiles);
    const neighbours = [...HEX_ADJACENT, [0, 0]];           // Include self-position

    for (const [key] of expanded) {
        const [x, y] = fromKey(key);
        for (const [nX, nY] of neighbours) {
            const newKey = toKey(x + nX, y + nY);
            newTiles.set(newKey, !!expanded.get(newKey));   // true -> true; false -> false; undefined -> false
        }
    }

    return newTiles;
}

const getAdjacentTiles = ([x, y]: [number, number], tiles: Floor): boolean[] => {
    const adjacent: boolean[] = [];
    for (const [nX, nY] of HEX_ADJACENT) {      // Iterate relative positions of adjacent tiles
        const key = toKey(x + nX, y + nY);
        adjacent.push(!!tiles.get(key));        // true -> true; false -> false; undefined -> false
    }

    return adjacent;
}

const reduce = (tiles: Floor): Floor => {       // Remove white 'false' tiles from the map.
    const newTiles = new Map();                 // They are not relevant for the next simulation step

    for (const [key, value] of tiles) {
        if (value) {
            newTiles.set(key, value);
        }
    }

    return newTiles;
}

const simulateStep = (tiles: Floor): Floor => {
    const targetTiles = expandTiles(tiles);         // Expand current tiles. Neighbours not present in the tile-map can also change
    const newTiles = new Map();                     // New state

    for (const [key, value] of targetTiles) {
        const [x, y] = fromKey(key);
        const blackAdjacent = getAdjacentTiles([x, y], tiles)               // Get adjacent tiles
            .filter((tile) => tile)                                         // Filter for black 'true' tiles
            .length;

        if (value) {
            newTiles.set(key, blackAdjacent === 1 || blackAdjacent === 2);  // Black 'true' tile: stay black if exactly 1 or 2 black neighbours
        } else {
            newTiles.set(key, blackAdjacent === 2);                         // White 'false' tile: turn black if exactly 2 black neighbours
        }
    }

    return reduce(newTiles);                        // Remove white tiles; they are not needed for the next simulation step
}

const part2 = (input: string[]): number => {
    const paths = parseInput(input);
    let tiles = initializeFloor(paths);

    for (let i = 0; i < 100; i++) {
        tiles = simulateStep(tiles);
    }

    return countBlackTiles(tiles);
}

const input = readAllLinesFilterEmpty('./res/2020/input24.txt');
console.log('Black Tiles (part 1):', part1(input));
console.log('Lobby Layout (part 2):', part2(input));

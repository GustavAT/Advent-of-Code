import { readAllLines } from '../io.util';
import { groupInput, rotateClockWise, count2D } from '../util';

type Tile = { id: number, data: string[], edges: string[] };    // A tile has an id, raw image data and 4 edges (+ flipped versions)

const enum Orientation {
    Top = 0,
    TopFlipped = 1,
    Right = 2,
    RightFlipped = 3,
    Bottom = 4,
    BottomFlipped = 5,
    Left = 6,
    LeftFlipped = 7,
};

const TILE_REGEXP = /^Tile\s(\d+):$/;   // Reg exp for tile row: Tile: (number)

const SEA_MONSTER_PATTERN = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   ',
];

const getEdges = (data: string[]): string[] => {                                                // Calculate all 8 edged (normal + flipped) for a tile
    const edges: string[] = new Array(8);

    edges[Orientation.Top] = data[0];                                                           // First row
    edges[Orientation.TopFlipped] = edges[Orientation.Top].split('').reverse().join('');        // First row reversed
    edges[Orientation.Right] = data.map((row) => row[row.length - 1]).join('');                 // Last column
    edges[Orientation.RightFlipped] = edges[Orientation.Right].split('').reverse().join('');    // Last column reversed
    edges[Orientation.Bottom] = data[data.length - 1];                                          // Last row
    edges[Orientation.BottomFlipped] = edges[Orientation.Bottom].split('').reverse().join('');  // Last row revered
    edges[Orientation.Left] = data.map((row) => row[0]).join('');                               // First column
    edges[Orientation.LeftFlipped] = edges[Orientation.Left].split('').reverse().join('');      // First column revered

    return edges;
}

const parseInput = (input: string[]): Tile[] => {
    const tileGroups = groupInput(input);
    const tiles: Tile[] = [];

    for (const group of tileGroups) {
        const [idString, ...data] = group;
        const id = parseInt(idString.match(TILE_REGEXP)![1]);
        const edges = getEdges(data);

        tiles.push({ id, data, edges });
    }

    return tiles;
}

const findAdjacentTiles = (tile: Tile, allTiles: Tile[]): Tile[] => {                   // Find tiles that have at least one edge in common with this tile
    return allTiles.filter((other) => other.id !== tile.id)                             // Ignore this tile
        .filter((other) => other.edges.some((edge) => tile.edges.includes(edge)));      // At least one common edge
}

const getCornerTiles = (tiles: Tile[]) =>
    tiles.filter((tile) => findAdjacentTiles(tile, tiles).length == 2);                 // Corner tiles have exatcly 2 common edges; edge tiles: 3; other tiles: 4

const part1 = (input: string[]): number => {
    const tiles = parseInput(input);

    return getCornerTiles(tiles).reduce((product, tile) => product * tile.id, 1);   // Multiply IDs of all 4 corner tiles
}

const createEdgeToTileLookup = (tiles: Tile[]): Map<string, Tile[]> => {            // Look up: edge --> tiles with this edge
    const map = new Map<string, Tile[]>();

    for (const tile of tiles) {
        for (const edge of tile.edges) {
            if (map.has(edge)) {
                map.get(edge)!.push(tile);
            } else {
                map.set(edge, [tile]);
            }
        }
    }

    for (const [key, value] of map) {       // Remove all edges that refer to only one tile. Outer edges of the image
        if (value.length < 2) {
            map.delete(key);
        }
    }

    return map;
}

const rotateTileClockWise = (tile: Tile): void => {     // Rotate a tile clockwise and update its edge-data
    tile.data = rotateClockWise(tile.data.map((row) => row.split(''))).map((row) => row.join(''));
    tile.edges = getEdges(tile.data);
}

const flipTileVertically = (tile: Tile): void => {      // Flip a tile vertically and update its edge data
    tile.data = tile.data.reverse();                    // Reverse rows
    tile.edges = getEdges(tile.data);
}

const flipTileHorizontally = (tile: Tile): void => {    // Flip a tile horizontally and update its edge data
    tile.data = tile.data.map((row) => row.split('').reverse().join(''));   // Reverse each row
    tile.edges = getEdges(tile.data);
}

/**
 * Arrange all tiles to get the full image (arranged, flipped and rotated correctly)
 * 
 * The image is a square => height = width = sqrt(tiles.length)
 * All eges are unique - exactly two tiles share the same edge (normal + flipped).
 * 
 * Idea:
 * 1 Start with any corner.
 *      1.1 The corner just needs to be rotated correctly: Common edges faced down and right.
 *          There is no need to flip the corner piece. Other tiles can be flipped/rotate then accordingly
 * 
 * 2 Start with the first row
 *      2.1 Align all pieces to match the RIGHT edge of the previous piece in that row.
 * 
 * 3 Aligh the rest
 *      3.1 Only the BOTTOM edge of the tile in the previous row needs to be checked (edges are unique)
 *
 * @param tiles Tiles
 */
const arrangeTiles = (tiles: Tile[]): Tile[][] => {
    const size = Math.sqrt(tiles.length);
    const edgeLookup = createEdgeToTileLookup(tiles);
    const image: Tile[][] = [...Array(size)].map(() => Array(size));
    const placed: number[] = [];

    for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
            let tile: Tile;

            if (row === 0 && column === 0) {
                tile = getCornerTiles(tiles)[0];

                while (!edgeLookup.has(tile.edges[Orientation.Right]) || !edgeLookup.has(tile.edges[Orientation.Bottom])) {
                    rotateTileClockWise(tile);              // Rotate until RIGHT and BOTTOM edges align with some other tile
                }
            } else if (row === 0) {
                const rightEdge = image[0][column - 1].edges[Orientation.Right];                // Get the RIGHT edge from the previous tile
                tile = edgeLookup.get(rightEdge)!.filter((t) => !placed.includes(t.id))[0];     // Next tile shares the same edge

                while (tile.edges[Orientation.Left] !== rightEdge && tile.edges[Orientation.LeftFlipped] !== rightEdge) {
                    rotateTileClockWise(tile);              // Rotate until LEFT or LEFT FLIPPED edge align with the RIGHT edge
                }

                if (tile.edges[Orientation.Left] !== rightEdge) {
                    flipTileVertically(tile);               // Flip if the LEFT edge does not align (LEFT FLIPPED aligns)
                }

            } else {
                const bottomEdge = image[row - 1][column].edges[Orientation.Bottom];            // Get the BOTTOM edge from the previous row tile in the same column
                tile = edgeLookup.get(bottomEdge)!.filter((t) => !placed.includes(t.id))[0];    // Next tile shares the same edge

                while (tile.edges[Orientation.Top] !== bottomEdge && tile.edges[Orientation.TopFlipped] !== bottomEdge) {
                    rotateTileClockWise(tile);              // Rotate until TOP or TOP FLIPPED edge align with the BOTTOM edge
                }

                if (tile.edges[Orientation.Top] !== bottomEdge) {
                    flipTileHorizontally(tile);             // Flip if the TOP edge does not align (TOP FLIPPED aligns)
                }
            }

            image[row][column] = tile;
            placed.push(tile.id);
        }
    }

    return image;

}

const constructImage = (image: Tile[][]): string[][] => {       // Construct the final image ignoring the border (edges) of each tile
    const tileSize = image[0][0].data.length - 2;               // -2 for edges to left/right or bottom/top
    const imageSize = image.length;

    const pixels: string[][] = [...Array(tileSize * imageSize)].map(() => Array(tileSize * imageSize));

    for (let row = 0; row < imageSize; row++) {
        for (let tileRow = 0; tileRow < tileSize; tileRow++) {
            for (let column = 0; column < imageSize; column++) {
                for (let tileColumn = 0; tileColumn < tileSize; tileColumn++) {
                    pixels[row * tileSize + tileRow][column * tileSize + tileColumn] = image[row][column].data[tileRow + 1][tileColumn + 1]; // ofset + 1 because border is ignored
                }
            }
        }
    }

    return pixels;
}

const findMonster = (image: string[][], imageRow: number, imageColumn: number): boolean => {    // Find monster pattern relative to given pixel (imageRow, imageColumn)
    for (let row = 0; row < SEA_MONSTER_PATTERN.length; row++) {
        for (let column = 0; column < SEA_MONSTER_PATTERN[row].length; column++) {
            if (SEA_MONSTER_PATTERN[row][column] === '#' && image[imageRow + row][imageColumn + column] !== '#') {
                return false;
            }
        }
    }

    return true;
}

const countSeaMonsters = (image: string[][]): number => {
    const [width, height] = [SEA_MONSTER_PATTERN[0].length, SEA_MONSTER_PATTERN.length];

    let count = 0;
    for (let row = 0; row <= image.length - height; row++) {
        for (let column = 0; column <= image[row].length - width; column++) {
            if (findMonster(image, row, column)) {                                          // Find monster pattern starting at each pixel
                count++;
            }
        }
    }

    return count;
}

const countWater = (image: string[][]): number => {
    const waterCount = count2D(image, '#');
    const seaMonsterPatternCount = count2D(SEA_MONSTER_PATTERN.map((line) => line.split('')), '#');

    for (let i = 0; i < 4; i++) {                                   // Check all rotations
        const count = countSeaMonsters(image);
        if (count > 0) {                                            // If monsters are found, return count
            return waterCount - count * seaMonsterPatternCount;
        }

        image = rotateClockWise(image);                             // No monsters found, try next rotation
    }

    image = image.reverse();                                        // Try flipped image

    for (let i = 0; i < 4; i++) {                                   // Analogous to first loop
        const count = countSeaMonsters(image);
        if (count > 0) {
            return waterCount - count * seaMonsterPatternCount;
        }

        image = rotateClockWise(image);
    }

    return -1;
}

const part2 = (input: string[]): number => {
    const tiles = parseInput(input);
    const image = arrangeTiles(tiles);
    const pixels = constructImage(image);

    return countWater(pixels);
}

const input = readAllLines('./res/2020/input20.txt');
console.log('Image (part 1):', part1(input));
console.log('Image (part 2):', part2(input));

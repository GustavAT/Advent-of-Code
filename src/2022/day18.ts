import { readAllLinesFilterEmpty } from '../io.util';
import { fromKey, toKey } from '../util';

type Cube = [number, number, number];
type Bounds = {
  maxX: number;
  minX: number;
  maxY: number;
  minY: number;
  maxZ: number;
  minZ: number;
};

const ADJACENT_CUBES: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const placeCubes = (input: Cube[]): Set<string> => {
  const cubes = new Set<string>();
  input.forEach((cube) => cubes.add(toKey(...cube)));
  return cubes;
};

/**
 * Count the number of exposed faces of all cubes
 */
const countExposedFaces = (cubes: Set<string>): number => {
  let faces = 0;

  for (const cube of cubes) {
    const [x, y, z] = fromKey(cube);
    for (const offset of ADJACENT_CUBES) {
      const adjacent = [x + offset[0], y + offset[1], z + offset[2]]; // Get adjacent cube of current cube
      const exists = cubes.has(toKey(...adjacent));                   // Check if adjacent cube is air
      if (!exists) {
        faces++;                                                      // Count "air" cube
      }
    }
  }

  return faces;
};

/**
 * Get the outer bounds of all cubes (includes an additional layer of air)
 */
const getBounds = (cubes: Set<string>): Bounds => {
  const bounds: Bounds = {maxX: 0, minX: 0, maxY: 0, minY: 0, maxZ: 0, minZ: 0};

  for (const cube of cubes) {
    const [x, y, z] = fromKey(cube);
    bounds.maxX = Math.max(bounds.maxX, x + 1);
    bounds.minX = Math.min(bounds.minX, x - 1);
    bounds.maxY = Math.max(bounds.maxY, y + 1);
    bounds.minY = Math.min(bounds.minY, y - 1);
    bounds.maxZ = Math.max(bounds.maxZ, z + 1);
    bounds.minZ = Math.min(bounds.minZ, z - 1);
  }

  return bounds;
};

/**
 * Flood fill the complete area starting from given point.
 * The set of "water" cubes is returned.
 *
 * Idea: trapped cubes are not filled with water.
 */
const floodFill = (start: [number, number, number], bounds: Bounds, cubes: Set<string>): Set<string> => {
  const visited = new Set<string>();                                      // Visited cubes
  const openStates = [toKey(...start)];                                   // Not visited states, starting from given point

  while (openStates.length > 0) {                                         // Repeat until there are not visited states left
    const state = openStates.pop()!;
    const [x, y, z] = fromKey(state);
    visited.add(state);                                                   // Add current state to visited states

    for (const offset of ADJACENT_CUBES) {                                // Expand for each adjacent cube
      const [aX, aY, aZ] = [x + offset[0], y + offset[1], z + offset[2]];
      if (                                                                // Stop if adjacent cube is outside given bounds
        aX < bounds.minX || aX > bounds.maxX ||
        aY < bounds.minY || aY > bounds.maxY ||
        aZ < bounds.minZ || aZ > bounds.maxZ
      ) {
        continue;
      }

      const adjacent = toKey(aX, aY, aZ);
      if (!cubes.has(adjacent) && !visited.has(adjacent)) {               // Stop if adjacent cube is lave or visited
        openStates.push(adjacent);                                        // Add new not-visited state
      }
    }
  }

  return visited;
};

/**
 * Count all faces of cubes that touch given "water" cubes
 */
const countWaterFaces = (cubes: Set<string>, waterCubes: Set<string>): number => {
  let faces = 0;

  for (const cube of cubes) {                                               // For each cube, check adjacent cubes
    const [x, y, z] = fromKey(cube);
    for (const offset of ADJACENT_CUBES) {
      const adjacent = toKey(x + offset[0], y + offset[1], z + offset[2]);
      if (waterCubes.has(adjacent)) {                                       // Count face if adjacent cube is water
        faces++;
      }
    }
  }

  return faces;
};

const part1 = (input: Cube[]): number => {
  const cubes = placeCubes(input);
  return countExposedFaces(cubes);
};

const part2 = (input: Cube[]): number => {
  const cubes = placeCubes(input);
  const bounds = getBounds(cubes);
  const waterCubes = floodFill([0, 0, 0], bounds, cubes);
  return countWaterFaces(cubes, waterCubes);
};

const input = readAllLinesFilterEmpty('./res/2022/day18.txt')
  .map((line) => line.split(',')
    .map(Number) as Cube);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

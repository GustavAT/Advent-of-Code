import { readAllLinesFilterEmpty } from '../io.util';

type Cuboid = {
  on: boolean;
  p1: { x: number, y: number, z: number };
  p2: { x: number, y: number, z: number };
};

const CUBOID_P1: Cuboid = {                                         // Cuboid that spans the area for Part 1
  on: true,
  p1: {x: -50, y: -50, z: -50},
  p2: {x: 51, y: 51, z: 51},
};

const parse = (input: string[]): Cuboid[] => {
  const cuboids: Cuboid[] = [];

  for (const line of input) {
    const [state, coords] = line.split(' ');
    const [x, y, z] = coords.split(',')
      .map((range) => range.substring(2))
      .map((range) => range.split('..')
        .map((coord) => +coord));

    cuboids.push({
      on: state === 'on',
      p1: {x: x[0], y: y[0], z: z[0]},
      p2: {x: x[1] + 1, y: y[1] + 1, z: z[1] + 1},                  // Add 1 to include the last coordinate
    });
  }

  return cuboids;
};

/**
 * Returns true if a intersects with b.
 * Intersections on one axis can result in the 4 following cases:
 * A: 1.  +---+ 2. +---+   3. +---+ 4.  +-+
 * B:   +---+        +---+     +-+     +---+
 *
 * With P1 --> +---+ <-- P2
 *
 * Namely when: a.p1.x < b.p2.x && b.p1.x < a.p2.x
 */
const intersects = (a: Cuboid, b: Cuboid): boolean => {
  if (a.p1.x < b.p2.x && b.p1.x < a.p2.x) {
    if (a.p1.y < b.p2.y && b.p1.y < a.p2.y) {
      if (a.p1.z < b.p2.z && b.p1.z < a.p2.z) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Returns true if a fully contains b
 * A contains B if
 * A: +---+
 * B:  +-+
 * on all 3 axis.
 */
const contains = (a: Cuboid, b: Cuboid): boolean => {
  if (a.p1.x <= b.p1.x && b.p2.x <= a.p2.x) {
    if (a.p1.y <= b.p1.y && b.p2.y <= a.p2.y) {
      if (a.p1.z <= b.p1.z && b.p2.z <= a.p2.z) {
        return true;
      }
    }
  }

  return false;
};

/** Find splittings on each axis where target intersects with source.
 *
 * Source: *   +I--+    *   +I-I+    *     +-+    *
 * Target: *    +---+   *    +-+     *    +---+   *
 * Splits: *  1 split   *  2 splits  *  0 splits  *
 * Cubes:  *  2 cuboids *  3 cuboids *  1 cuboid  *
 */
const axisSplittings = (source: Cuboid, target: Cuboid):
  { xAxis: number[], yAxis: number[], zAxis: number[] } => {
  const xSplits = [target.p1.x, target.p2.x]
    .filter((x) => source.p1.x < x && x < source.p2.x);
  const xAxis = [source.p1.x, ...xSplits, source.p2.x];

  const ySplits = [target.p1.y, target.p2.y]
    .filter((y) => source.p1.y < y && y < source.p2.y);
  const yAxis = [source.p1.y, ...ySplits, source.p2.y];

  const zSplits = [target.p1.z, target.p2.z]
    .filter((z) => source.p1.z < z && z < source.p2.z);
  const zAxis = [source.p1.z, ...zSplits, source.p2.z];

  return {xAxis, yAxis, zAxis};
};

/**
 * If target contains source: return source as it cannot be split up.
 * If target does not intersect source: return source as no split up is required.
 * Else: Split source cuboid up where target cuboid intersects.
 *
 * For each axis split at intersections
 * Each split results in 1..3 cubes. (no overlap, partly overlap, fully overlap)
 * Repeat for every axis = max 27 cubes (3*3*3)
 *
 * Return split up cuboid without target cuboid
 */
const split = (source: Cuboid, target: Cuboid): Cuboid[] => {
  if (contains(target, source)) {                                   // Omit source = switch OFF and insert target if state = ON later
    return [];
  }

  if (!intersects(source, target)) {                                // No splitting required for source, keep it
    return [source];
  }

  const {xAxis, yAxis, zAxis} = axisSplittings(source, target);     // Get splittings where target intersects source
  const newCuboids: Cuboid[] = [];

  for (let i = 0; i < xAxis.length - 1; i++) {
    for (let j = 0; j < yAxis.length - 1; j++) {
      for (let k = 0; k < zAxis.length - 1; k++) {
        const cuboid: Cuboid = {
          on: source.on,
          p1: {x: xAxis[i], y: yAxis[j], z: zAxis[k]},
          p2: {x: xAxis[i + 1], y: yAxis[j + 1], z: zAxis[k + 1]},
        };

        if (!contains(target, cuboid)) {                            // Omit the slice that overlaps with target. Will be added later on if switched ON
          newCuboids.push(cuboid);
        }
      }
    }
  }

  return newCuboids;
};

/**
 * Calculate the volume of given cuboid.
 * Note: use bigint, as volumes tend to get very big 100000^3 ~ Number.MAX_SAFE_INTEGER
 */
const volume = (cuboid: Cuboid): bigint => {
  return BigInt(Math.abs(cuboid.p2.x - cuboid.p1.x))
    * BigInt(Math.abs(cuboid.p2.y - cuboid.p1.y))
    * BigInt(Math.abs(cuboid.p2.z - cuboid.p1.z));
};

const calculateOn = (cuboids: Cuboid[]): Cuboid[] => {
  let newCuboids: Cuboid[] = [];                                    // List of non-intersecting cuboids that are switched ON

  for (const current of cuboids) {
    newCuboids = newCuboids
      .map((cuboid) => split(cuboid, current))                      // Split ON cuboids at their intersection with the current
      .flat();

    if (current.on) {                                               // Add the current cuboid if it's switched ON => non intersecting guaranteed
      newCuboids.push(current);
    }
  }

  return newCuboids;
};

const sumVolumes = (cuboids: Cuboid[]): bigint => {
  const volumes = cuboids.map((c) => volume(c));

  return volumes.reduce((sum, volume) => sum + volume, 0n);
};

const part1 = (input: string[]): bigint => {
  const cuboids = parse(input)
    .filter((cuboid) => contains(CUBOID_P1, cuboid));
  const onCuboids = calculateOn(cuboids);

  return sumVolumes(onCuboids);
};

const part2 = (input: string[]): bigint => {
  const cuboids = parse(input);
  const onCuboids = calculateOn(cuboids);

  return sumVolumes(onCuboids);
};

const input = readAllLinesFilterEmpty('./res/2021/input22.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

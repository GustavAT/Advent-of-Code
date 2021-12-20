import { readAllLines } from '../io.util';
import { fromKey, groupInput, toKey } from '../util';
import { difference, distance, equals, translate, Vector } from '../vector.util';

type Scanner = { id: number, beacons: Vector[], origin: Vector };           // Scanner has an ID, List of BEACONS and an ORIGIN

const SCANNER_REGEX = /---\sscanner\s(\d+)/;                                // Match: '--- scanner %d'

/**
 * I have deduce all rotations manually using the 3-finger (blue/red/green colored fine-liner) method.
 * This took quite some time
 */
const ROTATIONS: ((v: Vector) => Vector)[] = [
  // Initial | Rotate around X axis
  (v) => [v[0], v[1], v[2]],    //  X  Y  Z
  (v) => [v[0], -v[1], -v[2]],  //  X -Y -Z
  (v) => [v[0], v[2], -v[1]],   //  X  Z -Y
  (v) => [v[0], -v[2], v[1]],   //  X -Z  Y

  // Rotate 2x around Z axis | Rotate around X axis
  (v) => [-v[0], -v[1], v[2]],  // -X -Y  Z
  (v) => [-v[0], v[1], -v[2]],  // -X  Y -Z
  (v) => [-v[0], -v[2], -v[1]], // -X -Z -Y
  (v) => [-v[0], v[2], v[1]],   // -X  Z  Y

  // Rotate 1x around Z axis | Rotate around Y axis
  (v) => [-v[1], v[0], v[2]],   // -Y  X  Z
  (v) => [-v[1], -v[0], -v[2]], // -Y -X -Z
  (v) => [-v[1], v[2], -v[0]],  // -Y  Z -X
  (v) => [-v[1], -v[2], v[0]],  // -Y -Z  X

  // Rotate 3x around Z axis | Rotate around Y axis
  (v) => [v[1], -v[0], v[2]],   //  Y -X  Z
  (v) => [v[1], v[0], -v[2]],   //  Y  X -Z
  (v) => [v[1], -v[2], -v[0]],  //  Y -Z -X
  (v) => [v[1], v[2], v[0]],    //  Y  Z  X

  // Rotate 1x around Y axis | Rotate around Z axis
  (v) => [-v[2], v[1], v[0]],   // -Z  Y  X
  (v) => [-v[2], -v[1], -v[0]], // -Z -Y -X
  (v) => [-v[2], v[0], -v[1]],  // -Z  X -Y
  (v) => [-v[2], -v[0], v[1]],  // -Z -X  Y

  // Rotate 3x around Y axis | Rotate around Z axis
  (v) => [v[2], v[1], -v[0]],   //  Z  Y -X
  (v) => [v[2], -v[1], v[0]],   //  Z -Y  X
  (v) => [v[2], -v[0], -v[1]],  //  Z -X -Y
  (v) => [v[2], v[0], v[1]],    //  Z  X  Y
];

const parse = (input: string[]): Scanner[] => {
  const groups = groupInput(input);
  const scanners: Scanner[] = [];

  for (const group of groups) {
    const scannerLine = group.shift()!;
    const [, id] = scannerLine.match(SCANNER_REGEX)!;

    scanners.push({
      id: +id,
      beacons: group.map((line) => line.split(',')
        .map((n) => +n) as Vector),
      origin: [0, 0, 0],
    });
  }

  return scanners;
};

/**
 * Get a map of relative distances of any point to any other point.
 * Key: relative distance, Value: seconds point
 * @param beacons
 */
const getBeaconDistances = (beacons: Vector[]): Record<string, Vector> => {
  const distances: Record<string, Vector> = {};                             // <distance, point> Relative distance between vector and any other point

  for (const b1 of beacons) {
    for (const b2 of beacons) {
      if (equals(b1, b2)) {
        continue;
      }

      const diff = difference(b1, b2);
      const diffKey = toKey(...diff);
      if (distances[diffKey] === undefined) {
        distances[diffKey] = b2;
      }
    }
  }

  return distances;
};

/**
 * Find matches of other in source beacon distance map.
 * If there are at least 12 matches, return the relative offset between these maps.
 */
const findMatches = (source: Record<string, Vector>, other: Record<string, Vector>): Vector | undefined => {
  let offset: Vector | undefined = undefined;
  let matches = 0;

  for (const otherKey in other) {
    if (source[otherKey] !== undefined) {                                   // Relative distance found in source map
      matches++;

      if (matches >= 12) {                                                  // 12 distances found, rotation of other is correct
        offset = difference(other[otherKey], source[otherKey]);             // Calculate offset between source and other
        break;
      }
    }
  }

  return offset;
};

const solve = (scanner: Scanner[]): number => {
  let allDistances = getBeaconDistances(scanner[0].beacons);                // Relative distances between all known beacons
  const allBeacons = scanner[0].beacons.map((b) => toKey(...b));            // All known beacons. First scanner used as a reference

  const queue = scanner.slice(1);                                           // Test all scanners except first
  while (queue.length > 0) {                                                // All unknown scanners
    const current = queue.shift()!;

    let matchFound = false;
    for (const rotationFn of ROTATIONS) {                                   // Try each of 24 rotations
      const currentBeacons = current.beacons.map((b) => rotationFn(b));     // Rotate by current rotation
      const otherDistances = getBeaconDistances(currentBeacons);            // Calculate relative distances of rotated scanner

      const offset = findMatches(allDistances, otherDistances);             // Check for 12 matches among relative distances
      if (offset) {
        matchFound = true;
        const translated = currentBeacons.map((b) => translate(b, offset)); // Translate rotated scanners by offset
        current.beacons = translated;                                       // Update beacons of current scanner
        current.origin = offset;                                            // Store the offset as origin of the current scanner

        for (const key of translated.map((b) => toKey(...b))) {             // Update known beacons
          if (!allBeacons.includes(key)) {
            allBeacons.push(key);
          }
        }

        const allVectors = allBeacons.map((b) => fromKey(b) as Vector);
        allDistances = getBeaconDistances(allVectors);                      // Calculate new beacon distances
      }
    }

    if (!matchFound) {                                                      // Current scanner does not match YET. Try the next one
      queue.push(current);
    }
  }

  return allBeacons.length;
};

const getDistances = (scanner: Scanner[]): number[] => {
  const distances = [];

  for (let i = 0; i < scanner.length - 1; i++) {
    for (let j = i + 1; j < scanner.length; j++) {
      const dist = distance(scanner[i].origin, scanner[j].origin);          // Calculate the distance between each scanner
      distances.push(dist);
    }
  }

  return distances;
};

const part1 = (input: string[]): number => {
  const scanner = parse(input);
  return solve(scanner);
};

const part2 = (input: string[]): number => {
  const scanner = parse(input);
  solve(scanner);

  return Math.max(...getDistances(scanner));
};

const input = readAllLines('./res/2021/input19.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

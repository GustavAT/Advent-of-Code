import { readLinesWithRegExp } from '../io.util';

const COORDS_REGEX = /(-?\d+)/g;
type Scanner = [number, number, number];

const mergeSegments = (segments: [number, number][]): [number, number][] => {
  const source = [...segments]
    .sort((a, b) => a[0] - b[0]);           // Sort segments by start

  const stack = [source[0]];                // Put first segment on the stack
  for (let i = 1; i < source.length; i++) { // Iterate remaining segments
    const last = stack[stack.length - 1];
    const current = source[i];

    if (last[1] < current[0]) {             // Last segment ends before next segment starts: |--last--|  |--current--|
      stack.push(current);                  // Create a new segment
    } else if (last[1] < current[1]) {      // Current segment overlaps with last segment
      last[1] = current[1];                 // Extend last segment by current end
    }
  }

  return stack;
};

const part1 = (scanner: Scanner[]): number => {
  const line = 2_000_000;                             // Target line

  const segments: [number, number][] = [];
  for (const [sX, sY, beaconOffset] of scanner) {
    const yOffset = Math.abs(line - sY);              // y offset from scanner to target line

    if (yOffset > beaconOffset) {                     // line is further away than the beacon offset
      continue;
    }

    const xOffset = beaconOffset - yOffset;           // How much to the left/right is covered by the scanner
    segments.push([sX - xOffset, sX + xOffset]);      // Create a new segment of coverage
  }

  const merged = mergeSegments(segments);             // Merge overlapping segments
  let length = 0;
  for (const segment of merged) {
    length += Math.abs(segment[1] - segment[0]) + 1;  // Count number of used spaces
  }

  return length - 1;                                  // Sample input containers 1 beacon which is not counted
};

const beaconNotInRange = ([iX, iY]: [number, number], [sX, sY, beaconOffset]: Scanner) => {
  const distance = Math.abs(iX - sX) + Math.abs(iY - sY);   // Distance from scanner to given beacon
  return distance > beaconOffset;                           // Beacon not in range of scanner
};

const part2 = (scanner: Scanner[]): number => {
  const posGradients = [];                                        // 2 Slopes around a scanner with k = +1
  const negGradients = [];                                        // 2 Slopes around a scanner with k = -1
  for (const [sX, sY, beaconOffset] of scanner) {
    // y = kx + d; d = y - kx with k = {+1,-1} and x = {scanner-X +- (beacon-offset + 1)}
    // Slope k = +1
    posGradients.push(sY - sX - beaconOffset - 1); // top-left
    posGradients.push(sY + sX + beaconOffset + 1); // bottom-right
    // Slope k = -1
    negGradients.push(sY + sX + beaconOffset + 1); // top-right
    negGradients.push(sY - sX - beaconOffset - 1); // bottom-left
  }

  for (const posGradient of posGradients) {
    for (const negGradient of negGradients) {
      const [iX, iY] = [                                          // Intersection of all lines around a scanner (perpendicular lines)
        (negGradient - posGradient) / 2,                          // x = (d2 - d1) / 2
        (posGradient + negGradient) / 2,                          // x = (d2 + d1) / 2
      ];
      if (iX < 0 || iY < 0 || iX > 4_000_000 || iY > 4_000_000) { // Intersection point within boundaris
        continue;
      }

      const outside = scanner.every((scanner) => beaconNotInRange([iX, iY], scanner));
      if (outside) {                                              // Beacon is out of reach of all scanners
        return 4_000_000 * iX + iY;
      }
    }
  }

  return -1;
};

const input = readLinesWithRegExp('./res/2022/day15.txt', COORDS_REGEX)
  .map((match) => [+match[0], +match[1], +match[2], +match[3]])
  .map(([sX, sY, bX, bY]) => [
    sX,
    sY,
    Math.abs(bX - sX) + Math.abs(bY - sY),
  ] as Scanner);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

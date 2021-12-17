import { readLinesWithRegExp } from '../io.util';
import { distinct } from '../sets.util';
import { toKey } from '../util';

type Bounds = { x: { min: number; max: number }; y: { min: number; max: number } };

const LINE_REGEX = /.:\sx=(.+)\.\.(.+),.+y=(.+)\.\.(.+)/;               // Match [..]x=minX..maxX, y=(minY)..(maxY)

const launchProbe = (x: number, y: number, bounds: Bounds): boolean => {
  let probePos = [0, 0];                                                // Initial position
  let probeVel = [x, y];                                                // Velocity

  while (probePos[0] <= bounds.x.max && probePos[1] >= bounds.y.min) {  // Probe has not passed the box yet
    probePos = [probePos[0] + probeVel[0], probePos[1] + probeVel[1]];  // Update probe position

    if (probePos[0] >= bounds.x.min && probePos[0] <= bounds.x.max
      && probePos[1] >= bounds.y.min && probePos[1] <= bounds.y.max) {  // Probe hits the box
      return true;
    }

    if (probeVel[0] > 0) {                                              // Decrease/Increase x velocity
      probeVel[0]--;
    } else if (probeVel[0] < 0) {
      probeVel[0]++;
    }

    probeVel[1]--;                                                      // Decrease y velocity
  }

  return false;                                                         // Simulated all positions, no hit
};

const simulate = (bounds: Bounds): [number, number][] => {
  const launches: [number, number][] = [];
  const lowerX = Math.floor((Math.sqrt(1 + 8 * bounds.x.min) - 1) / 2); // Lower x bounds: (x * (x + 1)) / 2 >= minX | solve for x where x is the lower bound

  for (let x = lowerX; x <= bounds.x.max; x++) {                        // Upper bounds: cannot throw farther than the box
    for (let y = bounds.y.min; y <= -bounds.y.min - 1; y++) {           // Cannot drop farther than the box. y-velocities at x=0 will be +v_y and -v_y
      const hit = launchProbe(x, y, bounds);
      if (hit) {
        launches.push([x, y]);
      }
    }
  }

  return launches;
};

/**
 * x and y are independent
 *
 * For the maximum apex, last step will go from 0 --> minY.
 * Steps before from apex are (minY - 1) + (minY - 2) + ... + 1 + 0
 * Triangular numbers magic; n * (n + 1) / 2 for n = abs(minY)
 * (minY - 1) * ((minY - 1) + 1)) / 2 = minY * (minY - 1) / 2
 *
 * Note: minY is considered absolute in this calculations
 * @param bounds
 */
const part1 = (bounds: Bounds): number => {
  const minY = Math.abs(bounds.y.min);

  return (minY * (minY - 1)) / 2;
};

const part2 = (bounds: Bounds): number => {
  const launches = simulate(bounds);
  const velocities = distinct(launches.map((v) => toKey(...v)));

  return velocities.length;
};

const input = readLinesWithRegExp('./res/2021/input17.txt', LINE_REGEX)
  .map(([, minX, maxX, minY, maxY]): Bounds => ({x: {min: +minX, max: +maxX}, y: {min: +minY, max: +maxY}}))[0];
console.log('part1:', part1(input));
console.log('part2:', part2(input));

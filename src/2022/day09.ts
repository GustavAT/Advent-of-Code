import { readAllLinesFilterEmpty } from '../io.util';
import { toKey } from '../util';

const MOVEMENT: Record<string, [number, number]> = {                  // Indicates which direction to move
  'R': [1, 0],
  'D': [0, -1],
  'L': [-1, 0],
  'U': [0, 1],
};

const moveRope = (moves: [string, number][], ropeLength: number): number => {
  const rope: [number, number][] = [...new Array(ropeLength)]         // Init rope segments
    .map(() => [0, 0]);
  const tailVisited = new Set<string>();                              // Positions the tail has visited
  tailVisited.add(toKey(...rope[rope.length - 1]));                   // Tail visits start position

  for (const [direction, count] of moves) {
    const movement = MOVEMENT[direction];                             // Get movement direction
    for (let i = 0; i < count; i++) {                                 // Move n steps to direction
      rope[0] = [rope[0][0] + movement[0], rope[0][1] + movement[1]]; // Advance head by 1 into direction
      for (let j = 1; j < rope.length; j++) {                         // Determine position of all segments (except head)
        const moveX = Math.abs(rope[j][0] - rope[j - 1][0]) > 1;      // Previous rope segment moved in X direction
        const moveY = Math.abs(rope[j][1] - rope[j - 1][1]) > 1;      // Previous rope segment moved in Y direction
        const right = rope[j - 1][0] > rope[j][0];                    // Previous rope segment moved to the right
        const left = rope[j - 1][0] < rope[j][0];                     // Previous rope segment moved to the left
        const up = rope[j - 1][1] > rope[j][1];                       // Previous rope segment moved to up
        const down = rope[j - 1][1] < rope[j][1];                     // Previous rope segment moved down

        if (moveX) {                                                  // Move current segment right/left.
          rope[j] = [
            rope[j][0] + (right ? 1 : -1),
            rope[j][1] + (up ? 1 : (down ? -1 : 0)),                  // Also move up/down if required
          ];
        } else if (moveY) {                                           // Move current segment up/down
          rope[j] = [
            rope[j][0] + (right ? 1 : (left ? -1 : 0)),               // Also move right/left if required
            rope[j][1] + (up ? 1 : -1),
          ];
        }
      }

      tailVisited.add(toKey(...rope[rope.length - 1]));               // Add tail to visited positions
    }
  }

  return tailVisited.size;
};

const part1 = (input: [string, number][]): number => moveRope(input, 2);

const part2 = (input: [string, number][]): number => moveRope(input, 10);

const input = readAllLinesFilterEmpty('./res/2022/day09.txt')
  .map((line) => line.split(' '))
  .map(([direction, count]) => [direction, +count] as [string, number]);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

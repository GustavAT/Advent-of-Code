import { CircularArray } from '../data-structures';
import { readFirstLine } from '../io.util';
import { toKey } from '../util';

type Rock = Array<[number, number]>;
type State = {
  height: number;
  placedRockCount: number;
};

const MINUS: Rock = [[0, 0], [1, 0], [2, 0], [3, 0]];
const PLUS: Rock = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
const ANGLE: Rock = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]];
const PIPE: Rock = [[0, 0], [0, 1], [0, 2], [0, 3]];
const BOX: Rock = [[0, 0], [0, 1], [1, 0], [1, 1]];

const ROCKS = [MINUS, PLUS, ANGLE, PIPE, BOX];

const WALL_OFFSET = 2;
const HEIGHT_OFFSET = 3;
const WIDTH = 7;
const HASH_ROW_COUNT = 10;

const initRock = (rock: Rock, height: number): Rock => {
  return rock.map(([x, y]) => [x + WALL_OFFSET, y + height]);
};

/**
 * Checks if a rock moved in direction would collide with the wall or placed rocks.
 */
const checkCollision = (rock: Rock, cave: Set<string>, direction: [number, number]): boolean => {
  return rock.some(([x, y]) => {
    if (x + direction[0] === WIDTH || x + direction[0] === -1) {    // Check collision with wall
      return true;
    }

    if (y + direction[1] === -1) {                                  // Check collision with bottom of cave
      return true;
    }

    const key = toKey(x + direction[0], y + direction[1]);
    return cave.has(key);                                           // Check collision with placed rocks
  });
};

/**
 * Try to move a rock in given direction. The rock is not moved if there was a collision.
 * @return True if there was a collision, false otherwise
 */
const tryMove = (rock: Rock, cave: Set<string>, direction: [number, number]): boolean => {
  const collision = checkCollision(rock, cave, direction);
  if (collision) {
    return true;
  }
  move(rock, direction);
  return false;
};

/**
 * Move a rock in given direction.
 */
const move = (piece: Rock, direction: [number, number]): void => {
  piece.forEach((pos) => {
    pos[0] += direction[0];
    pos[1] += direction[1];
  });
};

/**
 * Hash the current simulation state.
 * The has consists of: jet-index, rock-index and the last #count rows of the cave starting from index.
 */
const hashState = (jet: number, rockIndex: number, cave: Set<string>, index: number, count: number): string => {
  const parts = [jet, rockIndex];
  for (let y = index; y > (index - count); y--) {
    for (let x = 0; x < WIDTH; x++) {
      const value = cave.has(toKey(x, y));
      parts.push(+value);
    }
  }
  return toKey(...parts);
};

const simulate = (input: string, totalRockCount: number): number => {
  const jets = new CircularArray(input.split(''));            // Jets pushing rocks left/right
  const rocks = new CircularArray(ROCKS);                     // Next rock to fall
  let height = 0;                                             // Current height cached

  let totalCycleHeight = 0;                                   // Height gained from skipping cycles
  const cave = new Set<string>();                             // Placed rocks in the cave
  const visitedStates = new Map<string, State>();             // List of visited states for cycle detection
  for (let placedRockCount = 0; placedRockCount < totalRockCount; placedRockCount++) {
    const nextRock = rocks.next();
    const rock = initRock(nextRock, height + HEIGHT_OFFSET);  // Place a new rock in the cave

    for (; ;) {
      const jet = jets.next();
      if (jet === '>') {
        tryMove(rock, cave, [1, 0]);                          // Push right if possible
      } else {
        tryMove(rock, cave, [-1, 0]);                         // Push left if possible
      }

      if (tryMove(rock, cave, [0, -1])) {                     // Push down if possible
        break;                                                // Rock stopped, break
      }
    }

    rock.forEach(([x, y]) => {
      cave.add(toKey(x, y));                                  // Place rock in the cave
      height = Math.max(height, y + 1);                       // Update the total height
    });

    const stateKey = hashState(jets.getIndex(), rocks.getIndex(), cave, height - 1, HASH_ROW_COUNT);  // Cache current state
    if (visitedStates.has(stateKey)) {                                                                // Check if state was seen before -> cycle
      const state = visitedStates.get(stateKey)!;                                                     // Get state of cycle start
      const cycleLength = placedRockCount - state.placedRockCount;                                    // # of placed rocks within a cycle
      const cycleHeight = height - state.height;                                                      // Height of one cycle
      const remainingIterations = Math.floor((totalRockCount - placedRockCount) / cycleLength);       // # of cycles until total-rock count is reached
      placedRockCount += cycleLength * remainingIterations;                                           // Advance current placed rock count by skipping cycles
      totalCycleHeight += cycleHeight * remainingIterations;                                          // Height gained from skipping cycles
    } else {
      visitedStates.set(stateKey, {height, placedRockCount});                                         // New state, add to visited states
    }
  }

  return totalCycleHeight + height;                           // Total height = height of cave + height from skipping cycles
};


const part1 = (jets: string): number => simulate(jets, 2022);

const part2 = (jets: string): number => simulate(jets, 1_000_000_000_000);

const input = readFirstLine('./res/2022/day17.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

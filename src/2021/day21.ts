import { readAllLines } from '../io.util';
import { toKey } from '../util';

const INPUT_REGEX = /(\d+)$/;                               // Last number of string

const parse = (input: string[]): [number, number] => {
  const [p1] = input[0].match(INPUT_REGEX)!;
  const [p2] = input[1].match(INPUT_REGEX)!;

  return [+p1 - 1, +p2 - 1];                                // First position = 0
};

/**
 * General idea is Dynamic Programming
 * Cache the number of wins all players and scores = P1 * score P1 * P2 * score P2 = 10 * 21 * 10 * 21 = 44100 entries
 */
const countWins = (
  p1: number,
  scoreP1: number,
  p2: number,
  scoreP2: number,
  cache: Map<string, [number, number]>,
): [number, number] => {
  if (scoreP2 >= 21) {                                      // It is sufficient to check if P2 has won
    return [0, 1];                                          // P1 played in the previous step which is P2 in this step
  }

  const key = toKey(p1, scoreP1, p2, scoreP2);
  if (cache.has(key)) {                                     // Number of wins for this state is already known
    return cache.get(key)!;
  }

  const wins: [number, number] = [0, 0];
  for (const roll1 of [1, 2, 3]) {                          // Iterate all 27 (3*3*3) possible dice rolls
    for (const roll2 of [1, 2, 3]) {
      for (const roll3 of [1, 2, 3]) {
        const newPos = (p1 + roll1 + roll2 + roll3) % 10;   // Advance by rolled dice
        const newScore = scoreP1 + newPos + 1;              // Score = Player position + 1 (correction for index 0)
        const [winsP2, winsP1] =                            // Determine wins of next dice rolls
          countWins(p2, scoreP2, newPos, newScore, cache);  // P1 and P2 swap position as P2 now rolls the dice
        wins[0] += winsP1;
        wins[1] += winsP2;
      }
    }
  }

  cache.set(key, wins);                                     // Cache this state

  return wins;
};

const part1 = (input: string[]): number => {
  let players = parse(input);                               // Positions of [P1, P2]
  let scores = [0, 0];                                      // Scores of [P1, P2]
  let dice = 6;                                             // First 3 rolls = 6
  let rolls = 0;                                            // Number of dice rolls

  while (scores[0] < 1000 && scores[1] < 1000) {
    const turn = rolls % 2;                                 // Players roll dice alternating. First turn = P1
    players[turn] = (players[turn] + dice) % 10;            // Player moves on a 10-grid field by the number rolled by the dice
    scores[turn] += players[turn] + 1;                      // Score = Player position + 1 (correction for index 0)
    dice += 9;                                              // A017233
    rolls += 3;                                             // 3 dice rolled
  }

  return Math.min(...scores) * rolls;
};

const part2 = (input: string[]): number => {
  const [p1, p2] = parse(input);
  const wins = countWins(p1, 0, p2, 0, new Map());

  return Math.max(...wins);
};

const input = readAllLines('./res/2021/input21.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

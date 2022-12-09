import {  readAllLinesFilterEmpty } from '../io.util';
import { toKey } from '../util';

const part1 = (trees: number[][]): number => {          // Too lazy to refactor :(
  const visibleTrees = new Set();

  for (let x = 0; x < trees[0].length; x++) {           // For each column
    visibleTrees.add(toKey(0, x));                // Tree from edge is tallest
    let tallest = trees[0][x];
    for (let y = 0; y < trees.length - 1; y++) {        // Look down
      if (trees[y][x] > tallest) {                      // Current tree is bigger than tallest?
        visibleTrees.add(toKey(y, x));                  // Found visible tree
        tallest = trees[y][x];                          // Set new tallest tree
      }
      if (trees[y][x] === 9) {                          // 9 is the maximum tree size
        break;
      }
    }
  }

  for (let x = 0; x < trees[0].length; x++) {           // For each column
    visibleTrees.add(toKey(trees.length - 1, x));
    let tallest = trees[trees.length - 1][x];
    for (let y = trees.length - 1; y > 0; y--) {        // Look up
      if (trees[y][x] > tallest) {
        visibleTrees.add(toKey(y, x));
        tallest = trees[y][x];
      }
      if (trees[y][x] === 9) {
        break;
      }
    }
  }

  for (let y = 0; y < trees.length; y++) {              // For each row
    visibleTrees.add(toKey(y, 0));
    let tallest = trees[y][0];
    for (let x = 0; x < trees[0].length; x++) {         // Look left
      if (trees[y][x] > tallest) {
        visibleTrees.add(toKey(y, x));
        tallest = trees[y][x];
      }
      if (trees[y][x] === 9) {
        break;
      }
    }
  }

  for (let y = 0; y < trees.length; y++) {              // For each row
    visibleTrees.add(toKey(y, trees[0].length - 1));
    let tallest = trees[y][trees[0].length - 1];
    for (let x = trees[0].length - 1; x > 0; x--) {     // Look right
      if (trees[y][x] > tallest) {
        visibleTrees.add(toKey(y, x));
        tallest = trees[y][x];
      }
      if (trees[y][x] === 9) {
        break;
      }
    }
  }

  return visibleTrees.size;
};

const getScore = (trees: number[][], [x, y]: [number, number]): number => {
  const size = trees[y][x];
  let a = 0;
  for (let i = x - 1; i >= 0; i--) {                    // Look left from current tree
    a++;
    if (trees[y][i] >= size) {                          // Until a tree bigger or same size appears
      break;
    }
  }

  let b = 0;
  for (let i = x + 1; i < trees[0].length; i++) {       // Look right
    b++;
    if (trees[y][i] >= size) {
      break;
    }
  }

  let c = 0;
  for (let j = y - 1; j >= 0; j--) {                    // Look down
    c++;
    if (trees[j][x] >= size) {
      break;
    }
  }

  let d = 0;
  for (let j = y + 1; j < trees.length; j++) {          // Look up
    d++;
    if (trees[j][x] >= size) {
      break;
    }
  }

  return a * b * c * d;                                 // Score = product of each direction viewing-scores
}

const part2 = (trees: number[][]): number => {
  let score = -1;

  for (let x = 0; x < trees[0].length; x++) {
    for (let y = 0; y < trees.length; y++) {
      const newScore= getScore(trees, [x, y]);          // Calculate viewing-score for each tree
      if (newScore > score) {                           // Update a better viewing-score
        score = newScore;
      }
    }
  }

  return score;
};

const input = readAllLinesFilterEmpty('./res/2022/day08.txt')
  .map((line) => [...line].map((tree) => +tree));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

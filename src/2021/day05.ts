import { sum } from '../arrays.util';
import { readLinesWithRegExp } from '../io.util';

const LINE_REGEX = /(\d+),(\d+)\s->\s(\d+),(\d+)/;  // x1,y1 -> x2,y2

type Point = { x: number, y: number };              // Convenience type for Point (x/y) and Line (p1,p2)
type Line = { p1: Point, p2: Point };

const initializeField = (input: Line[]): number[][] => {
  const maxX = Math.max(...input.map((line) => Math.max(line.p1.x, line.p2.x))) + 1;      // Find greatest X
  const maxY = Math.max(...input.map((line) => Math.max(line.p1.y, line.p2.y))) + 1;      // Find greatest Y
  return [...Array(maxY)].map(() => [...Array(maxX)].map(() => 0));                       // Initialize empty field
};

const part1 = (input: Line[]): number => {
  const field = initializeField(input);

  for (const line of input) {
    if (line.p1.x === line.p2.x) {                                  // Vertical line, x = fixed
      const minY = Math.min(line.p1.y, line.p2.y);                  // Smallest y
      const maxY = Math.max(line.p1.y, line.p2.y);                  // Greatest y
      for (let y = minY; y <= maxY; y++) {                          // Iterate from bottom to top
        field[y][line.p1.x] += 1;                                   // Update intersections
      }
    } else if (line.p1.y === line.p2.y) {                           // Horizontal line, y = fixed
      const minX = Math.min(line.p1.x, line.p2.x);
      const maxX = Math.max(line.p1.x, line.p2.x);
      for (let x = minX; x <= maxX; x++) {                          // Iterate line from left to right
        field[line.p1.y][x] += 1;
      }
    }
  }

  return sum(field.map((row) => row.filter((n) => n > 1).length));  // Sum the number of intersections
};

const part2 = (input: Line[]): number => {
  const field = initializeField(input);

  for (const line of input) {
    if (line.p1.x === line.p2.x) {
      const minY = Math.min(line.p1.y, line.p2.y);
      const maxY = Math.max(line.p1.y, line.p2.y);
      for (let y = minY; y <= maxY; y++) {
        field[y][line.p1.x] += 1;
      }
    } else if (line.p1.y === line.p2.y) {
      const minX = Math.min(line.p1.x, line.p2.x);
      const maxX = Math.max(line.p1.x, line.p2.x);
      for (let x = minX; x <= maxX; x++) {
        field[line.p1.y][x] += 1;
      }
    } else {
      const yFactor = line.p1.y < line.p2.y ? 1 : -1;                                 // 1 = bottom to top, -1 = top to bottom
      const xFactor = line.p1.x < line.p2.x ? 1 : -1;                                 // 1 = left to right, -1 = right to left
      const delta = Math.abs(line.p1.x - line.p2.x)                                   // Length of the line on x-axis (= same as y-axis as 45 degree)

      for (let i = 0; i <= delta; i++) {                                              // Iterate line and update intersections
        field[line.p1.y + (i * yFactor)][line.p1.x + (i * xFactor)] += 1;
      }
    }
  }

  return sum(field.map((row) => row.filter((n) => n > 1).length));
};

const input = readLinesWithRegExp('./res/2021/input05.txt', LINE_REGEX)
  .map(([, x1, y1, x2, y2]): Line =>
    ({p1: {x: +x1, y: +y1}, p2: {x: +x2, y: +y2}}));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

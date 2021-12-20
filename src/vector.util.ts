export type Vector = [number, number, number];

/**
 * Manhattan distance between given vectors
 */
export const distance = (v1: Vector, v2: Vector): number =>
  Math.abs(v1[0] - v2[0]) + Math.abs(v1[1] - v2[1]) + Math.abs(v1[2] - v2[2]);

/**
 * Difference between given vectors, v1 - v2
 */
export const difference = (v1: Vector, v2: Vector): Vector =>
  [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];

/**
 * Sum given vectors, v1 + v2
 */
export const translate = (v1: Vector, v2: Vector): Vector =>
  [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];

/**
 * True if v1 === v2
 */
export const equals = (v1: Vector, v2: Vector): boolean =>
  v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];

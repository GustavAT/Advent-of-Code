/**
 * Sum numbers of given array
 * @param a Array of numbers
 */
export const sum = (a: number[]): number => a.reduce((acc, cur) => acc + cur, 0);
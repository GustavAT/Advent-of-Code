/**
 * Sum numbers of given array
 * @param a Array of numbers
 */
export const sum = (a: number[]): number => a.reduce((acc, cur) => acc + cur, 0);

/**
 * Multiply numbers of given array.
 * @param a Array of numbers with at least 1 element
 */
export const product = (a: number[]): number => a.reduce((acc, cur) => acc * cur, 1);

/**
 * Converts binary number in given array to number with base 10.
 * @param a Array of '0's and '1's
 */
export const toNumber = (a: any[]) => parseInt(a.map((x) => +x)
  .join(''), 2);

export const toIndex = (index: number) => (a: any[]) => a[index];

/**
 * Return a new sorted array without modifying given array a
 * @param a Source array
 */
export const sort = (a: number[]) => [...a].sort((x, y) => x - y);

/**
 * Return a new reversed array without modifying given array a
 * @param a Source array
 */
export const reverse = <T>(a: T[]): T[] => [...a].reverse();

/**
 * Sum numbers of given array
 * @param a Array of numbers
 */
export const sum = (a: number[]): number => a.reduce((acc, cur) => acc + cur, 0);

/**
 * Converts binary number in given array to number with base 10.
 * @param a Array of '0's and '1's
 */
export const toNumber = (a: any[]) => parseInt(a.map((x) => +x).join(''), 2);

export const toIndex = (index: number) => (a: any[]) => a[index];
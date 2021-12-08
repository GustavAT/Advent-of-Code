export const intersect = <T>(a: T[], b: T[]): T[] =>
    a.filter((x) => b.includes(x));

export const minus = <T>(a: T[], b: T[]): T[] =>
    a.filter((x) => !b.includes(x));

export const union = <T>(a: T[], b: T[]): T[] =>
    distinct([...a, ...b]);

export const distinct = <T>(a: T[]): T[] =>
    a.filter((x, idx) => idx === a.indexOf(x));

export const count = <T>(a: T[], value: T): number =>
    a.reduce((count, x) => count + +(x === value), 0);

export const maximum = <T>(a: T[]): T | undefined => {
    if (a.length === 0) {
        return undefined;
    }

    let maximum = a[0];
    for (let i = 1; i < a.length; i++) {
        if (a[i] > maximum) {
            maximum = a[i];
        }
    }

    return maximum;
};

/**
 * Returns true if a includes every element in b: B \ A = O
 * @param a Source array
 * @param b Target array
 */
export const contains = <T>(a: T[], b: T[]): boolean =>
  b.every((x) => a.includes(x));

/**
 * Returns true if a and b contain the same elements: A \ B = B \ A = 0
 * @param a
 * @param b
 */
export const equals = <T>(a: T[], b: T[]): boolean =>
  contains(a, b) && contains(b, a);

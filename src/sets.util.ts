export const intersect = <T>(a: T[], b: T[]): T[] =>
    a.filter((x) => b.includes(x));

export const minus = <T>(a: T[], b: T[]): T[] =>
    a.filter((x) => !b.includes(x));

export const union = <T>(a: T[], b: T[]): T[] =>
    distinct([...a, ...b]);

export const distinct = <T>(a: T[]): T[] =>
    a.filter((x, idx) => idx === a.indexOf(x));

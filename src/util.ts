export const groupInput = (input: string[]): string[][] => {
    const groups: string[][] = [];

    let group = [];
    for (const line of input) {
        if (line.length === 0) {
            groups.push(group);
            group = [];
        } else {
            group.push(line);
        }
    }

    return groups;
}

/**
 * Extended Euclidean Algorithm
 * with ax + by = gcd(a,b)
 * 
 * returns [gcd(a,b), x, y]
 */
export const extendedEuclid = (a: bigint, b: bigint): [bigint, bigint, bigint] => {
    if (b == 0n) {
        return [a, 1n, 0n];
    }

    const [d, x, y] = extendedEuclid(b, a % b);

    return [d, y, x - a / b * y];
}

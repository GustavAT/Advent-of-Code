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

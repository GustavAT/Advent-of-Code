import { readAllLinesFilterEmpty } from '../io.util';

type Policy = { min: number; max: number; char: string };
type Password = { policy: Policy; password: string; };

const lineToPasswordPolicy = (line: string): Password => {
    const [left, password] = line.split(':').map((part) => part.trim());
    const [minMax, char] = left.split(' ');
    const [min, max] = minMax.split('-').map((number) => parseInt(number));

    return { policy: { min, max, char }, password };
};

const isValid1 = (input: Password): boolean => {
    const { min, max, char } = input.policy;
    const count = input.password.split(char).length - 1;

    return min <= count && count <= max;
}

const isValid2 = (input: Password): boolean => {
    const password = input.password;
    const { min, max, char } = input.policy;

    return password[min - 1] === char && password[max - 1] !== char ||
        password[min - 1] !== char && password[max - 1] === char;
}

const part1 = (passwords: Password[]): number => {
    return passwords.reduce((total, current) => total + (isValid1(current) ? 1 : 0), 0);
}

const part2 = (passwords: Password[]): number => {
    return passwords.reduce((total, current) => total + (isValid2(current) ? 1 : 0), 0);
}

const input = readAllLinesFilterEmpty('./res/2020/input02.txt').map(lineToPasswordPolicy);
console.log('Valid passwords (policy 1):', part1(input));
console.log('Valid passwords (policy 2):', part2(input));

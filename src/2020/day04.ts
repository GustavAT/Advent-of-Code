import { readAllLines } from '../io.util';
import { groupInput } from '../util';

const validateBoundaries = (value: string, min: number, max: number): boolean => {
    const number = parseInt(value);

    return !(isNaN(number) || number < min || number > max)
}

const validateHeight = (value: string): boolean => {
    if (value.endsWith('cm')) {
        return validateBoundaries(value.substr(0, value.length - 2), 150, 193);
    } else if (value.endsWith('in')) {
        return validateBoundaries(value.substr(0, value.length - 2), 59, 76);
    }

    return false;
}

const HEX_COLOR_REG_EXP = RegExp(/^#([0-9a-f]{6})$/i);
const validateHexColor = (color: string): boolean => {
    return HEX_COLOR_REG_EXP.test(color);
}

const EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const validateEyeColor = (value: string): boolean => {
    return EYE_COLORS.includes(value);
}

const NINE_DIGIT_REG_EXP = RegExp(/^\d{9}$/);
const validate9DigitNumber = (value: string): boolean => {
    return NINE_DIGIT_REG_EXP.test(value);
}

const isValid1 = (passport: { [key: string]: string }): boolean => {
    return passport['byr'] !== undefined && passport['iyr'] !== undefined &&
        passport['eyr'] !== undefined && passport['hgt'] !== undefined &&
        passport['hcl'] !== undefined && passport['ecl'] !== undefined &&
        passport['pid'] !== undefined;
}

const isValid2 = (passport: { [key: string]: string }): boolean => {
    return validateBoundaries(passport['byr'], 1920, 2002) &&
        validateBoundaries(passport['iyr'], 2010, 2020) &&
        validateBoundaries(passport['eyr'], 2020, 2030) &&
        validateHeight(passport['hgt'] || '') &&
        validateHexColor(passport['hcl']) &&
        validateEyeColor(passport['ecl']) &&
        validate9DigitNumber(passport['pid']);
}

const getPassports = (input: string[]): { [key: string]: string }[] => {
    return groupInput(input)
        .map((g) =>
            g.join(' ').split(' ').reduce((p, kvp) => {
                const [key, value] = kvp.split(':');
                p[key] = value;

                return p;
            }, {} as { [key: string]: string })
        );
}

const part1 = (input: string[]): number => {
    const passports = getPassports(input);

    return passports.reduce((total, passport) => total += (isValid1(passport) ? 1 : 0), 0);
}

const part2 = (input: string[]): number => {
    const passports = getPassports(input);

    return passports.reduce((total, passport) => total += (isValid2(passport) ? 1 : 0), 0);
}

const input = readAllLines('./res/2020/input04.txt');
console.log('Valid passports (part 1):', part1(input));
console.log('Valid passports (part 2):', part2(input));

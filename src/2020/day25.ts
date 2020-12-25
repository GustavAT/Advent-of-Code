import { readAllLinesFilterEmpty } from '../io.util';

const parseInput = (input: string[]): { cardPubKey: bigint, doorPubKey: bigint } => {
    return {
        cardPubKey: BigInt(input[0]),
        doorPubKey: BigInt(input[1]),
    };
}

const calculateLoopSize = (publicKey: bigint, subjectNumber: bigint): number => {
    let value = 1n;
    let n = 0;

    for (; value !== publicKey;) {      // After n steps, calculations will result in the public key
        value *= subjectNumber;
        value %= 20201227n;

        n++;
    }

    return n;
}

const calculateSecret = (n: number, publicKey: bigint): bigint => {
    let value = 1n;

    for (let i = 0; i < n; i++) {       // Perform calculations for n steps
        value *= publicKey;
        value %= 20201227n;
    }

    return value;
}

const part1 = (input: string[]): bigint => {
    const { cardPubKey, doorPubKey } = parseInput(input);

    const cardLoopSize = calculateLoopSize(cardPubKey, 7n);
    const secret = calculateSecret(cardLoopSize, doorPubKey);

    return secret;
}

const input = readAllLinesFilterEmpty('./res/2020/input25.txt');
console.log('Encryption key (part 1):', part1(input));

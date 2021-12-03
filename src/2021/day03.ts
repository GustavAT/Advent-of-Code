import { toNumber, toIndex } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';
import { identity, transpose } from '../util';

const part1 = (input: number[][]): number => {
  let gamma = [], epsilon = [], bits = transpose(input);                  // Transpose input to iterate bits in each position

  for (const b of bits) {
    const ones = b.filter(identity).length;                               // 1s map to a truthy value
    const zeros = b.length - ones;                                        // Remaining must be 0s

    gamma.push(+(zeros<ones));                                            // Map boolean to 0|1
    epsilon.push(+(zeros>ones));                                          // Gamma: 0 = (0 > 1), Epsilon: 0 = (0 < 1)
  }

  return toNumber(gamma) * toNumber(epsilon);
};

const part2 = (input: number[][]): number => {
  let oxygen = [...input], co2 = [...input];

  for (let i = 0; i < input[0].length; i++) {
    if (oxygen.length > 1) {
      const oxygenOnes = oxygen.map(toIndex(i))                           // Map number to bit at current position
        .filter(identity).length;                                         // 1s map to a truthy value
      const oxygenZeros = oxygen.length - oxygenOnes;                     // Remaining must be 0s

      oxygen = oxygen.filter((bits) => oxygenOnes >= oxygenZeros ? bits[i] : !bits[i]);
    }

    if (co2.length > 1) {
      const co2Ones = co2.map(toIndex(i))
        .filter(identity).length;
      const co2Zeros = co2.length - co2Ones;

      co2 = co2.filter((bits) => co2Zeros > co2Ones ? bits[i] : !bits[i]);
    }
  }

  return toNumber(oxygen[0]) * toNumber(co2[0]);
};

const input = readAllLinesFilterEmpty('./res/2021/input03.txt')
  .map((line) => line.split('').map((bit) => +bit));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

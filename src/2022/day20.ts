import { mapWithIndex, sum } from '../arrays.util';
import { readAllLinesFilterEmpty } from '../io.util';

const TARGETS = [1000, 2000, 3000];

const encrypt = (input: number[], iterations = 1, seed = 1): number[] => {
  const numbers = mapWithIndex(input.map((value) => value * seed));       // Map each value to it's index and value

  for (let i = 0; i < iterations; i++) {
    for (let i = 0; i < numbers.length; i++) {                            // Process each number
      const deletionIndex = numbers.findIndex(({index}) => index === i);  // Select next number in the order they first occurred
      const value = numbers.splice(deletionIndex, 1)[0].value;            // Remove current element. !! Note: the array's size shrinks by 1 !!
      let insertIndex = (deletionIndex + value) % (numbers.length);       // Calculate the next insert-index, negative indexes are ok since we're using splice. Length of array is still reduced by 1
      numbers.splice(insertIndex, 0, {value, index: i});                  // Insert element at position
    }
  }

  return numbers.map(({value}) => value);                                 // Map value-index pair to value
};

const getCoordinates = (numbers: number[]): number => {
  const zeroIndex = numbers.indexOf(0);                   // Find index of 0
  const targets = TARGETS                                 // For each target-index
    .map((index) => (index + zeroIndex) % numbers.length) // Calculate index-0 offset from target
    .map((index) => numbers[index]);

  return sum(targets);
};

const part1 = (input: number[]): number => {
  const result = encrypt(input);
  return getCoordinates(result);
};

const part2 = (input: number[]): number => {
  const result = encrypt(input, 10, 811589153);
  return getCoordinates(result);
};

const input = readAllLinesFilterEmpty('./res/2022/day20.txt')
  .map(Number);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

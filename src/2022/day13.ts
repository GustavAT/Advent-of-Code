import { readAllLines } from '../io.util';
import { groupInput } from '../util';

type Packet = Array<Packet | number>;

// Leaving the parser here for completeness
// Input is a valid JavaScript array - no need to parse the input manually
const parsePackets = (line: string[]): Packet | number | undefined => {
  const packet: Packet = [];
  if (line[0] === '[') {
    line.splice(0, 1);

    for (; ;) {
      const parsed = parsePackets(line);
      if (parsed !== undefined) {
        packet.push(parsed);
      }

      const token = line.splice(0, 1)[0];

      if (token === ']') {
        break;
      }
    }
  } else if (line[0] === ']') {
    return undefined;
  } else {
    let buffer = '';
    for (; ;) {
      const token = line[0];
      if (token === ',' || token === ']') {
        break;
      }

      buffer += line.splice(0, 1)[0];
    }

    return +buffer;
  }

  return packet;
};

const compare = (left: Packet | number, right: Packet | number): boolean | undefined => {
  if (typeof left === 'number' && typeof right === 'number') {  // Both numbers
    return left === right
      ? undefined                                               // Continue if both are equal
      : left < right;                                           // Compare left to right
  }

  if (typeof left === 'number' && typeof right !== 'number') {
    return compare([left], right);                              // wrap left in array
  }

  if (typeof left !== 'number' && typeof right === 'number') {
    return compare(left, [right]);                              // wrap right in array
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {                     // Both are arrays
      if (i === right.length) {                                 // Right runs out of items
        return false;
      }

      const result = compare(left[i], right[i]);
      if (result !== undefined) {                               // Comparison gave a definite result
        return result;
      }
    }

    if (left.length < right.length) {                           // Left runs out of items
      return true;
    }

    return undefined;                                           // Both arrays are the same
  }

  return false;                                                 // Unreachable code
};

const part1 = (packets: [Packet, Packet][]): number => {
  let result = 0;

  for (let i = 0; i < packets.length; i++) {
    const [p1, p2] = packets[i];
    if (compare(p1, p2)) {
      result += 1 + i;                                          // Packets are equal, add index + 1
    }
  }

  return result;
};

const part2 = (packets: [Packet, Packet][]): number => {
  const key1 = [[2]];
  const key2 = [[6]];
  const all = [...packets.flat(), key1, key2] as Packet[];      // Add all packets + 2 decoder keys

  all.sort((p1, p2) => {
    const result = compare(p1, p2);
    return result ? -1 : 1;                                     // Sort all by utilizing the comparison function from part-1
  });

  const key1Index = all.indexOf(key1) + 1;                      // Find indices of decoder keys 1 and 2
  const key2Index = all.indexOf(key2) + 1;

  return key1Index * key2Index;
};

const input = groupInput(readAllLines('./res/2022/day13.txt'))
  .map((group) => [
    JSON.parse(group[0]),                                       // Input is a valid JavaScript array
    JSON.parse(group[1]),                                       // No need to write a parser :(
  ] as [Packet, Packet]);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

import { product, sum } from '../arrays.util';
import { readAllLines } from '../io.util';

type Packet = {                     // Helper type for packet information
  version: number;                  // Version
  type: number;                     // Type: 4 .. literal value, other .. operator
  value?: number;                   // Value: defined if type == 4
  operatorId?: number;              // Operator type: defined if type != 4
  subPackets: Packet[];             // Sub-packets: Has values if type != 4
};

const OPERATORS: Record<number, (values: number[]) => number> = {
  0: (v) => sum(v),                 // Sum
  1: (v) => product(v),             // Product
  2: (v) => Math.min(...v),         // Minimum
  3: (v) => Math.max(...v),         // Maximum
  5: (v) => v[0] > v[1] ? 1 : 0,    // 1 if l > r else 0
  6: (v) => v[0] < v[1] ? 1 : 0,    // 1 if l < r else 0
  7: (v) => v[0] === v[1] ? 1 : 0,  // 1 if l = r else 0
};

const toBinary = (packets: string): string[] => {
  const binary = packets
    .split('')                      // Split at each character
    .map((p) => parseInt(p, 16)     // Parse hex to base 10
      .toString(2)                  // Base 10 to binary
      .padStart(4, '0'));           // Pad number with leading 0s

  return binary.join('')            // Join binary numbers
    .split('');
};

const readNextBits = (count: number, packets: string[]): string => {
  return packets.splice(0, count)   // Read next 'count' bits from packet string
    .join('');
};

const readLiteral = (packets: string[]): number => {
  let binary = '';

  for (; ;) {
    const group = readNextBits(5, packets);                     // Read next group (5 bits) from packet string
    binary += group.substr(1);                                  // Value are last 4 bits

    if (group[0] === '0') {                                     // Bit 1 of group unset -> last group reached
      break;
    }
  }

  return parseInt(binary, 2);
};

const readPacket = (packets: string[]): Packet | undefined => {
  const version = parseInt(readNextBits(3, packets), 2);        // Version: first 3 bits
  const type = parseInt(readNextBits(3, packets), 2);           // Type: next 3 bits

  const packet: Packet = {
    version,
    type,
    subPackets: [],
  };

  if (type === 4) {
    packet.value = readLiteral(packets);
  } else {
    packet.operatorId = parseInt(readNextBits(1, packets), 2);  // Operator ID: next 1 bits
    if (packet.operatorId === 0) {
      const length = parseInt(readNextBits(15, packets), 2);    // ID 0: Next 15 bits = length of sub-packets
      const subPackets = packets.splice(0, length);
      while (subPackets.length > 0) {                           // Read all sub-packets
        const subPacket = readPacket(subPackets)!;
        packet.subPackets.push(subPacket);
      }
    } else {
      const count = parseInt(readNextBits(11, packets), 2);     // ID 1: Next 11 bits = number of sub-packets
      for (let i = 0; i < count; i++) {                         // Read all sub-packets
        const subPacket = readPacket(packets)!;
        packet.subPackets.push(subPacket);
      }
    }
  }

  return packet;
};

const countP1 = (packet: Packet): number => {
  let count = packet.version;                                   // Count version of current packet
  for (const subPacket of packet.subPackets) {
    count += countP1(subPacket);                                // Add version count of sub packets recursively
  }

  return count;
};

const countP2 = (packet: Packet): number => {
  if (packet.subPackets.length === 0) {                         // Version without sub-packets returns its value
    return packet.value!;
  }

  const calcFn = OPERATORS[packet.type];                        // Get operator for packet type
  const values = packet.subPackets.map((p) => countP2(p));      // Get values for all sub-packets

  return calcFn(values);                                        // Apply operator to all sub-packet values
};

const part1 = (input: string): number => {
  const code = toBinary(input);
  const packet = readPacket(code)!;

  return countP1(packet);
};

const part2 = (input: string): number => {
  const code = toBinary(input);
  const packet = readPacket(code)!;

  return countP2(packet);
};

const input = readAllLines('./res/2021/input16.txt')[0];
console.log('part1:', part1(input));
console.log('part2:', part2(input));

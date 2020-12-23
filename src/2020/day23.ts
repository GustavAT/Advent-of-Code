import { Node } from '../data-structures';
import { readAllLines } from '../io.util';
import { maximum } from '../sets.util';

const parseInput = (input: string[]): number[] =>
    input[0].split('').map(Number);

const initializeLinkedList = (numbers: number[]): Node[] => {   // Initialize a doubly linked list from given numbers
    const nodes = Array<Node>(numbers.length + 1);

    let previous: Node | undefined = undefined;
    for (const number of numbers) {
        const node = new Node(number);                          // Create new node
        nodes[number] = node;                                   // Assign to index of its value

        if (previous !== undefined) {                           // Extra check since the first created node does not have a predecessor
            previous.next = node;                               // Link current node with previous node
            node.previous = previous;
        }

        previous = node;                                        // Save node from previous iteration
    }

    const head = nodes[numbers[0]];                             // Head node corresponds to the first value in the numbers list
    head.previous = previous!;                                  // Link head node with tail node
    previous!.next = head;

    return nodes;
}

const findDestinationCup = (currentValue: number, maximum: number, slice: Node): number => {
    const skipValues = [slice.value, slice.next.value, slice.next.next.value];      // Next three numbers in the slice are skipped when finding the new destination

    let destination = currentValue === 1 ? maximum : currentValue - 1;              // Wrap destination value if it gets < 1 (there is no cup 0)
    while (skipValues.includes(destination)) {                                      // Repeat until a suitable cup is found
        destination = destination === 1 ? maximum : destination - 1;                // Increment the destination cup. Wrap if necessary
    }

    return destination;
}

const cupsToString = (head: Node): string => {  // Print out all cup values starting after given 'head' node
    const values = [];

    let current = head.next;
    while (current !== head) {
        values.push(current.value);
        current = current.next;
    }

    return values.join('');
}

const playCrabGame = (numbers: number[], rounds: number, part1: boolean): string | number => {
    const nodes = initializeLinkedList(numbers);        // Initialize the doublye linked list. A cup label corresponds to the index in this list

    let current = nodes[numbers[0]];                    // Start with the node corresponding to the first number
    const max = maximum(numbers)!;                      // Math.max exceedes the stack size for large arrays.

    for (let round = 0; round < rounds; round++) {
        const sliceStart = current.next;                // Remove the three cups after the current cup and link remaining nodes accordingly with the next cup
        const sliceEnd = sliceStart.next.next;          // Example: c <-> s1 <-> s2 <-> s3 <-> n
        current.next = sliceEnd.next;                   // Link c to n: c --> n
        current.next.previous = current;                // Link n to c: c <-> n (Note: nodes from the slice still link to c, n but it does not matter at this time)

        const destination = findDestinationCup(current.value, max, sliceStart);

        const destStart = nodes[destination];           // Insert the slice after the destination cup
        const destEnd = destStart.next;                 // Before: ds <-> de; After: ds <-> s1 <-> s2 <-> s3 <-> de

        destStart.next = sliceStart;                    // Link the start of the slice
        sliceStart.previous = destStart;                // ds <-> s1 <-> s2 ...

        sliceEnd.next = destEnd;                        // LInk the end of the slice
        destEnd.previous = sliceEnd;                    // ... s2 <-> s3 <-> de

        current = current.next;                         // Next cup after the current cup is considered for the next round
    }

    if (part1) {
        return cupsToString(nodes[1]);
    }

    return nodes[1].next.value * nodes[1].next.next.value;
}

const part1 = (input: string[]): string => {
    const cups = parseInput(input);

    return playCrabGame(cups, 100, true) as string;
}

const part2 = (input: string[]): number => {
    const cups = parseInput(input);

    const maximum = Math.max(...cups);                      // Find the highest cup
    const filler = Array<number>(1000000 - cups.length)     // Create an empty array for the remaining 1000000 - cups
        .fill(0)
        .map((_, index) => maximum + index + 1);            // Fill array starting at the highest cup + 1

    return playCrabGame([...cups, ...filler], 10000000, false) as number;
}

const input = readAllLines('./res/2020/input23.txt');
console.log('Labels after Cup 1 (part 1):', part1(input));
console.log('Product after Cup 1 (part 2):', part2(input));

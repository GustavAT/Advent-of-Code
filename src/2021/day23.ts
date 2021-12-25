import { MinPriorityQueue, PriorityQueueItem } from '@datastructures-js/priority-queue';
import { readAllLinesFilterEmpty } from '../io.util';
import { transpose } from '../util';

const INPUT_REGEX = /#|\s/g;                                            // Matches '#' and whitespace

type Amphipod = 'A' | 'B' | 'C' | 'D';
type Move = { board: string, cost: number };

const HALLWAY = [0, 1, 3, 5, 7, 9, 10];
const AMPHIPOD_DOORS: Record<Amphipod, number> = {'A': 2, 'B': 4, 'C': 6, 'D': 8};
const AMPHIPOD_ROOMS: Record<Amphipod, number> = {'A': 0, 'B': 1, 'C': 2, 'D': 3};
const AMPHIPOD_COSTS: Record<Amphipod, number> = {'A': 1, 'B': 10, 'C': 100, 'D': 1000};

const WINNING_BOARD_P1 = '...........AABBCCDD';
const WINNING_BOARD_P2 = '...........AAAABBBBCCCCDDDD';

/**
 * Check if given room can be entered by an amphipod and return the room' index on the board if possible.
 * An amphipod can enter the room if
 * * there is at least 1 free space, and
 * * all other amphipods in this room are of the same kind
 *
 * Premiss: Given room is already the correct room
 */
const tryEnterRoom = (a: Amphipod, room: number[], board: string): number | undefined => {
  for (let i = room.length - 1; i >= 0; i--) {                            // Check bottom up
    const index = room[i];

    if (board[index] === '.') {                                           // Free space found, return board index
      return index;
    }

    if (board[index] !== a) {                                             // Existing amphipod is not of the same kind
      return undefined;
    }
  }

  return undefined;                                                       // Room is full
};

/**
 * Gets the target room for given amphipod
 */
const getRoom = (a: Amphipod, board: string, roomSize: number): number[] => {
  const roomIndex = AMPHIPOD_ROOMS[a];
  const start = 11 + roomIndex * roomSize;                                // Calculate the room's start index on the board

  return [...Array(roomSize)].map((_, index) => index + start);           // Get the room's indices on the board
};

/**
 * Check if the amphipod can move in the hallway from 'from' to 'to' inclusive 'to'
 */
const canMoveInHallway = (board: string, from: number, to: number): boolean => {
  const start = Math.min(from, to);                                       // Flip if start > end
  const end = Math.max(from, to);

  return board
    .slice(start, end + 1)                                                // Get 'start' to 'end' inclusive 'end'
    .split('')
    .every((b) => b === '.');                                             // Check if every place is empty
};

/**
 * Try to move an amphipod on the hallway to its destined room if possible.
 */
const moveToRoom = (board: string, index: number, roomSize: number): Move[] => {
  const a = board[index] as Amphipod;
  const door = AMPHIPOD_DOORS[a];

  const nextPosition = index + (index < door ? 1 : -1);                   // Do not include the current amphipod for the check
  if (!canMoveInHallway(board, door, nextPosition)) {                     // Other amphipods are in the way
    return [];
  }

  const room = getRoom(a, board, roomSize);
  const position = tryEnterRoom(a, room, board);                          // Check if its possible to enter the destined room

  if (position === undefined) {
    return [];
  }

  const distanceInHallway = Math.abs(index - door);
  const distanceInRoom = room.indexOf(position) + 1;                      // Distance within the room + 1 to enter the room
  const costFactor = AMPHIPOD_COSTS[a];
  const cost = costFactor * (distanceInHallway + distanceInRoom);

  const newBoard = board.split('');
  newBoard.splice(index, 1, '.');                                         // Remove amphipod from the hallway
  newBoard.splice(position, 1, a);                                        // Add amphipod to the room

  return [{board: newBoard.join(''), cost}];
};

/**
 * Check if amphipod at given index on the board is already in its destined room.
 */
const isAtDestination = (board: string, index: number, roomSize: number): boolean => {
  const a = board[index] as Amphipod;
  const room = getRoom(a, board, roomSize);                               // Destined room for amphipod

  if (room.includes(index)) {                                             // Check if amphipod is in its destined room
    return room.every((roomIndex) => {                            // Check if other amphipod below the current amphipod are in their correct room.
      if (roomIndex < index) {                                            // Other amphipods/empty spaces above the current amphipod
        return true;
      }

      return board[roomIndex] === a;                                      // Amphipods below the current amphipod must be of the same kind
    });
  }

  return false;                                                           // Amphipod is not in the correct room
};

/**
 * Try to move amphipod from a room to any possible position on the hallway.
 */
const moveToHallway = (board: string, index: number, roomSize: number): Move[] => {
  const roomIndex = Math.floor((index - 11) / roomSize);                  // Find room index of the current amphipod
  const door = 2 * (roomIndex + 1);                                       // +1: Doors start at 2; * 2 Doors have a distance of 2 among them
  const distanceToDoor = (index - 11) % roomSize;                         // Distance within a room to the door

  if (distanceToDoor > 0 && board[index - 1] !== '.') {                   // Amphipod is not on top of the room: Check if the amphipod can move out of the room
    return [];
  }

  const positions = HALLWAY
    .filter((position) => board[position] === '.')                        // Free hallway positions
    .filter((position) => canMoveInHallway(board, door, position));       // Hallway positions reachable from the currect room

  const a = board[index] as Amphipod;
  const costFactor = AMPHIPOD_COSTS[a];

  return positions
    .map((position): Move => {
      const distanceInHallway = Math.abs(door - position);                // Distance from the door to the target position
      const cost = costFactor * (distanceInHallway + distanceToDoor + 1); // +1 to move exit the room

      const newBoard = board.split('');
      newBoard.splice(index, 1, '.');                                     // Replace amphipod in the room
      newBoard.splice(position, 1, a);                                    // Add amphipod to the hallway

      return {board: newBoard.join(''), cost};
    });
};

const move = (board: string, index: number, roomSize: number): Move[] => {
  if (board[index] === '.') {                                             // Current index has no amphipod
    return [];
  }

  if (index < 11) {                                                       // Amphipods on the hallway (try to enter rooms)
    return moveToRoom(board, index, roomSize);
  } else {
    if (!isAtDestination(board, index, roomSize)) {                       // Amphipods not having reached their destined room
      return moveToHallway(board, index, roomSize);                       // Amphipods in rooms (try to enter hallway)
    }
  }


  return [];
};

const parse = (input: string[]): string[] => {
  const line1 = input[2].replace(INPUT_REGEX, '');
  const line2 = input[3].replace(INPUT_REGEX, '');

  return [line1, line2];
};

const initBoard = (lines: string[]): string => {
  let board = '...........';

  const rooms = transpose(lines.map((l) => l.split('')));
  for (const room of rooms) {
    board += room.join('');
  }

  return board;
};

/**
 * For each move determine the next possible moves.
 * Process moves with the lowest costs first.
 */
const findMinimumCost = (
  initialBoard: string,
  winningBoard: string,
  roomSize: number,
): number => {
  const queue = new MinPriorityQueue<Move>();                             // Min heap, total cost to reach a state = priority
  const seenBoards = new Set<string>();                                   // Seen configurations

  queue.enqueue({board: initialBoard, cost: 0}, 0);                       // Initial cost: 0

  while (queue.size() > 0) {
    const {element} = queue.dequeue() as PriorityQueueItem<Move>;
    const {board, cost} = element;                                        // Board: current configuration, cost: total cost so far to reach this configuration

    if (seenBoards.has(board)) {                                          // Skip seen board configurations
      continue;
    }

    if (board === winningBoard) {                                         // Reached the winning board with lowest costs possible
      return cost;
    }

    seenBoards.add(board);

    const nextMoves =                                                     // Calculate next moves for each position
      [
        ...Array(winningBoard.length)
          .keys(),                                                        // Indices of each position
      ]
        .map((index) => move(board, index, roomSize))                     // Calculate next possible moves
        .flat()
        .filter((move) => !seenBoards.has(move.board))                    // Filter board configurations already seen
        .map((move) => ({board: move.board, cost: cost + move.cost}));    // Update the current move's cost by the total cost so far to reach this state

    for (const move of nextMoves) {
      queue.enqueue(move, move.cost);                                     // Enqueue next valid moves
    }
  }

  return -1;
};

const part1 = (input: string[]): number => {
  const board = initBoard(parse(input));

  return findMinimumCost(board, WINNING_BOARD_P1, 2);
};

const part2 = (input: string[]): number => {
  const lines = parse(input);
  const board = initBoard([lines[0], 'DCBA', 'DBAC', lines[1]]);

  return findMinimumCost(board, WINNING_BOARD_P2, 4);
};

const input = readAllLinesFilterEmpty('./res/2021/input23.txt');
console.log('part1:', part1(input));
console.log('part2:', part2(input));

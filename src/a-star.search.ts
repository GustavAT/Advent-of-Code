import { fromKey, toKey } from './util';

/**
 * Slow A* implementation without using a priority queue and heuristic.
 * @param grid 2D grid
 * @param from Start position
 * @param to End position
 * @param costFn Cost function for moving from pos A to pos B in grid
 */
export const findPath = (
  grid: number[][],
  from: [number, number],
  to: [number, number],
  costFn: (a: [number, number], b: [number, number], grid: number[][]) => number,
): [number, number][] => {
  const paths: Record<string, string> = {};
  const costs: Record<string, number> = {};

  const fromAsString = toKey(...from);
  const toAsString = toKey(...to);
  paths[fromAsString] = fromAsString;             // Store successor node of current node
  costs[fromAsString] = 0;                        // Total costs to current node

  const openList: string[] = [fromAsString];      // Nodes to consider. (!! Not a priority queue - SLOW !!)

  while (openList.length > 0) {
    const current = openList.shift()!;

    if (current === toAsString) {                 // Goal found, terminate and reconstruct path
      return backtrace(paths, to);
    }

    const [cX, cY] = fromKey(current);
    for (const adjacent of getAdjacent([cX, cY], grid)) {                       // Get valid neighbours of current node
      const newCost = costs[current] + costFn([cX, cY], adjacent, grid);        // Calculate new cost
      const adjacentAsString = toKey(...adjacent);

      if (newCost < (costs[adjacentAsString] ?? Number.POSITIVE_INFINITY)) {    // New cost is smaller than previous cost
        paths[adjacentAsString] = current;                                      // Update/insert new successor node of neighbour
        costs[adjacentAsString] = newCost;                                      // Update/insert new cost to neighbour
        openList.push(adjacentAsString);                                        // Consider neighbour as new current (!! no priority !!)
      }
    }
  }

  return [];
};

const getAdjacent = ([x, y]: [number, number], grid: number[][]): [number, number][] => {
  return [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ]
    .filter(([gX, gY]) => grid[gY]?.[gX] !== undefined) as [number, number][];  // Undefined values correspond to outside the grid
};

const backtrace = (paths: Record<string, string>, to: [number, number]): [number, number][] => {
  let current = toKey(...to);
  const path: [number, number][] = [to];

  for (; ;) {
    const prev = paths[current];
    if (prev !== undefined && current !== prev) {
      path.push(fromKey(prev) as [number, number]);
      current = prev;
    } else {
      break;
    }
  }

  return path;
};

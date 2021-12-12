import { readLinesWithRegExp } from '../io.util';
import { distinct } from '../sets.util';

const PATH_REGEX = /(\w+)-(\w+)/;

const isSmall = (cave: string) => cave === cave.toLowerCase();

const initialize = (paths: [string, string][]): Record<string, string[]> => {
  const segments: Record<string, string[]> = {};                  // Map cave to all its connected caves

  for (const [from, to] of paths) {
    if (segments[from]) {
      segments[from].push(to);
    } else {
      segments[from] = [to];
    }

    if (segments[to]) {
      segments[to].push(from);
    } else {
      segments[to] = [from];
    }
  }

  return segments;
};

const getNextP1 = (cave: string, segments: Record<string, string[]>, visited: string[]): string[] => {
  return segments[cave].filter((c) => !visited.includes(c));      // Connected caves not visited yet
};

const getNextP2 = (cave: string, segments: Record<string, string[]>, visited: string[]): string[] => {
  const nextCaves = segments[cave].filter((c) => c !== 'start');  // Connected caves except 'start' cave
  const next = nextCaves.filter((n) => !visited.includes(n));     // Connected caves not visited yet

  if (visited.length === distinct(visited).length) {              // No cave has been visited twice
    next.push(...nextCaves.filter((n) => visited.includes(n)));   // Connected caves visited once
  }

  return next;
};

const traverse = (
  cave: string,
  pathToCave: string[],
  segments: Record<string, string[]>,
  visited: string[],
  getNextFn: (cave: string, segments: Record<string, string[]>, visited: string[]) => string[],
): string[][] => {
  if (isSmall(cave)) {                                            // Mark small cave as visited
    visited.push(cave);                                           // Big caves are not marked -> can be visited any number times
  }

  pathToCave.push(cave);                                          // Path that leads to the current cave (including current)

  const next = getNextFn(cave, segments, visited);                // Get next connected caves to visit
  if (next.length === 0) {                                        // Dead end -> invalid path
    return [];
  }

  const paths: string[][] = [];
  for (const c of next) {
    if (c === 'end') {                                            // Reached 'end'. Do not continue
      paths.push([...pathToCave, 'end']);
    } else {
      const newPaths = traverse(c, [...pathToCave], segments, [...visited], getNextFn);
      paths.push(...newPaths);
    }
  }

  return paths;
};

const part1 = (input: [string, string][]): number => {
  const segments = initialize(input);
  const allPaths = traverse('start', [], segments, [], getNextP1);

  return allPaths.length;
};

const part2 = (input: [string, string][]): number => {
  const segments = initialize(input);
  const allPaths = traverse('start', [], segments, [], getNextP2);

  return allPaths.length;
};

const input = readLinesWithRegExp('./res/2021/input12.txt', PATH_REGEX)
  .map(([, from, to]) => [from, to] as [string, string]);
console.log('part1:', part1(input));
console.log('part2:', part2(input));

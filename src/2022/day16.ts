import { readLinesWithRegExp } from '../io.util';

const LINE_REGEXP = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;
type Valve = {
  name: string;
  flowRate: number;
  connects: string[];
};

type State = {
  valveName: string;
  timeLeft: number;
  valvesBitmask: number;
  totalPressure: number;
};

const shortestPaths = (valves: Valve[]): Record<string, number> => {
  const paths: Record<string, number> = {};
  for (const {name, connects} of valves) {
    paths[`${name}#${name}`] = 0;                   // Cost from current to current is 0
    for (const to of connects) {
      paths[`${name}#${to}`] = 1;                   // Cost for one edge is 1
    }
  }

  floydWarshall(valves.map((v) => v.name), paths);  // Calculate remaining costs

  return paths;
};

const floydWarshall = (nodes: string[], paths: Record<string, number>): void => {
  for (const hop of nodes) {
    for (const from of nodes) {
      for (const to of nodes) {
        const distance = paths[`${from}#${to}`] ?? Number.POSITIVE_INFINITY;
        const hop1 = paths[`${from}#${hop}`] ?? Number.POSITIVE_INFINITY;
        const hop2 = paths[`${hop}#${to}`] ?? Number.POSITIVE_INFINITY;
        if (distance > hop1 + hop2) {               // Check if i --> j is shorter over k
          paths[`${from}#${to}`] = hop1 + hop2;     // Update new shortest distance
        }
      }
    }
  }
};

const isOpenValve = (bitshiftMap: Record<string, number>, valvesBitmask: number, valve: string): boolean => {
  const openValve = 1 << bitshiftMap[valve];        // Shift 1 to match open-valve position in bitmask
                                                    // Valve bitmask: 10011; Current valve: 00010; -> open
  return (valvesBitmask & openValve) > 0;           // Bitmask of open valves contain current valve
};

const openValve = (bitshiftMap: Record<string, number>, valvesBitmask: number, valve: string): number => {
  const openValve = 1 << bitshiftMap[valve];        // Shift 1 to match open-valve position in bitmask
                                                    // Valve bitmask: 10001; Current valve: 00010; -> open: 10011
  return valvesBitmask | openValve;                 // Set bit for current valve in open-valve bitmask
};

const search = (valves: Valve[], totalTime: number, onStateVisited: (state: State) => void): void => {
  const paths = shortestPaths(valves);
  const valvesWithFlow = valves.filter((v) => v.flowRate > 0);            // Valves with flow-rate > 0
  const bitshiftMap = valvesWithFlow.reduce((map, v, index) => {
    map[v.name] = index;                            // Create an array where each index determines the valve position in the bitmask
    return map;                                     // Index 0 -> shift 1 << 0: 0001; index 3 -> shift 1 << 3: 1000
  }, {} as Record<string, number>);                 // Bitmask determines which valves are open (1 .. open, 0 .. closed)

  const visitedStates = new Set<string>();
  const openStates: State[] = [
    {valveName: 'AA', timeLeft: totalTime, valvesBitmask: 0, totalPressure: 0},     // Start at 'AA' with 'time' remaining, 0 pressure and 0 valves opened
  ];
  while (openStates.length > 0) {                                                   // States not visited yet
    const state = openStates.pop()!;
    const {valveName, timeLeft, valvesBitmask, totalPressure} = state;

    const stateKey = `${valveName}#${timeLeft}#${valvesBitmask}#${totalPressure}`;  // Store the current valve, time remaining, the opened valves and total pressure
    if (visitedStates.has(stateKey)) {                                              // State already visited -> continue
      continue;
    }

    visitedStates.add(stateKey);                                                    // Mark current state as visited and call the handler
    onStateVisited(state);

    if (timeLeft === 0) {                                                           // Time is up --> continue
      continue;
    }

    for (const next of valvesWithFlow) {                                            // For each valve with flow-rate
      if (isOpenValve(bitshiftMap, valvesBitmask, next.name)) {                     // Try to reach the next valve
        continue;
      }

      const newTimeLeft = timeLeft - paths[`${valveName}#${next.name}`] - 1;        // New valve can be reached within time remaining
      if (newTimeLeft <= 0) {
        continue;
      }

      openStates.push({                                                             // Put next valve in the list of open states
        valveName: next.name,
        timeLeft: newTimeLeft,
        valvesBitmask: openValve(bitshiftMap, valvesBitmask, next.name),            // Mark valve as opened in bitmask
        totalPressure: totalPressure + newTimeLeft * next.flowRate,                 // Update the total pressure
      });
    }
  }
};

const part1 = (valves: Valve[]): number => {
  let maxPressure = -1;                             // Update maxPressure each time a new state is visited
  search(valves, 30, ({totalPressure}) => maxPressure = Math.max(maxPressure, totalPressure));

  return maxPressure;
};

const part2 = (valves: Valve[]): number => {
  const states = new Map<number, number>();         // Put each new state (opened valves) in the map with the maximum pressure reached in that state
  search(valves, 26, ({valvesBitmask, totalPressure}) => {
    const current = states.get(valvesBitmask) ?? 0;
    states.set(
      valvesBitmask,
      Math.max(current, totalPressure),
    );
  });

  let maxPressure = -1;                             // Idea: Two actors opened a different set of valves for maximum pressure
  for (const [bitmask1, total1] of states) {
    for (const [bitmask2, total2] of states) {
      if ((bitmask1 & bitmask2) === 0) {
        maxPressure = Math.max(maxPressure, total1 + total2);
      }
    }
  }

  return maxPressure;
};

const input = readLinesWithRegExp('./res/test_input.txt', LINE_REGEXP)
  .map((match): Valve => {
    return {
      name: match[1],
      flowRate: +match[2],
      connects: match[3].split(', '),
    };
  });
console.log('part1:', part1(input));
console.log('part2:', part2(input));

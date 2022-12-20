import { readLinesWithRegExp } from '../io.util';

const NUMBERS_REGEX = /(\d+)/g;

type Robots = [number, number, number, number];
type Resources = [number, number, number, number];
type Cost = [number, number, number];
type Blueprint = {
  id: number,
  costs: [Cost, Cost, Cost, Cost],
  robotCap: Robots,
}
type State = {
  robots: Robots,
  resources: Resources,
  minute: number,
};

const ROBOT_COUNT = 4;
const MATERIAL_COUNT = 3; // ore, clay, obsidian

const parseBlueprint = (match: RegExpMatchArray): Blueprint => {
  const costs: [Cost, Cost, Cost, Cost] = [
    [+match[1], 0, 0],
    [+match[2], 0, 0],
    [+match[3], +match[4], 0],
    [+match[5], 0, +match[6]],
  ];
  const robotCap: Robots = [              // Cost cap of for each material.
    Math.max(...costs.map((c) => c[0])),  // We do not need more ore robots than the most expensive ore cost
    Math.max(...costs.map((c) => c[1])),  // Same for others
    Math.max(...costs.map((c) => c[2])),
    Number.POSITIVE_INFINITY,
  ];
  return {
    id: +match[0],
    costs,
    robotCap,
  };
};

/**
 * Estimate the build-time for a given robot cost based on existing resources and robots.
 */
const estimateBuildTime = (robots: Robots, resources: Resources, cost: Cost): number => {
  let buildTime = 0;

  for (let material = 0; material < MATERIAL_COUNT; material++) {           // Robots are build from 3 materials: ore, clay and obsidian
    if (cost[material] === 0) {                                             // Material is not required: 0 cost
      continue;
    }

    if (resources[material] >= cost[material]) {                            // Resources already available
      continue;
    }

    if (robots[material] === 0) {                                           // No robot available to harvest the required material
      buildTime = Number.POSITIVE_INFINITY;
      break;
    }

    const requiredMaterial = cost[material] - resources[material];          // Get remaining required material
    const requiredRobots = Math.ceil(requiredMaterial / robots[material]);  // How many robots are needed to harvest remaining material
    buildTime = Math.max(buildTime, requiredRobots);                        // Build time = max(harvest-times for a materials)
  }

  return buildTime;
};

/**
 * Let given robots harvest materials for a given amount of time to build a robot.
 * The cost is subtracted from the harvested resources.
 */
const harvestMaterials = (robots: Robots, resources: Resources, cost: Cost, time: number): Resources => {
  const harvested: Resources = [0, 0, 0, 0];

  for (let material = 0; material < ROBOT_COUNT; material++) {              // Each material is harvested
    const materials = resources[material] + time * robots[material];        // A robot harvests 1 material at a time
    harvested[material] = materials - (cost[material] ?? 0);                // Subtract cost to build the robot (no robot costs geodes)
  }

  return harvested;
};

const simulate = ({costs, robotCap}: Blueprint, totalTime: number): number => {
  const openStates: State[] = [{robots: [1, 0, 0, 0], resources: [0, 0, 0, 0], minute: 0}]; // Initial step: 1 ore robot
  let maxGeodes = 0;
  while (openStates.length > 0) {
    const state = openStates.pop()!;
    const {robots, resources, minute} = state;

    const minuteAfterStep = minute + 1;                                                     // Time after 1 step has passed
    if (minuteAfterStep > totalTime) {                                                      // Time has exceeded the total time available
      continue;
    }

    for (let robotIndex = 0; robotIndex < ROBOT_COUNT; robotIndex++) {                      // Try to build a new robot of each kind
      const robotCount = robots[robotIndex];                                                // Idea: During each step only one robot can be build
      if (robotCount >= robotCap[robotIndex]) {                                             // We do not need more robots harvesting materials than the most expensive robot
        continue;
      }

      const robotCost = costs[robotIndex];                                                  // Cost to build the current robot
      const buildTime = estimateBuildTime(robots, resources, robotCost);                    // Estimate how many minutes must pass before the robot can be build

      const timeAfterBuild = minuteAfterStep + buildTime;                                   // Check if the robot can be build within the time remaining
      if (timeAfterBuild > totalTime) {
        continue;
      }

      const newResources = harvestMaterials(robots, resources, robotCost, 1 + buildTime);   // Let robots harvest materials for the duration of the build-time.
      const newRobots: Robots = [...robots];
      newRobots[robotIndex] += 1;                                                           // New robot has been build

      const newGeodes = newResources[3] + robots[3] * (totalTime - timeAfterBuild);         // Calculate the maximum number of geodes farmed within the build-time
      maxGeodes = Math.max(newGeodes, maxGeodes);                                           // Update the maximum number of geodes

      openStates.push({                                                                     // Expand search by new state
        robots: newRobots,
        resources: newResources,
        minute: timeAfterBuild,
      });
    }
  }

  return maxGeodes;
};

const part1 = (blueprints: Blueprint[]): number => {
  let result = 0;
  for (const blueprint of blueprints) {
    const maxGeodes = simulate(blueprint, 24);
    result += blueprint.id * maxGeodes;
  }

  return result;
};

const part2 = (blueprints: Blueprint[]): number => {
  const bps = [blueprints[0], blueprints[1], blueprints[2]];
  let result = 1;
  for (const blueprint of bps) {
    const maxGeodes = simulate(blueprint, 32);
    result *= maxGeodes;
  }

  return result;
};

const input = readLinesWithRegExp('./res/2022/day19.txt', NUMBERS_REGEX)
  .map((match) => parseBlueprint(match));
console.log('part1:', part1(input));
console.log('part2:', part2(input));

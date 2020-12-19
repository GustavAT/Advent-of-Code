import { readAllLines } from "../io.util";

type Rule = number[][] | string;                // Rule could either terminate: string or expand: number[][]
const TERMINATING_RULE_REGEXP = /"([ab])"/;     // Matching either "a" or "b" (with quotes)

const parseInput = (input: string[]): { rules: Map<number, Rule>, messages: string[] } => {
    const split = input.indexOf('');

    const rules = new Map();
    input.slice(0, split).forEach((r) => {
        const [nr, rule] = r.split(': ');

        const terminatingRule = rule.match(TERMINATING_RULE_REGEXP);    // Check if the current rule terminates
        if (terminatingRule) {
            rules.set(parseInt(nr), terminatingRule[1]);                // Add symbol for rule
        } else {
            const nested = rule                                         // Find out next possible rules
                .split(' | ')                                           // Different choice are separated by ' | '
                .map((part) => part.split(' ').map(Number));            // Get next rules for an option
            rules.set(parseInt(nr), nested);
        }
    });

    const messages = input
        .slice(split + 1)
        .filter((message) => message);

    return { rules, messages };
}

/**
 * Naiive approach using brute-force:
 * 
 * Build a search tree iterating all possible rules for the (current) message.
 * 
 * 1. If the queue is empty: (no more rules to look at)
 *      1.1 If the message is empty, all symbols have been processed: match (EXIT)
 *      1.2 Characters still left in the message: Mismatch (EXIT)
 * 
 * 2. Get the next rule to look at from the queue
 *      2.1 Rule is a terminating rule:
 *              2.1.1 First character matches the rules. Continue at 1 with sub-message and queue
 *              2.1.2 First character mismatch: mismatch (EXIT)
 *      2.2 Rule is a nested rule:
 *              2.2.1 For each option in this rule:
 *                      Continue at 1 with message and new rules unshifted into the queue.
 *
 * @param message The current message
 * @param queue A queue holding all rules that are validated against the current message (in order);
 * @param rules All rules
 */
const validateMessage = (message: string, queue: number[], rules: Map<number, Rule>): boolean => {
    const [nextRuleIndex, ...remaining] = queue;    // [index of the next rule, remaining rules to check]

    if (nextRuleIndex === undefined) {              // Queue was empty
        return message.length === 0;                // All characters in messgage processed? Yes: match; mismatch otherwise
    }

    const next = rules.get(nextRuleIndex)!;         // Get the next rule

    if (typeof next === 'string') {                                                                 // Terminating rule
        return message[0] === next && validateMessage(message.substr(1), remaining, rules);         // Compare first character of message with rule. If match: continue with rest of message and queue
    }

    return next.some((nextRule) => validateMessage(message, [...nextRule, ...remaining], rules));   // For each option in the rule: Unshift rules into the queue and validate recursively
}

const part1 = (input: string[]): number => {
    const { rules, messages } = parseInput(input);
    const valid = messages.filter((message) => validateMessage(message, [0], rules))

    return valid.length;
}

const part2 = (input: string[]): number => {
    const { rules, messages } = parseInput(input);

    rules.set(8, [[42], [42, 8]]);              // Insert new rules. Loops are not an issue because all combinations are brute-forced.
    rules.set(11, [[42, 31], [42, 11, 31]]);    // Eventually, a match or mismatch will be found.

    const valid = messages.filter((message) => validateMessage(message, [0], rules));

    return valid.length;
}

const input = readAllLines('./res/2020/input19.txt');
console.log('Valid rules (part 1):', part1(input));
console.log('Valid rules (part 2):', part2(input));

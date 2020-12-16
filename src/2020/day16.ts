import { readAllLines } from '../io.util';

const RULE_REGEXP = /(.*)\: (\d+)\-(\d+)\sor\s(\d+)\-(\d+)/;      // [any character]: (number-number) or (number-number)

type IndexedRules = { index: number; rules: string[] };
type Rule = { name: string, rule1: [number, number], rule2: [number, number] };
type PuzzleInput = { rules: Rule[]; mine: number[]; other: number[][] };

const parseInput = (input: string[]): PuzzleInput => {
    const ruleCount = input.indexOf('');
    const rules = input.slice(0, ruleCount)
        .map((line): Rule => {
            const matches = line.match(RULE_REGEXP)!;

            return {
                name: matches[1],                                           // Rule name
                rule1: [parseInt(matches[2]), parseInt(matches[3])],        // 1st condition (min-max)
                rule2: [parseInt(matches[4]), parseInt(matches[5])],        // 2nd condition (min-max)
            }
        });

    const mine = input[ruleCount + 2].split(',').map((n) => parseInt(n));   // My ticket

    const other = input.slice(ruleCount + 5)                                // Remaining tickets
        .filter((line) => line !== '')
        .map((line) => line.split(',').map((n) => parseInt(n)));

    return { rules, mine, other };
}

const validateRule = (value: number, rule: Rule): boolean =>                // Check if value is between 1st or 2nd boundary
    rule.rule1[0] <= value && value <= rule.rule1[1] ||
    rule.rule2[0] <= value && value <= rule.rule2[1];

const validateRules = (value: number, rules: Rule[]): boolean =>            // Check if value is between boundaries of all rules
    rules.some((rule) => validateRule(value, rule));

const part1 = (input: string[]): number => {
    const { rules, other } = parseInput(input);

    return other
        .reduce((sum, ticket) => sum + ticket                                                   // Sum invalid values from all tickets
            .reduce((ticketSum, n) => ticketSum + (validateRules(n, rules) ? 0 : n), 0), 0);    // Sum invalid values for a ticket
}

const mapRulesToIndex = (rules: Rule[], tickets: number[][]): IndexedRules[] =>
    tickets[0]                                                                  // For all ticket value at an index: check which rules can be applied
        .map((_, index) => ({
            index,                                                              // Index in the ticket
            rules: rules
                .filter((rule) => tickets                                       // Filter rules that apply to all ticket values for this index
                    .every((ticket) => validateRule(ticket[index], rule)))
                .map((rule) => rule.name),                                      // Get rule-names
        }));

const mapToRuleNames = (rules: IndexedRules[]): string[] =>         // Map each rule to the field index it belongs
    rules
        .sort((a, b) => a.rules.length - b.rules.length)            // Sort ascending: 1st entry will have 1 rule, 2nd entry with 2 rules (1 additional rule), 3rd entry with 3 rules (1 additional rule), etc.
        .reduce((ruleMappings, current) =>                          // Map each index to the rule that was added
            [
                ...ruleMappings,                                    // Mapping from ticket field-index to rule that applies
                {
                    index: current.index,
                    rule: current.rules
                        .filter((rule) => ruleMappings              // Filter rule names that were not seen before
                            .every((x) => x.rule != rule))[0],      // There is exacltly 1 new valid rule added for each index
                },
            ], [] as { index: number, rule: string }[])
        .sort((a, b) => a.index - b.index)                          // Sort ascending by index; Used to identify the rule for a ticket value's index.
        .map((rule) => rule.rule);                                  // Get rule name


const part2 = (input: string[]): number => {
    const { rules, mine, other } = parseInput(input);
    const validOther = other.filter(
        (other) => other.every((n) => validateRules(n, rules))
    );

    const indexedRules = mapRulesToIndex(rules, validOther);
    const ruleNames = mapToRuleNames(indexedRules);

    return mine
        .map((n, index) => ruleNames[index].match('departure') ? n : 1)     // Map values that belong to 'departure' rules to their value; 1 otherwise
        .reduce((product, n) => product * n, 1);                            // Product of these values
}

const input = readAllLines('./res/2020/input16.txt');
console.log('Invalid tickets (part 1):', part1(input));
console.log('Invalid tickets (part 2):', part2(input));

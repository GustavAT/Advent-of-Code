import { readAllLinesFilterEmpty } from '../io.util';

// '(' ((number) (op1|op2|op3...))... (number) ')'
const PARENTHESIS_REGEXP = /\(((\d+\s[*+]\s)+\d+)\)/;   // Detect innermost expression surrounded by parenthesis. The expression itself does not include any parenthesis.

const calculate = (op1: string, symbol: string, op2: string): number => {
    const left = parseInt(op1);
    const right = parseInt(op2);

    return symbol === '+' ? left + right : left * right;
}

const calculateExpression = (expression: string, operators: string[]): string => {
    const expRegExp = new RegExp(`(\\d+)\\s([${operators.join('')}])\\s(\\d+)`);    // Detect expressions with given operators in between (number) (op1|op2|op3...) (number)

    while (operators.some((op) => expression.includes(op))) {                       // Calculate all simple expressions for given operator(s)
        expression = expression.replace(                                            // Replace all matches with their result
            expRegExp,                                                              // Expression with operator found (op1) (operand) (op2)
            (_, op1, symbol, op2) => calculate(op1, symbol, op2).toString()         // Calculate result
        );
    }

    return expression;
}

const calculateComplexExpression = (expression: string, precedence: boolean): number => {
    while (expression.includes('(')) {                                              // Compound expression found
        expression = expression.replace(                                            // Replace matches with their result
            PARENTHESIS_REGEXP,
            (_, exp) => calculateComplexExpression(exp, precedence).toString()
        );
    }

    if (precedence) {
        expression = calculateExpression(expression, ['+']);                        // Solve all sum-expressions first
        expression = calculateExpression(expression, ['*']);                        // Solve all product-expression then
    } else {
        expression = calculateExpression(expression, ['*', '+']);                   // Solve all expression starting from the beginning
    }

    return parseInt(expression);
}

const part1 = (expressions: string[]): number =>
    expressions.reduce((sum, eq) => sum + calculateComplexExpression(eq, false), 0);

const part2 = (expressions: string[]): number =>
    expressions.reduce((sum, eq) => sum + calculateComplexExpression(eq, true), 0);

const input = readAllLinesFilterEmpty('./res/2020/input18.txt');
console.log('Sum (part 1):', part1(input));
console.log('Sum (part 2):', part2(input));

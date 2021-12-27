## Code Analysis

The input consists of 14 parameterized (A and B) modules.
There are two different types of modules:
* Type 1: Pushing values on a stack
* Type 2: Popping values on a stack

There are 7 *PUSH* and 7 *POP* modules.

### PUSH Module
```typescript
w = INPUT();
if ((z % 26 + A) !== w) {
  z *= 26;
  z += w + B;
}
```

For *PUSH modules*, A is always > 9 in the input.
Since w must be within [1,9] the condition is always true.
The code for module 1 can be reduced to:

```typescript
w = INPUT();
z *= 26;
z += w + B;
```

In pseudocode:

```typescript
w = INPUT();
z.PUSH(w + B);
```

### POP Module
```typescript
w = INPUT();
x = z % 26;
z /= 26;
if ((x + A) !== w) {
  z *= 26;
  z += w + B;
}
```

For *POP modules*, the condition can be `true`. 

In pseudocode

```typescript
w = INPUT();
if ((z.POP() + A) !== w) {
  z.PUSH(w + B)
}
```

## Solution

The modules essentially push and pop values onto the `z` stack.
For *POP* modules, they can unintentionally also push values onto the stack.
However, after executing all 14 modules, the stack has to be empty: `z === 0`.

**Observation 1**:
We have to find values for `w` that negate the `(z.POP() + A) !== w` condition.

**Observation 2**:
The value `z.POP()` depends on the last value pushed onto the stack.

### Modules decoded

`wX` = Input `w` from module `X`.
`AX`, `BX` = Parameters `A` and `B` from module `X`.

```typescript
z.PUSH(w1 + B1);            // Module 1

z.PUSH(w2 + B2);            // Module 2

z.PUSH(w3 + B3);            // Module 3

z.PUSH(w4 + B4);            // Module 4

if (z.POP() +  A5 !== w5)   // Module 5
  z.PUSH(w5 + B5);

z.PUSH(w6 + B6);            // Module 6

if (z.POP() +  A7 !== w7)   // Module 7
  z.PUSH(w7 + B7);

if (z.POP() +  A8 !== w8)   // Module 8
  z.PUSH(w8 + B8);

z.PUSH(w9 + B9);            // Module 9

z.PUSH(w10 + B10);          // Module 10

if (z.POP() +  A11 !== w11) // Module 11
  z.PUSH(w11 + B11);

if (z.POP() +  A12 !== w12) // Module 12
  z.PUSH(w12 + B12);

if (z.POP() +  A13 !== w13) // Module 13
  z.PUSH(w13 + B13);

if (z.POP() +  A14 !== w14) // Module 14
  z.PUSH(w14 + B14);
```

Replace `z.POP()` by the respective push operation.
For example `z.POP() + A14 !== w14` becomes `w1 + B1 + A14 !== w14`.
To prevent a push operation in the *POP* modules, the condition must be `true`.
It follows `w1 + B1 + A14 = w14`.

Do this for every *PUSH* and related *POP* operation:

|Modules|Condition|Relation|
|---|---|---|
|1 + 14|`w1 + B1 + A14 = w14`|`w1 + 8 - 6 = w14` = `w1 + 2 = w14`|
|2 + 13|`w1 + B2 + A13 = w13`|`w2 + 8 - 13 = w13` = `w2 - 5 = w13`|
|3 + 8|`w3 + B3 + A8 = w8`|`w3 + 3 - 11 = w8` = `w3 - 8 = w8`|
|4 + 5|`w4 + B4 + A5 = w4`|`w4 + 10 - 12 = w5` = `w4 - 2 = w5`|
|6 + 7|`w6 + B6 + A7 = w7`|`w6 + 8 - 2 = w7` = `w6 + 6 = w7`|
|9 + 12|`w9 + B9 + A12 = w12`|`w9 + 9 - 12 = w12` = `w9 - 3 = w12`|
|10 + 11|`w10 + B10 + A11 = w11`|`w10 + 3 - 0 = w11` = `w10 + 3 = w11`|

Given `wX` is in `[1,9]`, find values for `wX` to maximize (part 1) and minimize (part 2) the number `w`.

**Example 1**:
Maximize: `w1 = 7` and `w14 = 9`
Minimize: `w1 = 1` and `w14 = 3`

**Example 2**
Maximize: `w9 = 9` and `w12 = 6`
Minimize: `w9 = 4` and `w12 = 1`

### Results

Part 1 - Maximum: `79997391969649`

Part 2 - Minimum: `16931171414113`

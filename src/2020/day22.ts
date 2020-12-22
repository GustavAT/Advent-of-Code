import { readAllLines } from '../io.util';
import { groupInput } from '../util';

type Deck = number[];

const parseInput = (input: string[]): [Deck, Deck] => {
    const [player1, player2] = groupInput(input);

    return [
        player1.slice(1).map(Number),
        player2.slice(1).map(Number),
    ];
};

const playCombat = (deckP1: Deck, deckP2: Deck): void => {
    while (deckP1.length > 0 && deckP2.length > 0) {            // Repeat until one of the player's decks is empty
        const cardP1 = deckP1.shift()!;                         // Draw first card of each deck
        const cardP2 = deckP2.shift()!;

        if (cardP1 > cardP2) {
            deckP1.push(cardP1, cardP2);                        // P1 winner; push cards to P1's deck
        } else {
            deckP2.push(cardP2, cardP1);                        // P2 winner; push cards to P2's deck
        }
    }
}

const part1 = (input: string[]): number => {
    const [deckMe, deckCrab] = parseInput(input);
    playCombat(deckMe, deckCrab);

    return [...deckMe, ...deckCrab]                                         // Concat; one of the two decks is empty
        .reverse()
        .reduce((score, card, index) => score + card * (index + 1), 0);     // Multiply each card by its index + 1 in the reversed array
}

const playRecursiveCombat = (deckP1: Deck, deckP2: Deck): 'P1' | 'P2' => {
    const seen = new Set();                                                 // Cache holding seen decks in this round (excluding sub-rounds)

    while (deckP1.length > 0 && deckP2.length > 0) {
        const decks = `${deckP1.join()}#${deckP2.join()}`;                  // deck1#deck2 string representation
        if (seen.has(decks)) {
            return 'P1';                                                    // Already seen this deck constelations; P1 wins
        }

        seen.add(decks);

        const cardP1 = deckP1.shift()!;                                     // Draw top card from each deck
        const cardP2 = deckP2.shift()!;

        let p1Winning = cardP1 > cardP2;                                    // Default: higher card is the winner
        if (cardP1 <= deckP1.length && cardP2 <= deckP2.length) {           // Top cards are smaller than both players cards left in the deck
            const winner = playRecursiveCombat(
                deckP1.slice(0, cardP1),                                    // Continue sub-game with n cards for each player where n is the drawn card of that player
                deckP2.slice(0, cardP2)
            );
            p1Winning = winner === 'P1';                                    // Overwrite default by sub-game result
        }

        if (p1Winning) {
            deckP1.push(cardP1, cardP2);                                    // P1 wins; push cards to P1's deck
        } else {
            deckP2.push(cardP2, cardP1);                                    // P2 wins; push cards to P2's deck
        }
    }

    return deckP1.length > 0 ? 'P1' : 'P2';                                 // Winner is the player who has cards left in his deck
}

const part2 = (input: string[]): number => {
    const [deckMe, deckCrab] = parseInput(input);
    playRecursiveCombat(deckMe, deckCrab);

    return [...deckMe, ...deckCrab]                                         // Concat; one of the two decks is empty
        .reverse()
        .reduce((score, card, index) => score + card * (index + 1), 0);     // Multiply each card by its index + 1 in the reversed array
}

const input = readAllLines('./res/2020/input22.txt');
console.log('Score Combat (part 1):', part1(input));
console.log('Score Recursive Combat (part 2):', part2(input));

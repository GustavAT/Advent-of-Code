import { readAllLinesFilterEmpty } from '../io.util';
import { intersect } from '../sets.util';
import { flatMapToArray } from '../util';

type Food = { ingredients: string[], allergens: string[] };

const FOOD_REGEXP = /^((?:\w+\s)*\w+)\s\(contains\s((?:\w+\,\s)*\w+)\)$/;           // [food ]* food (contains [allergen, ]* allergen)

const parseInput = (input: string[]): Food[] => {
    return input.map((line) => {
        const match = line.match(FOOD_REGEXP)!;

        return {
            ingredients: match[1].split(' '),
            allergens: match[2].split(', '),
        };
    });
};

const createAllergenMap = (foodList: Food[]): Map<string, string[]> => {
    const allergenMap = new Map<string, string[]>();                            // Map an allergen to food possibly containing that allergen

    for (const food of foodList) {
        for (const allergen of food.allergens) {
            if (allergenMap.has(allergen)) {                                    // Known allergen, set ingredients that share the same allergen
                allergenMap.set(allergen, intersect(allergenMap.get(allergen)!, food.ingredients));
            } else {                                                            // New allergen: add to map
                allergenMap.set(allergen, food.ingredients);
            }
        }
    }

    return allergenMap;
}

const part1 = (input: string[]): number => {
    const foodList = parseInput(input);
    const allergenMap = createAllergenMap(foodList);
    const unsafeFood = flatMapToArray(allergenMap);

    let safe = 0;
    for (const ingredient of foodList.flatMap((food) => food.ingredients)) {    // Iterate over all ingredients
        if (!unsafeFood.includes(ingredient)) {                                 // Check if current ingredient is assigned to an allergen
            safe++;                                                             // Food has no known allergens: safe
        }
    }

    return safe;
}

const part2 = (input: string[]): string => {
    const foodList = parseInput(input);
    let allergens = [...createAllergenMap(foodList).entries()];
    const pairs: [string, string][] = [];                               // List of pairs which ingredient has which allergen [allergen, ingredient]

    while (allergens.length > 0) {                                      // Check all rules
        allergens.sort(([, a], [, b]) => a.length - b.length);          // Sort ascending by the number of ingredients per allergen

        const [allergen, ingredients] = allergens.shift()!;             // First entry is guaranteed to have only 1 ingredient. Get and remove from list
        const ingredient = ingredients[0];
        pairs.push([allergen, ingredient]);

        allergens = allergens.map(([allergen, ingredients]) =>          // Iterate over remaining allergen -> intregients entries and remove the processed ingredients
            [allergen, ingredients.filter((otherIngredient) =>          // This step will leave at least 1 new rule with only one ingredient per allergen
                otherIngredient !== ingredient)]);
    }

    return pairs.sort(([a], [b]) => a.localeCompare(b))                 // Sort by allergen
        .map(([, ingredient]) => ingredient)                            // Pick ingredient
        .join();
}

const input = readAllLinesFilterEmpty('./res/2020/input21.txt');
console.log('Safe ingredient count (part 1):', part1(input));
console.log('Canonical dangerous ingredients (part 2):', part2(input));

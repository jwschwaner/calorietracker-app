import data from '../../../assets/ingredients.json'; // your JSON with the 'ingredients' array
import { Ingredient } from '../interfaces/Ingredient';
import { DailyCalorieDetailsService } from './DailyCalorieDetailsService';
import { DailyCalorieDetailsModel } from '../models/DailyCalorieDetails';
import { MealType, TrackedItem } from '../models/DailyCalorieDetails'; // or wherever your TrackedItem is defined

export class IngredientsService {
    private static ingredients: Ingredient[] = data.ingredients;

    /**
     * Get the full list of all known ingredients.
     */
    static getAllIngredients(): Ingredient[] {
        return IngredientsService.ingredients;
    }

    /**
     * Find an ingredient by name (case-insensitive).
     */
    static findIngredientByName(name: string): Ingredient | undefined {
        return IngredientsService.ingredients.find(
            item => item.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Calculate macros for a given weight in grams.
     * The ingredient data is per 100g, so we multiply by (grams / 100).
     */
    static calculateMacrosForWeight(
        ingredient: Ingredient,
        grams: number
    ): {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    } {
        const factor = grams / 100;
        return {
            calories: ingredient.calories * factor,
            protein: ingredient.protein * factor,
            carbs: ingredient.carbs * factor,
            fat: ingredient.fat * factor,
        };
    }

    /**
     * Track an ingredient (by name) as a new TrackedItem for a given day.
     * 1) Finds the ingredient.
     * 2) Calculates macros for the specified grams.
     * 3) Creates a TrackedItem with the macros & meal type.
     * 4) Inserts into today's DailyCalorieDetails (or specified date).
     * 5) Updates dailyTotal & saves.
     *
     * @param ingredientName e.g. 'Chicken Breast (skinless, raw)'
     * @param grams e.g. 150
     * @param mealType e.g. MealType.breakfast
     * @param date defaults to new Date() if not provided
     * @returns updated DailyCalorieDetailsModel (or null if ingredient not found)
     */
    static async trackIngredientForDay(
        ingredientName: string,
        grams: number,
        mealType: MealType,
        date: Date = new Date()
    ): Promise<DailyCalorieDetailsModel | null> {
        const ingredient = this.findIngredientByName(ingredientName);
        if (!ingredient) {
            return null; // or throw an error if you prefer
        }

        // Compute macros
        const macros = this.calculateMacrosForWeight(ingredient, grams);

        // Create new TrackedItem
        const trackedItem = new TrackedItem(
            mealType,
            ingredient.name,
            Math.round(macros.calories), // store as an integer
            grams
            // If your tracked item also stores protein/carbs/fat, you can add them to the constructor
        );

        // Load the daily details for the date
        let dailyDetails = await DailyCalorieDetailsService.getDailyCalorieDetails(date);
        if (!dailyDetails) {
            // If none exist for that date, create a new daily details
            // The dailyGoal could come from user data or a default
            dailyDetails = new DailyCalorieDetailsModel(
                2000,   // fallback dailyGoal
                0,
                [],
                date
            );
        }

        // Insert the new item
        dailyDetails.trackedItems.push(trackedItem);

        // Update dailyTotal
        dailyDetails.dailyTotal += trackedItem.calories;

        // Save
        await DailyCalorieDetailsService.saveDailyCalorieDetails(date, dailyDetails);
        return dailyDetails;
    }

    /**
     * Return all ingredients whose name partially matches the query.
     * e.g. 'chick' -> [Chicken Breast, etc.]
     */
    static searchIngredients(query: string): Ingredient[] {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) {
            // If no query, return an empty list (or the full list if you prefer)
            return [];
        }

        return IngredientsService.ingredients.filter(
            (item) => item.name.toLowerCase().includes(lowerQuery)
        );
    }
}

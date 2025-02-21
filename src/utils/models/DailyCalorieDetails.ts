export enum MealType {
    breakfast,
    lunch,
    dinner,
    snacks
}

export class TrackedItem {
    mealType: MealType;
    name: string;
    calories: number; // Total calories tracked for the item
    weight: number; // Weight in grams

    constructor(
        mealType: MealType,
        name: string,
        calories: number,
        weight: number,
    ) {
        this.mealType = mealType;
        this.name = name;
        this.calories = calories;
        this.weight = weight;
    }
}

export class DailyCalorieDetailsModel {
    dailyGoal: number;
    dailyTotal: number;
    trackedItems: TrackedItem[];
    date: Date;

    constructor(
        dailyGoal: number,
        dailyTotal: number,
        trackedItems: TrackedItem[],
        date: Date
    ) {
        this.dailyGoal = dailyGoal;
        this.dailyTotal = dailyTotal;
        this.trackedItems = trackedItems;
        this.date = date;
    }
}
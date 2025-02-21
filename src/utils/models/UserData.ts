export enum Gender {
    male,
    female
}

export enum ActivityLevel {
    sedentary,
    light,
    moderate,
    active,
    veryActive
}

export enum Goal {
    loseWeight,
    maintainWeight,
    gainWeight
}

export class UserDataModel {
    gender: Gender;
    age: number;
    height: number; // in centimeters
    weight: number; // in kilograms
    activityLevel: ActivityLevel;
    goal: Goal;
    currentDailyCalorieGoal?: number;

    constructor(
        gender: Gender,
        age: number,
        height: number,
        weight: number,
        activityLevel: ActivityLevel,
        goal: Goal
    ) {
        this.gender = gender;
        this.age = age;
        this.height = height;
        this.weight = weight;
        this.activityLevel = activityLevel;
        this.goal = goal;
    }
}
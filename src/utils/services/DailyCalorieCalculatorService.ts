import { UserDataModel, Gender, ActivityLevel, Goal } from '../models/UserData';

/**
 * Helper functions to map our TS enums to the
 * query parameters expected by the Google Apps Script API.
 */
function genderToString(gender: Gender): string {
    return gender === Gender.male ? 'male' : 'female';
}

function activityToString(activity: ActivityLevel): string {
    switch (activity) {
        case ActivityLevel.sedentary:  return 'sedentary';
        case ActivityLevel.light:      return 'light';
        case ActivityLevel.moderate:   return 'moderate';
        case ActivityLevel.active:     return 'active';
        case ActivityLevel.veryActive: return 'veryActive';
        default:                       return 'moderate';
    }
}

function goalToString(goal: Goal): string {
    switch (goal) {
        case Goal.loseWeight:     return 'loseWeight';
        case Goal.maintainWeight: return 'maintainWeight';
        case Goal.gainWeight:     return 'gainWeight';
        default:                  return 'maintainWeight';
    }
}

export class DailyCalorieCalculatorService {
    // The base URL for your Apps Script
    private static readonly API_URL =
        'https://script.google.com/macros/s/AKfycbzB3tmqmkcTCJMj_g3mMyUB_OHvjncJ1Q66EB-vI-58qeznyDIEyHhb1UHvJmrRqC-09A/exec';

    /**
     * Fetches daily calorie recommendation from the Google Apps Script endpoint
     * using the Mifflin–St Jeor formula logic server-side.
     *
     * @param userData The user's data (gender, age, etc.)
     * @returns The 'dailyCalories' number returned by the script, or a fallback (e.g. 2000) if unavailable.
     */
    static async getDailyCaloriesForUser(userData: UserDataModel): Promise<number> {
        const params = new URLSearchParams({
            gender: genderToString(userData.gender),
            age: userData.age.toString(),
            height: userData.height.toString(),
            weight: userData.weight.toString(),
            activityLevel: activityToString(userData.activityLevel),
            goal: goalToString(userData.goal),
        });

        const fullUrl = `${DailyCalorieCalculatorService.API_URL}?${params.toString()}`;
        console.log('Fetching daily goal from:', fullUrl);

        try {
            const response = await fetch(fullUrl);
            const data = await response.json(); // Expect { dailyCalories: number }
            if (data.dailyCalories != null) {
                return data.dailyCalories;
            }
            // fallback if property missing
            return 2000;
        } catch (error) {
            console.error('Error fetching daily calories from script:', error);
            // fallback if fetch fails
            return 2000;
        }
    }
}

import { storeObject, getObject, removeItem } from '../storage';
import { DailyCalorieDetailsModel } from '../models/DailyCalorieDetails';

function getDailyDetailsKeyForDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `DAILY_CALORIE_DETAILS_${yyyy}-${mm}-${dd}`;
}

export class DailyCalorieDetailsService {
    /**
     * Creates or updates the daily calorie details for a given date.
     */
    static async saveDailyCalorieDetails(
        date: Date,
        dailyDetails: DailyCalorieDetailsModel
    ): Promise<void> {
        const key = getDailyDetailsKeyForDate(date);
        await storeObject(key, dailyDetails);
    }

    /**
     * Fetches the daily calorie details for a given date.
     */
    static async getDailyCalorieDetails(
        date: Date
    ): Promise<DailyCalorieDetailsModel | null> {
        const key = getDailyDetailsKeyForDate(date);
        return await getObject<DailyCalorieDetailsModel>(key);
    }

    /**
     * Removes the daily calorie details for a given date.
     */
    static async removeDailyCalorieDetails(date: Date): Promise<void> {
        const key = getDailyDetailsKeyForDate(date);
        await removeItem(key);
    }
}
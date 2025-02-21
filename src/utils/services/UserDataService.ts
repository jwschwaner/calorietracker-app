import { UserDataModel } from '../models/UserData'; // Adjust the import path as needed
import { storeObject, getObject, removeItem } from '../storage';

// We’ll use a constant key for storing user data in AsyncStorage:
const USER_DATA_KEY = 'USER_DATA';

export class UserDataService {
    /**
     * Save or update user data in AsyncStorage.
     */
    static async saveUserData(userData: UserDataModel): Promise<void> {
        await storeObject(USER_DATA_KEY, userData);
    }

    /**
     * Retrieve user data from AsyncStorage.
     */
    static async getUserData(): Promise<UserDataModel | null> {
        return await getObject<UserDataModel>(USER_DATA_KEY);
    }

    /**
     * Remove user data from AsyncStorage.
     */
    static async removeUserData(): Promise<void> {
        await removeItem(USER_DATA_KEY);
    }
}

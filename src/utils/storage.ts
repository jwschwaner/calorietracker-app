import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing a single string or number
export const storeItem = async (key: string, value: string | number) => {
    try {
        // Everything must be stored as a string
        await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
        console.log(`Error storing item for key ${key}:`, error);
    }
};

// Storing an object
export const storeObject = async (key: string, value: object) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.log(`Error storing object for key ${key}:`, error);
    }
};

// Retrieving a stored string
export const getItem = async (key: string) => {
    try {
        return await AsyncStorage.getItem(key); // null if not found
    } catch (error) {
        console.log(`Error getting item for key ${key}:`, error);
        return null;
    }
};

// Retrieving a stored object
export const getObject = async <T = any>(key: string): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.log(`Error parsing object for key ${key}:`, error);
        return null;
    }
};

// Removing an item
export const removeItem = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log(`Error removing item for key ${key}:`, error);
    }
};

// Clearing all storage
export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log('Error clearing storage:', error);
    }
};

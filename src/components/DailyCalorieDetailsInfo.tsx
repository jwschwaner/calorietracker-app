import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyCalorieDetailsModel } from '../utils/models/DailyCalorieDetails';

type DailyCaloriesDetailsInfoProps = {
    dailyDetails: DailyCalorieDetailsModel;
};

export const DailyCaloriesDetailsInfo: React.FC<DailyCaloriesDetailsInfoProps> = ({ dailyDetails }) => {
    const { dailyGoal, dailyTotal, date } = dailyDetails;

    // Optionally format the date (React Native doesn't have built-in date-fns, so do minimal approach).
    const dateString = date.toString(); // e.g. "Tue Aug 22 2023"

    return (
        <View style={styles.container}>
            {/* Displaying the date */}
            <Text style={styles.dateText}>Date: {dateString}</Text>
            {/* Displaying the daily goal */}
            <Text style={styles.goalText}>
                Daily Goal: {dailyGoal} calories
            </Text>
            {/* Displaying how many calories consumed so far */}
            <Text style={styles.totalText}>
                Calories Eaten: {dailyTotal}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        margin: 16,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    dateText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    goalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    totalText: {
        fontSize: 16,
        marginVertical: 4,
    },
});

// screens/TrackingScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { Ingredient } from '../../utils/interfaces/Ingredient';
import { IngredientSearchAutoComplete } from '../../components/IngredientSearchAutoComplete';
import { IngredientsService } from '../../utils/services/IngredientsService';

// Assume MealType is an enum like:
// export enum MealType {
//   breakfast = 0,
//   lunch = 1,
//   dinner = 2,
//   snacks = 3
// }
import { MealType } from '../../utils/models/DailyCalorieDetails';
import { DailyCalorieDetailsModel } from '../../utils/models/DailyCalorieDetails';

export default function TrackingScreen() {
  // State for the currently selected ingredient
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  // State for grams input
  const [grams, setGrams] = useState('100');
  // State for meal type selection
  const [mealType, setMealType] = useState<MealType>(MealType.breakfast);

  // After logging, store updated daily details so we can show the user
  const [dailyDetails, setDailyDetails] = useState<DailyCalorieDetailsModel | null>(null);

  // Called when the user taps an ingredient suggestion in autocomplete
  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  // Simple function to cycle through meal types (optional)
  const cycleMealType = () => {
    const mealCount = 4; // If you have 4 meal types in your enum
    const nextValue = (mealType + 1) % mealCount;
    setMealType(nextValue);
  };

  // Called when user presses the LOG button
  const handleLogIngredient = async () => {
    if (!selectedIngredient) {
      Alert.alert('No Ingredient Selected', 'Please pick an ingredient first.');
      return;
    }

    const gramsValue = Number(grams) || 0;
    if (gramsValue <= 0) {
      Alert.alert('Invalid Grams', 'Please enter a valid weight in grams.');
      return;
    }

    // Track the item for today
    // This will find the ingredient, compute macros, create a TrackedItem,
    // add it to today's daily details, and save it in AsyncStorage
    const updated = await IngredientsService.trackIngredientForDay(
        selectedIngredient.name,
        gramsValue,
        mealType
    );

    if (!updated) {
      Alert.alert('Not Found', `No ingredient found for "${selectedIngredient.name}".`);
      return;
    }

    // If successful, we get the updated daily details
    setDailyDetails(updated);

    // Optionally, clear the selection or grams
    // setSelectedIngredient(null);
    // setGrams('100');
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Track an Ingredient</Text>

        {/* Autocomplete for Ingredient Selection */}
        <Text style={styles.label}>Search Ingredient</Text>
        <IngredientSearchAutoComplete onSelectIngredient={handleSelectIngredient} />

        {/* Display currently selected ingredient */}
        {selectedIngredient && (
            <Text style={styles.selectedText}>
              Selected: {selectedIngredient.name}
            </Text>
        )}

        {/* Grams Input */}
        <Text style={styles.label}>Grams</Text>
        <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={grams}
            onChangeText={setGrams}
            returnKeyType="done"
        />

        {/* Meal Type Selection (Cycle Button) */}
        <Text style={styles.label}>
          Meal Type: {MealType[mealType]}
        </Text>
        <Button
            title="Change Meal Type"
            onPress={cycleMealType}
        />

        {/* Log Button */}
        <View style={{ marginTop: 16 }}>
          <Button
              title="Log Ingredient"
              onPress={handleLogIngredient}
          />
        </View>

        {/* Show updated daily details, if any */}
        {dailyDetails && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsHeader}>
                Updated Daily Details
              </Text>
              <Text>Goal: {dailyDetails.dailyGoal} cals</Text>
              <Text>Total: {dailyDetails.dailyTotal} cals</Text>

              <Text style={{ marginTop: 8 }}>Tracked Items:</Text>
              {dailyDetails.trackedItems.map((item, idx) => (
                  <Text key={idx} style={{ marginLeft: 16 }}>
                    • {item.name} - {item.calories} cals ({item.weight}g)
                  </Text>
              ))}
            </View>
        )}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    marginBottom: 4,
  },
  selectedText: {
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  detailsContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  detailsHeader: {
    fontWeight: '600',
    marginBottom: 6,
  },
});

import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/src/components/EditScreenInfo';
import { Text, View } from '@/src/components/Themed';
import {DailyCaloriesDetailsInfo} from "@/src/components/DailyCalorieDetailsInfo";
import {DailyCalorieDetailsModel, MealType, TrackedItem} from "@/src/utils/models/DailyCalorieDetails";
import {useEffect, useState} from "react";

export default function HomeScreen() {
  const [dailyDetails, setDailyDetails] = useState<DailyCalorieDetailsModel | null>(null);

  useEffect(() => {
    // Example: create or fetch today's data
    const today = new Date();
    const exampleItems = [
      new TrackedItem(MealType.breakfast, 'Oatmeal', 300, 100),
      new TrackedItem(MealType.lunch, 'Chicken Salad', 450, 200),
    ];
    const dailyTotal = exampleItems.reduce((sum, item) => sum + item.calories, 0);
    const model = new DailyCalorieDetailsModel(2000, dailyTotal, exampleItems, today);

    setDailyDetails(model);
  }, []);

  return (
    <View style={styles.container}>
      {dailyDetails && (
          <DailyCaloriesDetailsInfo dailyDetails={dailyDetails} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { UserDataModel } from '../../utils/models/UserData';
import { UserDataService } from '../../utils/services/UserDataService';

import { DailyCalorieDetailsModel } from '../../utils/models/DailyCalorieDetails';
import { DailyCalorieDetailsService } from '../../utils/services/DailyCalorieDetailsService';
import { DailyCaloriesDetailsInfo } from '../../components/DailyCalorieDetailsInfo';
import { DailyCalorieCalculatorService } from '../../utils/services/DailyCalorieCalculatorService';

// Import your new drawer component
import { UserDataDrawerComponent } from '../../components/UserDataDrawer';

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserDataModel | null>(null);
  const [dailyDetails, setDailyDetails] = useState<DailyCalorieDetailsModel | null>(null);

  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  // Detect if this screen is currently focused/active
  const isFocused = useIsFocused();

  // Re-fetch data (user data + today's daily details) whenever the screen is focused
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const storedUserData = await UserDataService.getUserData();
      if (storedUserData) {
        setUserData(storedUserData);

        const today = new Date();
        const details = await DailyCalorieDetailsService.getDailyCalorieDetails(today);
        if (details) {
          setDailyDetails(details);
        } else {
          setDailyDetails(null);
        }
      } else {
        setUserData(null);
        setDailyDetails(null);
      }

      setLoading(false);
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  /**
   * Called when user submits the form from the UserDataDrawerComponent.
   * 1) Fetch dailyCalories from external API
   * 2) Save user data
   * 3) Create today's daily details
   * 4) Hide drawer
   */
  const handleUserDataSubmit = async (data: UserDataModel) => {
    try {
      setLoading(true);

      // 1) Fetch dailyCalories
      const dailyCalories = await DailyCalorieCalculatorService.getDailyCaloriesForUser(data);

      // 2) Store user data
      await UserDataService.saveUserData(data);
      setUserData(data);

      // 3) Create today's daily details
      const today = new Date();
      const newDailyDetails = new DailyCalorieDetailsModel(
          dailyCalories,
          0,      // no items yet
          [],
          today
      );
      await DailyCalorieDetailsService.saveDailyCalorieDetails(today, newDailyDetails);

      setDailyDetails(newDailyDetails);

      // 4) Close the drawer
      setShowDrawer(false);
    } catch (err) {
      console.error('Error in handleUserDataSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
    );
  }

  // If no user data yet, show a button to open the drawer
  if (!userData) {
    return (
        <SafeAreaView style={styles.container}>
          <Text>No user data found.</Text>
          <Button title="Set Up My Data" onPress={() => setShowDrawer(true)} />

          <UserDataDrawerComponent
              visible={showDrawer}
              onClose={() => setShowDrawer(false)}
              onSubmit={handleUserDataSubmit}
          />
        </SafeAreaView>
    );
  }

  // If user data exists, show daily details (or "no details" message).
  return (
      <SafeAreaView style={styles.container}>
        {dailyDetails ? (
            <DailyCaloriesDetailsInfo dailyDetails={dailyDetails} />
        ) : (
            <Text>No daily details found for today.</Text>
        )}

        <Button
            title="Edit My Data"
            onPress={() => setShowDrawer(true)}
        />

        {/* Reuse the drawer for editing, passing existingUserData */}
        <UserDataDrawerComponent
            visible={showDrawer}
            onClose={() => setShowDrawer(false)}
            onSubmit={handleUserDataSubmit}
            existingUserData={userData} // pre-populate form
        />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
});

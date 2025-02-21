import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Accelerometer } from 'expo-sensors';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isOnShakePage, setIsOnShakePage] = React.useState<boolean>(false);

  // Sensitivity Settings
  const SHAKE_THRESHOLD = 2.5;
  const SHAKE_INTERVAL = 1500;

  useEffect(() => {
    let lastShake = Date.now();

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (magnitude > SHAKE_THRESHOLD && now - lastShake > SHAKE_INTERVAL) {
        lastShake = now;

        if (!isOnShakePage) {
          router.push('/shake'); // ✅ Navigate to shake page
          setIsOnShakePage(true);
        } else {
          router.push('/(tabs)'); // ✅ Go back to tabs
          setIsOnShakePage(false);
        }
      }
    });

    Accelerometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, [isOnShakePage]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Tracking',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      {/* ✅ No Shake Tab registered here */}
    </Tabs>
  );
}

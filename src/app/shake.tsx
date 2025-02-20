import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';
import { Accelerometer } from 'expo-sensors';

export default function ShakeScreen() {
  const [isDrinking, setIsDrinking] = useState<boolean>(false);
  const [isRefilling, setIsRefilling] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Tilt sideways to drink');
  const liquidHeight = useRef(new Animated.Value(100)).current; // Start full
  const drinkAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      console.log(`Accelerometer Data -> x: ${x.toFixed(2)}, y: ${y.toFixed(2)}, z: ${z.toFixed(2)}`);

      // Thresholds
      const flatThreshold = 0.2; // Flat on table
      const tiltToDrinkThreshold = 0.5; // Start drinking when x passes this
      const stopTiltThreshold = 0.3; // Stop drinking if less tilted

      if (isRefilling) return; // 🚨 Ignore sensor input if refilling 🚨

      if (Math.abs(y) < flatThreshold) {
        // Flat on table → Stop drinking
        if (isDrinking) {
          stopDrinking();
          setStatus('Phone is flat — not drinking');
        }
      } else if (Math.abs(x) > tiltToDrinkThreshold && !isDrinking) {
        // Start drinking when tilted enough
        startDrinking();
      } else if (Math.abs(x) < stopTiltThreshold && isDrinking) {
        // Stop drinking if tilt is reduced
        stopDrinking();
        setStatus('Stopped drinking — Tilt again!');
      }
    });

    Accelerometer.setUpdateInterval(100); // 100ms update interval

    return () => subscription.remove(); // Cleanup on unmount
  }, [isDrinking, isRefilling]);

  // Start drinking animation
  const startDrinking = () => {
    if (isRefilling) return; // 🚨 Prevent drinking if refilling 🚨

    setIsDrinking(true);
    setStatus('Drinking... 🍻');

    drinkAnimationRef.current = Animated.timing(liquidHeight, {
      toValue: 0, // Empty the glass
      duration: 5000, // 5 seconds to drink fully
      useNativeDriver: false,
    });

    drinkAnimationRef.current.start(({ finished }) => {
      if (finished) {
        startRefill();
      }
    });
  };

  // Stop drinking animation
  const stopDrinking = () => {
    if (drinkAnimationRef.current) {
      drinkAnimationRef.current.stop(); // Cancel drinking
    }
    setIsDrinking(false);
  };

  // Refill animation (CANNOT BE INTERRUPTED)
  const startRefill = () => {
    setIsRefilling(true);
    setStatus('Refilling... 🔄');

    Animated.timing(liquidHeight, {
      toValue: 100, // Fill glass to 100%
      duration: 4000, // 4 seconds to refill
      useNativeDriver: false,
    }).start(() => {
      setIsRefilling(false);
      setStatus('Tilt sideways to drink');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍺 iBeer Simulation</Text>

      <View style={styles.glass}>
        <Animated.View
          style={[
            styles.liquid,
            {
              height: liquidHeight.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <Image
          source={{ uri: 'https://imgur.com/a/8ot8qpJ.png' }} // Replace with direct image link
          style={styles.glassImage}
        />
      </View>

      <Text style={styles.instructions}>
        Tilt your phone sideways to drink! 📱🍺
      </Text>

      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1e7dd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  glass: {
    width: 150,
    height: 300,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    position: 'relative',
  },
  glassImage: {
    position: 'absolute',
    width: 150,
    height: 300,
    top: 0,
    left: 0,
  },
  liquid: {
    backgroundColor: '#f4c542',
    width: '100%',
  },
  instructions: {
    marginTop: 30,
    fontSize: 16,
  },
  status: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

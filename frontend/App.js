import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [steps, setSteps] = useState(0);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required');
    }
  };

  const fetchSteps = async () => {
    try {
      // Placeholder for Health Connect API integration
      setSteps(Math.floor(Math.random() * 10000));
      Alert.alert('Steps Synced', `Today: ${steps} steps`);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch steps');
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
        Alert.alert('Photo Captured', `Location: ${loc.coords.latitude}, ${loc.coords.longitude}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not capture photo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gremlin Health</Text>
      <Text style={styles.subtitle}>Move to Earn</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Steps</Text>
        <Text style={styles.stepCount}>{steps}</Text>
        <Button title="Sync Steps" onPress={fetchSteps} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Achievement Photo</Text>
        <Button title="Take Photo with GPS" onPress={takePhoto} />
        {location && (
          <Text style={styles.location}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 16,
  },
  location: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});

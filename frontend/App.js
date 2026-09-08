import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { userService, stepsService, photoService, cardService } from './services/api';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [steps, setSteps] = useState(0);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await requestLocationPermission();
    await initializeUser();
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required');
    }
  };

  const initializeUser = async () => {
    try {
      setLoading(true);
      const user = await userService.createUser(
        'user@gremlin-health.app',
        'user_' + Date.now()
      );
      setUserId(user.id);
      setUserName(user.username);
    } catch (error) {
      console.log('User might already exist, trying to fetch...');
      try {
        const users = await userService.listUsers();
        if (users.length > 0) {
          setUserId(users[0].id);
          setUserName(users[0].username);
        }
      } catch (err) {
        Alert.alert('Error', 'Could not initialize user: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSteps = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not initialized');
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const stepsData = await stepsService.syncSteps(userId, today, 8500);
      setSteps(stepsData.steps);
      Alert.alert('Steps Synced', `${stepsData.steps} steps recorded for ${today}`);
    } catch (error) {
      Alert.alert('Error', 'Could not sync steps: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not initialized');
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);

        const photoUrl = result.assets[0].uri;
        const photo = await photoService.uploadPhoto(
          userId,
          loc.coords.latitude,
          loc.coords.longitude,
          photoUrl,
          JSON.stringify({ timestamp: new Date().toISOString() })
        );

        Alert.alert('Photo Uploaded', `Location: ${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not capture photo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gremlin Health</Text>
        <Text style={styles.subtitle}>Move to Earn</Text>
        {userId && <Text style={styles.userName}>👤 {userName}</Text>}
      </View>

      {loading && <ActivityIndicator size="large" color="#2ecc71" />}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Today's Steps</Text>
        <Text style={styles.stepCount}>{steps}</Text>
        <Button
          title="Sync Steps from Health Connect"
          onPress={fetchSteps}
          disabled={loading}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📷 Achievement Photo</Text>
        <Button
          title="Take Photo with GPS Location"
          onPress={takePhoto}
          disabled={loading}
        />
        {location && (
          <Text style={styles.location}>
            📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Status</Text>
        <Text style={styles.infoText}>
          {userId ? `✅ Connected to API (User #${userId})` : '⏳ Connecting to API...'}
        </Text>
        <Text style={styles.infoText}>API: gremlin-health-production.up.railway.app</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  userName: {
    fontSize: 14,
    color: '#888',
  },
  card: {
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
    color: '#333',
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 16,
    textAlign: 'center',
  },
  location: {
    marginTop: 16,
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '500',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#e8f8f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#27ae60',
  },
  infoText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
});

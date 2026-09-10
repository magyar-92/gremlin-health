import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { userService, stepsService } from '../services/api';
import { Card, Button, CircleButton, ProgressBar } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { useHealthConnect } from '../hooks/useHealthConnect';

export default function HomeScreen() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('User');
  const { steps: deviceSteps, isAvailable: healthConnectAvailable, refetch } = useHealthConnect();
  const [stepGoal, setStepGoal] = useState(100000);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (userId && deviceSteps > 0) {
      syncStepsToAPI();
    }
  }, [deviceSteps, userId]);

  const syncStepsToAPI = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log(`📤 Синхронізація: користувач ${userId}, кроки ${deviceSteps}, дата ${today}`);
      await stepsService.syncSteps(userId, today, deviceSteps);
      console.log('✅ Кроки успішно синхронізовані');
    } catch (error) {
      console.log('❌ Помилка синхронізації:', error.message);
    }
  };

  const testSync = async () => {
    try {
      console.log('🧪 Тестування: надсилаю 500 тестових кроків...');
      const today = new Date().toISOString().split('T')[0];
      await stepsService.syncSteps(userId, today, 500);
      Alert.alert('✅ Успіх', 'Тестові кроки надіслано');
      console.log('✅ Тестові кроки надіслано');
    } catch (error) {
      Alert.alert('❌ Помилка', error.message);
      console.log('❌ Помилка тестування:', error.message);
    }
  };

  const initializeUser = async () => {
    try {
      const users = await userService.listUsers();
      if (users.length > 0) {
        setUserId(users[0].id);
        setUserName(users[0].username);
        setBalance(10425);
      } else {
        const newUser = await userService.createUser('user@gremlin-health.app', 'user_' + Date.now());
        setUserId(newUser.id);
        setUserName(newUser.username);
        setBalance(10425);
      }
    } catch (error) {
      console.log('Error loading user:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSteps = async (uid) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const stepsData = await stepsService.syncSteps(uid, today, deviceSteps);
      // Steps are now managed by useSteps hook
    } catch (error) {
      console.log('Could not fetch steps');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const stepProgress = (deviceSteps / stepGoal) * 100;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userSteps}>{deviceSteps.toLocaleString()} GRLN</Text>
          </View>
        </View>
        <View style={styles.balanceTag}>
          <Text style={styles.balanceAmount}>{balance}</Text>
          <Text style={styles.balanceCurrency}>GRLN</Text>
        </View>
      </View>

      {/* Steps Circle */}
      <View style={styles.stepsSection}>
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={styles.stepFootsteps}>👣</Text>
            <Text style={styles.stepsCount}>{deviceSteps.toLocaleString()}</Text>
            <Text style={styles.stepsLabel}>STEPS</Text>
          </View>
          <Text style={styles.stepProgress}>
            {deviceSteps.toLocaleString()} / {stepGoal.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Energy Bar */}
      <View style={styles.energySection}>
        <ProgressBar
          progress={85}
          color="secondary"
          height={12}
          label="⚡ 850/1000 HP ENERGY POINTS"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <CircleButton label="MOVE" color="primary" size={70} />
        <CircleButton label="STEPS" color="secondary" size={70} />
        <CircleButton label="GRLN" color="tertiary" size={70} />
      </View>

      {/* Debug: Test Button */}
      <TouchableOpacity style={styles.testButton} onPress={testSync}>
        <Text style={styles.testButtonText}>🧪 TEST SYNC (500 steps)</Text>
      </TouchableOpacity>

      {/* Debug: Health Connect Status */}
      <Text style={styles.debugText}>
        🏥 Health Connect: {healthConnectAvailable === 'available' ? '✅ Підключено' : healthConnectAvailable === 'checking' ? '⏳ Перевіряю...' : '❌ Недоступний'}
      </Text>

      {/* Daily Activity */}
      <Text style={styles.sectionTitle}>DAILY ACTIVITY</Text>
      <View style={styles.activityGrid}>
        <Card style={styles.walkingCard}>
          <Text style={styles.activityCardTitle}>WALKING DISTANCE</Text>
          <Text style={[styles.activityCardValue, { color: '#000' }]}>78.4 km</Text>
          <Text style={[styles.activityCardSubtitle, { color: '#333' }]}>15h 12m</Text>
        </Card>
        <Card style={styles.caloriesCard}>
          <Text style={styles.activityCardTitle}>CALORIES BURNED</Text>
          <Text style={[styles.activityCardValue, { color: '#fff' }]}>5,630</Text>
          <Text style={[styles.activityCardSubtitle, { color: colors.textSecondary }]}>kcal</Text>
        </Card>
      </View>

      {/* Balance Section */}
      <Text style={styles.balanceInfo}>
        CURRENT: ${(balance / 100).toFixed(2)} ({balance.toLocaleString()} GRLN)
      </Text>

      {/* Mint NFT Button */}
      <TouchableOpacity style={styles.mintButton}>
        <Text style={styles.mintButtonText}>MINT GREMLIN NFT</Text>
        <Text style={styles.mintButtonEmoji}>👹⚡</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  avatarText: {
    fontSize: typography.sizes['3xl'],
  },
  userName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  userSteps: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  balanceTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  balanceCurrency: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  stepsSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  circleContainer: {
    alignItems: 'center',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  stepFootsteps: {
    fontSize: typography.sizes['3xl'],
  },
  stepsCount: {
    fontSize: typography.sizes['5xl'],
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  stepsLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  stepProgress: {
    fontSize: typography.sizes.base,
    color: colors.primary,
  },
  energySection: {
    marginBottom: spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  activityGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  walkingCard: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  caloriesCard: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  activityCardTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
  },
  activityCardValue: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
  },
  activityCardSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.sm,
  },
  balanceInfo: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  mintButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  mintButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: '#000',
  },
  mintButtonEmoji: {
    fontSize: typography.sizes['2xl'],
  },
  testButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  testButtonText: {
    textAlign: 'center',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: '#000',
  },
  debugText: {
    textAlign: 'center',
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
});


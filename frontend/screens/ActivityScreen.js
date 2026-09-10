import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSteps } from '../hooks/useSteps';

export default function ActivityScreen() {
  const { steps, isPedometerAvailable, resetSteps } = useSteps();

  const getStatusColor = () => {
    if (isPedometerAvailable === 'available') return '#2ecc71';
    if (isPedometerAvailable === 'unavailable') return '#e74c3c';
    return '#95a5a6';
  };

  const getStatusText = () => {
    if (isPedometerAvailable === 'available') return 'Активний';
    if (isPedometerAvailable === 'unavailable') return 'Недоступний';
    return 'Перевірка...';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ваша активність</Text>

        <View style={styles.statusCard}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>Педометр: {getStatusText()}</Text>
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsLabel}>Кроки сьогодні</Text>
          <Text style={styles.stepsValue}>{steps.toLocaleString('uk-UA')}</Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((steps / 10000) * 100, 100)}%` }
              ]}
            />
          </View>

          <Text style={styles.goalText}>Мета: 10 000 кроків</Text>
        </View>

        {steps > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetSteps}
          >
            <Text style={styles.resetButtonText}>Скинути лічильник</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>💡 Інформація</Text>
          <Text style={styles.infoText}>
            Дані синхронізуються автоматично з датчика рухомості вашого пристрою.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  stepsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepsLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  stepsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ecc71',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#ecf9ff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});

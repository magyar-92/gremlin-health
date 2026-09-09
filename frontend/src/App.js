import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏃 Gremlin Health</Text>
        <Text style={styles.subtitle}>Move-to-earn фітнес</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Ваша статистика</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Кроки</Text>
            <Text style={styles.statValue}>5,234</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Калорії</Text>
            <Text style={styles.statValue}>320 kcal</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Монети</Text>
            <Text style={styles.statValue}>125 🪙</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Рівень</Text>
            <Text style={styles.statValue}>5</Text>
          </View>
        </View>
      </View>

      <View style={styles.activitiesContainer}>
        <Text style={styles.sectionTitle}>⚡ Активні вправи</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityName}>🏃 Біг</Text>
          <Text style={styles.activityDesc}>5 км</Text>
          <Text style={styles.reward}>+50 🪙</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityName}>🧘 Йога</Text>
          <Text style={styles.activityDesc}>30 хв</Text>
          <Text style={styles.reward}>+30 🪙</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityName}>🚶 Ходьба</Text>
          <Text style={styles.activityDesc}>2 км</Text>
          <Text style={styles.reward}>+20 🪙</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  statsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    width: '48%',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  activitiesContainer: {
    padding: 15,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  reward: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 8,
  },
})

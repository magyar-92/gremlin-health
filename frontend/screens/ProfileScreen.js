import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { userService } from '../services/api';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(10425);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const users = await userService.listUsers();
      if (users.length > 0) {
        setUser(users[0]);
      }
    } catch (error) {
      console.log('Помилка завантаження профілю:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Вихід', 'Ви впевнені, що хочете вийти?', [
      { text: 'Скасувати', onPress: () => {} },
      {
        text: 'Вийти',
        onPress: () => Alert.alert('✅ Успіх', 'Ви вийшли з облікового запису'),
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@gremlin-health.app'}</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Ваш баланс</Text>
            <Text style={styles.balanceAmount}>{balance.toLocaleString('uk-UA')} GRLN</Text>
          </View>
          <View style={styles.balanceIcon}>
            <Text style={styles.balanceEmoji}>💰</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Статистика</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🚶</Text>
              <Text style={styles.statValue}>48,250</Text>
              <Text style={styles.statLabel}>Кроки</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Дні поспіль</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>450</Text>
              <Text style={styles.statLabel}>Очки</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Досягнення</Text>
          <View style={styles.achievementsList}>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🥇</Text>
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Перший крок</Text>
                <Text style={styles.achievementDesc}>Зробіть 100 кроків</Text>
              </View>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🌟</Text>
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Марафонець</Text>
                <Text style={styles.achievementDesc}>Досягніть 10,000 кроків за день</Text>
              </View>
            </View>
            <View style={styles.achievementItem}>
              <Text style={styles.achievementEmoji}>🔥</Text>
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Послідовність</Text>
                <Text style={styles.achievementDesc}>Будьте активні 7 днів поспіль</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Мої налаштування</Text>
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>✏️ Редагувати профіль</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>🔐 Змінити пароль</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.preferenceItem}>
            <Text style={styles.preferenceLabel}>🔗 Пов'язані акаунти</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Вийти</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  balanceIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#fff3e0',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceEmoji: {
    fontSize: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  achievementEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  preferenceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  preferenceLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

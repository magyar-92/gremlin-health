import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [stepGoal, setStepGoal] = useState('10000');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedGoal = await AsyncStorage.getItem('step_goal');
      const savedNotifications = await AsyncStorage.getItem('notifications_enabled');
      if (savedGoal) setStepGoal(savedGoal);
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    } catch (error) {
      console.log('Помилка завантаження налаштувань:', error.message);
    }
  };

  const saveStepGoal = async (value) => {
    try {
      await AsyncStorage.setItem('step_goal', value);
      setStepGoal(value);
      Alert.alert('✅ Успіх', `Ціль встановлена на ${value} кроків`);
    } catch (error) {
      Alert.alert('❌ Помилка', error.message);
    }
  };

  const toggleNotifications = async (value) => {
    try {
      await AsyncStorage.setItem('notifications_enabled', JSON.stringify(value));
      setNotifications(value);
    } catch (error) {
      console.log('Помилка збереження налаштувань:', error.message);
    }
  };

  const handleGoalChange = (goal) => {
    saveStepGoal(goal.toString());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Налаштування</Text>

        {/* Step Goal Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Ціль кроків</Text>
          <View style={styles.goalButtons}>
            {['5000', '7500', '10000', '15000', '20000'].map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  stepGoal === goal && styles.goalButtonActive,
                ]}
                onPress={() => handleGoalChange(goal)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    stepGoal === goal && styles.goalButtonTextActive,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>🔔 Сповіщення</Text>
              <Text style={styles.settingDescription}>
                Отримувати оновлення про прогрес
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#81c784' }}
              thumbColor={notifications ? '#4caf50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Про додаток</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Версія:</Text> 0.1.0
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Розроблено:</Text> Gremlin Health
            </Text>
          </View>
        </View>

        {/* Device Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Інформація про пристрій</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Дозволи:</Text> Розпізнавання активності
            </Text>
            <Text style={styles.infoText} style={{marginTop: 8}}>
              Додаток потребує дозволу на доступ до датчика рухомості для підрахунку кроків.
            </Text>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Допомога</Text>
          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => Alert.alert(
              'Як працює отслідування кроків?',
              'Додаток автоматично синхронізує дані з датчика рухомості вашого пристрою. Кроки накопичуються впродовж дня і зберігаються локально.'
            )}
          >
            <Text style={styles.helpButtonText}>Як працює отслідування кроків?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => Alert.alert(
              'Що таке GRLN?',
              'GRLN - це внутрішня валюта Gremlin Health. Ви заробляєте GRLN за кроки та можете обмінювати їх на цінні предмети.'
            )}
          >
            <Text style={styles.helpButtonText}>Що таке GRLN?</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Конфіденційність</Text>
          <Text style={styles.privacyText}>
            Ваші дані про кроки зберігаються локально на пристрої і не передаються третім особам без вашої згоди.
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
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#2c3e50',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  goalButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalButton: {
    flex: 1,
    minWidth: '30%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ecf0f1',
    backgroundColor: '#f8f9fa',
  },
  goalButtonActive: {
    borderColor: '#2ecc71',
    backgroundColor: '#d5f4e6',
  },
  goalButtonText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  goalButtonTextActive: {
    color: '#2ecc71',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
  },
  helpButton: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  helpButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  privacyText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});

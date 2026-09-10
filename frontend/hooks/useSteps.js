import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS_STORAGE_KEY = 'accumulated_steps';
const LAST_SYNC_KEY = 'last_steps_sync';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    let subscription;

    const initPedometer = async () => {
      try {
        // Завантажу збережені кроки
        const savedSteps = await AsyncStorage.getItem(STEPS_STORAGE_KEY);
        if (savedSteps) {
          setSteps(parseInt(savedSteps, 10));
          console.log('🚶 Завантажено збережені кроки:', savedSteps);
        }

        console.log('🚶 Перевіряю доступність педометра...');
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('🚶 Педометр доступний:', isAvailable);
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (!isAvailable) {
          console.log('⚠️ Педометр недоступний');
          return;
        }

        console.log('🚶 Запускаю watchStepCount...');
        subscription = Pedometer.watchStepCount((stepData) => {
          if (stepData && typeof stepData.steps === 'number') {
            console.log('🚶 Нові кроки:', stepData.steps);

            setSteps(prev => {
              const newTotal = prev + stepData.steps;
              console.log('🚶 Загалом кроків:', newTotal);

              // Зберігаю в AsyncStorage
              AsyncStorage.setItem(STEPS_STORAGE_KEY, newTotal.toString());

              return newTotal;
            });
          }
        });

      } catch (error) {
        console.log('❌ Помилка педометра:', error.message);
        setIsPedometerAvailable('unavailable');
      }
    };

    initPedometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const resetSteps = async () => {
    setSteps(0);
    await AsyncStorage.setItem(STEPS_STORAGE_KEY, '0');
    console.log('🚶 Кроки скинуті');
  };

  return { steps, isPedometerAvailable, resetSteps };
};

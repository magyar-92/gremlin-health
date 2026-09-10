import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { AppState } from 'react-native';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    let subscription;
    let pollInterval;
    let appStateSubscription;

    const initPedometer = async () => {
      try {
        console.log('🚶 Перевіряю доступність педометра...');
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('🚶 Педометр доступний:', isAvailable);
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (isAvailable) {
          console.log('🚶 Запускаю спостереження за кроками через watch...');
          subscription = Pedometer.watchStepCount((result) => {
            console.log('🚶 Кроки отримані (watch):', result.steps);
            setSteps(result.steps || 0);
          });

          // Також опитуємо кроки кожні 5 секунд як резервний варіант
          pollInterval = setInterval(async () => {
            try {
              const now = new Date();
              const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

              const result = await Pedometer.getStepCountAsync(startOfDay, now);
              if (result && result.steps > 0) {
                console.log('🚶 Кроки отримані (poll):', result.steps);
                setSteps(result.steps);
              }
            } catch (e) {
              // Тихо ігноруємо помилки від getStepCountAsync
            }
          }, 5000);
        } else {
          console.log('⚠️ Педометр недоступний на цьому пристрої');
        }
      } catch (error) {
        console.log('❌ Помилка педометра:', error.message);
        setIsPedometerAvailable('unavailable');
        setSteps(0);
      }
    };

    initPedometer();

    // Перезапускаємо педометр коли додаток повертається з фону
    appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        console.log('🚶 Додаток активний, перезапускаю педометр');
        initPedometer();
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, []);

  return { steps, isPedometerAvailable };
};

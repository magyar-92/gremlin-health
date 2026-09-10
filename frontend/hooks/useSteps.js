import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    let subscription;

    const initPedometer = async () => {
      try {
        console.log('🚶 Перевіряю доступність педометра...');
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('🚶 Педометр доступний:', isAvailable);
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (isAvailable) {
          console.log('🚶 Запускаю спостереження за кроками...');
          subscription = Pedometer.watchStepCount((result) => {
            console.log('🚶 Кроки отримані:', result.steps);
            setSteps(result.steps || 0);
          });
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

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return { steps, isPedometerAvailable };
};

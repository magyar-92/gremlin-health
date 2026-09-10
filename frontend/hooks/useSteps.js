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

        if (!isAvailable) {
          console.log('⚠️ Педометр недоступний на цьому пристрої');
          setSteps(0);
          return;
        }

        console.log('🚶 Запускаю watchStepCount для поточних кроків...');

        subscription = Pedometer.watchStepCount((stepData) => {
          console.log('🚶 Дані педометра отримані:', stepData);
          if (stepData && typeof stepData.steps === 'number') {
            console.log('🚶 Нові кроки:', stepData.steps);
            setSteps(stepData.steps);
          }
        });

        console.log('✅ watchStepCount підписка активна');

      } catch (error) {
        console.log('❌ Помилка педометра:', error.message);
        setIsPedometerAvailable('unavailable');
        setSteps(0);
      }
    };

    initPedometer();

    return () => {
      if (subscription) {
        console.log('🚶 Очищую підписку на кроки');
        subscription.remove();
      }
    };
  }, []);

  return { steps, isPedometerAvailable };
};

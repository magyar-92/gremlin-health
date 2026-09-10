import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

let lastSteps = 0;

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    let pollInterval;

    const initPedometer = async () => {
      try {
        console.log('🚶 Перевіряю доступність педометра...');
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('🚶 Педометр доступний:', isAvailable);
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (!isAvailable) {
          console.log('⚠️ Педометр недоступний на цьому пристрої');
          return;
        }

        // Спробуємо отримати кроки для сьогодні через getStepCountAsync
        console.log('🚶 Запускаю опитування кроків...');

        pollInterval = setInterval(async () => {
          try {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const result = await Pedometer.getStepCountAsync(startOfDay, now);
            console.log('🚶 Кроки отримані:', result?.steps || 0);

            if (result && result.steps >= 0) {
              setSteps(result.steps);
              lastSteps = result.steps;
            }
          } catch (err) {
            console.log('❌ Помилка при отриманні кроків:', err.message);
          }
        }, 3000);

        // Один раз спробуємо отримати при запуску
        try {
          const now = new Date();
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const initialResult = await Pedometer.getStepCountAsync(startOfDay, now);
          console.log('🚶 Початкові кроки:', initialResult?.steps || 0);
          if (initialResult && initialResult.steps >= 0) {
            setSteps(initialResult.steps);
            lastSteps = initialResult.steps;
          }
        } catch (err) {
          console.log('❌ Помилка при отриманні початкових кроків:', err.message);
        }

      } catch (error) {
        console.log('❌ Помилка педометра:', error.message);
        setIsPedometerAvailable('unavailable');
      }
    };

    initPedometer();

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, []);

  return { steps, isPedometerAvailable };
};

import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [cumulativeSteps, setCumulativeSteps] = useState(0);

  useEffect(() => {
    let subscription;

    const initPedometer = async () => {
      try {
        console.log('🚶 Перевіряю доступність педометра...');
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('🚶 Педометр доступний:', isAvailable);
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (!isAvailable) {
          console.log('⚠️ Педометр недоступний - використовую симуляцію');
          // Симулюємо кроки для тестування UI
          let simulatedSteps = 0;
          const simulator = setInterval(() => {
            simulatedSteps += Math.floor(Math.random() * 5) + 1;
            setSteps(simulatedSteps);
            console.log('🎮 Симульовані кроки:', simulatedSteps);
          }, 2000);

          return () => clearInterval(simulator);
        }

        console.log('🚶 Запускаю watchStepCount...');

        subscription = Pedometer.watchStepCount((stepData) => {
          console.log('🚶 Дані педометра:', JSON.stringify(stepData));
          if (stepData && typeof stepData.steps === 'number') {
            // watchStepCount повертає ІНКРЕМЕНТАЛЬНІ кроки
            const newSteps = stepData.steps;
            console.log('🚶 Інкрементальні кроки:', newSteps);

            setCumulativeSteps(prev => {
              const total = prev + newSteps;
              console.log('🚶 Загальна сума кроків:', total);
              setSteps(total);
              return total;
            });
          }
        });

        console.log('✅ watchStepCount активний');

      } catch (error) {
        console.log('❌ Помилка педометра:', error.message, error);
        setIsPedometerAvailable('unavailable');
      }
    };

    initPedometer();

    return () => {
      if (subscription) {
        console.log('🚶 Очищую підписку');
        subscription.remove();
      }
    };
  }, []);

  return { steps, isPedometerAvailable };
};

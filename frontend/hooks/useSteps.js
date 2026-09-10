import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    let subscription;

    const initPedometer = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');

        if (isAvailable) {
          subscription = Pedometer.watchStepCount((result) => {
            setSteps(result.steps || 0);
          });
        }
      } catch (error) {
        console.log('Ошибка педометра:', error);
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

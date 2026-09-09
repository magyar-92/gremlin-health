import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const useSteps = () => {
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  useEffect(() => {
    checkPedometerAvailability();
    startStepTracking();
  }, []);

  const checkPedometerAvailability = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable ? 'available' : 'unavailable');
    } catch (error) {
      setIsPedometerAvailable('unavailable');
    }
  };

  const startStepTracking = async () => {
    try {
      const subscription = Pedometer.watchStepCount((result) => {
        setSteps(result.steps || 0);
      });

      return subscription;
    } catch (error) {
      console.log('Pedometer error:', error);
      setSteps(0);
    }
  };

  return { steps, isPedometerAvailable };
};

import { useState, useEffect } from 'react';
import { initialize, requestPermission, readRecords, SdkAvailabilityStatus } from 'react-native-health-connect';

export const useHealthConnect = () => {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState('checking');
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    initHealthConnect();
  }, []);

  const initHealthConnect = async () => {
    try {
      console.log('🏥 Перевіряю доступність Health Connect...');

      const availability = await initialize();
      console.log('🏥 Health Connect статус:', availability);

      if (availability !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        console.log('⚠️ Health Connect недоступний:', availability);
        setIsAvailable('unavailable');
        return;
      }

      console.log('🏥 Запитую дозволи на читання кроків...');
      const permissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
      ]);

      console.log('🏥 Дозволи отримані:', permissions);
      setIsAvailable('available');

      // Читаємо кроки за сьогодні
      await fetchTodaySteps();

      // Оновлюємо кожні 10 секунд
      const interval = setInterval(fetchTodaySteps, 10000);

      return () => clearInterval(interval);

    } catch (error) {
      console.log('❌ Помилка Health Connect:', error.message);
      setIsAvailable('error');
    }
  };

  const fetchTodaySteps = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      console.log('🏥 Читаю кроки з Health Connect...');

      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startOfDay.toISOString(),
          endTime: now.toISOString(),
        },
      });

      console.log('🏥 Отримано записів:', result?.records?.length || 0);

      if (result && result.records) {
        const totalSteps = result.records.reduce((sum, record) => {
          return sum + (record.count || 0);
        }, 0);

        console.log('🏥 Загальна кількість кроків:', totalSteps);
        setSteps(totalSteps);
        setLastSync(new Date());
      }

    } catch (error) {
      console.log('❌ Помилка читання кроків:', error.message);
    }
  };

  return {
    steps,
    isAvailable,
    lastSync,
    refetch: fetchTodaySteps
  };
};

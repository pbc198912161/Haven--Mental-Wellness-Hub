import { useState, useEffect } from 'react';
import { getLocalDateString, getTimeGreeting } from '@/lib/dates';
import { getAffirmationForDate } from '@/lib/affirmations';

export interface TodayState {
  now: Date;
  todayDate: string; // YYYY-MM-DD
  greeting: string;
  affirmation: string;
  affirmationIndex: number;
}

export function useToday(): TodayState {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Check every 30 seconds for clock/day changes
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30000);

    // Also refresh immediately when tab regains focus or visibility
    const handleFocus = () => setNow(new Date());
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const todayDate = getLocalDateString(now);
  const greeting = getTimeGreeting(now);
  const { affirmation, index: affirmationIndex } = getAffirmationForDate(now);

  return {
    now,
    todayDate,
    greeting,
    affirmation,
    affirmationIndex,
  };
}

import { CheckIn, GratitudeEntry, BreathingSession, Tag, MoodId, WeeklyReflectionData } from '@/types';
import { MOOD_MAP } from './moods';
import { getPastDates, formatDateDisplay, parseLocalDate } from './dates';

export function calculateWeeklyReflection(
  checkins: CheckIn[],
  gratitude: GratitudeEntry[],
  breathing: BreathingSession[],
  endDate: Date = new Date()
): WeeklyReflectionData {
  const last7Dates = getPastDates(7, endDate);
  const dateSet = new Set(last7Dates);

  const weekCheckIns = checkins.filter((c) => dateSet.has(c.date));
  const minTime = parseLocalDate(last7Dates[0]).getTime() - 12 * 3600 * 1000;
  const maxTime = parseLocalDate(last7Dates[last7Dates.length - 1]).getTime() + 36 * 3600 * 1000;

  const weekGratitude = gratitude.filter(
    (g) => g.createdAt >= minTime && g.createdAt <= maxTime
  );
  const weekBreathing = breathing.filter(
    (b) => b.createdAt >= minTime && b.createdAt <= maxTime
  );

  const checkInCount = weekCheckIns.length;
  const hasEnoughData = checkInCount >= 2;

  if (!hasEnoughData) {
    return {
      checkInCount,
      mostFrequentMood: null,
      bestDay: null,
      mostCommonInfluence: null,
      gratitudeCount: weekGratitude.length,
      minutesBreathed: Math.round(weekBreathing.reduce((acc, s) => acc + s.seconds, 0) / 60),
      summaryText: '',
      hasEnoughData: false,
    };
  }

  // Frequency of moods
  const moodCounts: Record<MoodId, number> = {
    joyful: 0,
    calm: 0,
    okay: 0,
    tired: 0,
    anxious: 0,
    low: 0,
  };
  let bestScore = -1;
  let bestDay: string | null = null;
  let totalScore = 0;

  weekCheckIns.forEach((c) => {
    moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
    totalScore += c.score;
    if (c.score > bestScore) {
      bestScore = c.score;
      bestDay = c.date;
    }
  });

  let maxMoodCount = -1;
  let mostFrequentMoodId: MoodId = 'okay';
  (Object.keys(moodCounts) as MoodId[]).forEach((id) => {
    if (moodCounts[id] > maxMoodCount) {
      maxMoodCount = moodCounts[id];
      mostFrequentMoodId = id;
    }
  });

  // Most common influence
  const tagCounts: Partial<Record<Tag, number>> = {};
  weekCheckIns.forEach((c) => {
    c.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  let mostCommonInfluence: Tag | null = null;
  let maxTagCount = 0;
  (Object.keys(tagCounts) as Tag[]).forEach((tag) => {
    const count = tagCounts[tag] || 0;
    if (count > maxTagCount) {
      maxTagCount = count;
      mostCommonInfluence = tag;
    }
  });

  // Written summary from templates
  const avgScore = totalScore / checkInCount;
  let scoreDescription = '';
  if (avgScore >= 4.2) {
    scoreDescription = 'a mostly bright week';
  } else if (avgScore >= 3.4) {
    scoreDescription = 'a mostly steady week';
  } else if (avgScore >= 2.5) {
    scoreDescription = 'a mixed week';
  } else {
    scoreDescription = 'a heavier week';
  }

  const bestDayDisplay = bestDay ? formatDateDisplay(bestDay, { short: true }) : '';
  const mostFrequentMeta = MOOD_MAP[mostFrequentMoodId];

  let summaryText = `Looking over the past seven days, this has been ${scoreDescription}. You showed up for yourself on ${checkInCount} days, with feelings leaning towards ${mostFrequentMeta.label.toLowerCase()}.`;
  if (bestDay && bestScore >= 3) {
    summaryText += ` Your brightest moment was around ${bestDayDisplay}.`;
  }
  if (mostCommonInfluence) {
    summaryText += ` ${mostCommonInfluence} was the most recurring part of your days.`;
  }

  const totalSeconds = weekBreathing.reduce((acc, s) => acc + s.seconds, 0);
  const minutesBreathed = Math.round(totalSeconds / 60);

  return {
    checkInCount,
    mostFrequentMood: mostFrequentMeta,
    bestDay: bestDay ? formatDateDisplay(bestDay, { short: true }) : null,
    mostCommonInfluence,
    gratitudeCount: weekGratitude.length,
    minutesBreathed,
    summaryText,
    hasEnoughData: true,
  };
}

/**
 * Checks if the three most recent check-ins are on consecutive dates and all are anxious or low.
 */
export function checkGentleNudgeCondition(checkins: CheckIn[]): {
  shouldNudge: boolean;
  nudgeKey: string;
} {
  if (checkins.length < 3) {
    return { shouldNudge: false, nudgeKey: '' };
  }

  // Sort newest first
  const sorted = [...checkins].sort((a, b) => b.date.localeCompare(a.date));
  const recent3 = sorted.slice(0, 3);

  // Check if all are anxious or low
  const allHeavy = recent3.every((c) => c.mood === 'anxious' || c.mood === 'low');
  if (!allHeavy) {
    return { shouldNudge: false, nudgeKey: '' };
  }

  // Check if dates are consecutive
  const d0 = parseLocalDate(recent3[0].date).getTime();
  const d1 = parseLocalDate(recent3[1].date).getTime();
  const d2 = parseLocalDate(recent3[2].date).getTime();

  const oneDayMs = 24 * 3600 * 1000;
  const isConsecutive01 = Math.abs(d0 - d1 - oneDayMs) < 60000; // allow small tolerance
  const isConsecutive12 = Math.abs(d1 - d2 - oneDayMs) < 60000;

  if (isConsecutive01 && isConsecutive12) {
    const nudgeKey = `${recent3[0].date}_${recent3[1].date}_${recent3[2].date}`;
    return { shouldNudge: true, nudgeKey };
  }

  return { shouldNudge: false, nudgeKey: '' };
}

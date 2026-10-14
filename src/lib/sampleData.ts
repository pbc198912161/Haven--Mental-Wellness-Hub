import { CheckIn, GratitudeEntry, BreathingSession, MoodId, Tag } from '@/types';
import { getLocalDateString } from './dates';
import { MOOD_MAP } from './moods';

export function generateSampleData(todayDate: Date = new Date()): {
  checkins: CheckIn[];
  gratitude: GratitudeEntry[];
  breathing: BreathingSession[];
} {
  const checkins: CheckIn[] = [];
  const gratitude: GratitudeEntry[] = [];
  const breathing: BreathingSession[] = [];

  const moodSequence: { mood: MoodId; tags: Tag[]; note: string }[] = [
    {
      mood: 'low',
      tags: ['Study', 'Sleep'],
      note: 'Felt overwhelmed by the upcoming midterms syllabus and did not sleep enough.',
    },
    {
      mood: 'anxious',
      tags: ['Study', 'Health'],
      note: 'Hands felt restless before the lab submission, but I got through it step by step.',
    },
    {
      mood: 'tired',
      tags: ['Sleep', 'Study'],
      note: 'Stayed up late revising algorithms. Body needs rest tonight.',
    },
    {
      mood: 'okay',
      tags: ['Friends'],
      note: 'Had a quick chai with Ananya outside the library. Helped clear my head.',
    },
    {
      mood: 'anxious',
      tags: ['Money', 'Study'],
      note: 'Budgeting for next semester textbooks is stressful, but I sorted the essential ones.',
    },
    {
      mood: 'tired',
      tags: ['Sleep'],
      note: 'Long transit home in the heat. Crawling into bed early.',
    },
    {
      mood: 'okay',
      tags: ['Study'],
      note: 'Completed two practice problem sets in discrete math.',
    },
    {
      mood: 'okay',
      tags: ['Family', 'Friends'],
      note: 'Called my mom for ten minutes and walked around the hostel courtyard.',
    },
    {
      mood: 'calm',
      tags: ['Health', 'Sleep'],
      note: 'Woke up without an alarm on Sunday. Did stretching by the open window.',
    },
    {
      mood: 'okay',
      tags: ['Study'],
      note: 'Group study session in the reading room went surprisingly well.',
    },
    {
      mood: 'calm',
      tags: ['Friends'],
      note: 'Roommate made mint tea while we were both preparing seminar slides.',
    },
    {
      mood: 'calm',
      tags: ['Sleep', 'Health'],
      note: 'Breathed for five minutes before sleeping. Slept seven unbroken hours.',
    },
    {
      mood: 'joyful',
      tags: ['Study', 'Friends'],
      note: 'Passed the seminar presentation with genuine praise from Professor Roy!',
    },
    {
      mood: 'calm',
      tags: ['Health'],
      note: 'Sitting under the banyan tree between classes feeling grounded and unhurried.',
    },
  ];

  // Generate 14 checkins ending today
  for (let i = 0; i < 14; i++) {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - (13 - i));
    const dateStr = getLocalDateString(d);
    const item = moodSequence[i];
    const moodMeta = MOOD_MAP[item.mood];

    checkins.push({
      date: dateStr,
      mood: item.mood,
      score: moodMeta.score,
      tags: item.tags,
      note: item.note,
      updatedAt: d.getTime() + 19 * 3600 * 1000,
      demo: true,
    });
  }

  // 5 realistic gratitude entries
  const gratitudeSamples = [
    { daysAgo: 12, text: "My roommate shared her notes before the test when I was running late." },
    { daysAgo: 9, text: "The librarian kept the quiet study cubicle open an extra fifteen minutes." },
    { daysAgo: 6, text: "A fresh warm samosa and quiet talk with Kabir by the canteen steps." },
    { daysAgo: 3, text: "My sister sent a silly video of our cat that made me laugh out loud during prep." },
    { daysAgo: 0, text: "The crisp cool breeze this morning walking to my first 9 AM lecture." },
  ];

  gratitudeSamples.forEach((sample, idx) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - sample.daysAgo);
    gratitude.push({
      id: `demo-gratitude-${idx + 1}`,
      text: sample.text,
      createdAt: d.getTime() + 20 * 3600 * 1000 + idx * 60000,
      demo: true,
    });
  });

  // 4 realistic breathing sessions
  const breathingSamples = [
    { daysAgo: 11, pattern: 'relax478' as const, seconds: 120 },
    { daysAgo: 7, pattern: 'box' as const, seconds: 60 },
    { daysAgo: 4, pattern: 'even' as const, seconds: 180 },
    { daysAgo: 1, pattern: 'box' as const, seconds: 120 },
  ];

  breathingSamples.forEach((sample, idx) => {
    const d = new Date(todayDate);
    d.setDate(d.getDate() - sample.daysAgo);
    breathing.push({
      id: `demo-breathing-${idx + 1}`,
      pattern: sample.pattern,
      seconds: sample.seconds,
      createdAt: d.getTime() + 21 * 3600 * 1000,
      demo: true,
    });
  });

  return { checkins, gratitude, breathing };
}

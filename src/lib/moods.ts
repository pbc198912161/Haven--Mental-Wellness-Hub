import { MoodId, MoodMeta, Tag, BreathingPatternConfig } from '@/types';

export const MOODS: MoodMeta[] = [
  {
    id: 'joyful',
    emoji: '😄',
    label: 'Joyful',
    score: 5,
    color: '#F2C66D',
    suggestedPattern: 'box',
    description: 'Bright energy and feeling good',
  },
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm',
    score: 4,
    color: '#7FCDBB',
    suggestedPattern: 'box',
    description: 'At ease and grounded',
  },
  {
    id: 'okay',
    emoji: '🙂',
    label: 'Okay',
    score: 3,
    color: '#8DB8E8',
    suggestedPattern: 'even',
    description: 'Holding steady through the day',
  },
  {
    id: 'tired',
    emoji: '😴',
    label: 'Tired',
    score: 2,
    color: '#B9A8E6',
    suggestedPattern: 'box',
    description: 'Running low on rest or energy',
  },
  {
    id: 'anxious',
    emoji: '😟',
    label: 'Anxious',
    score: 2,
    color: '#F0A58F',
    suggestedPattern: 'relax478',
    description: 'Uneasy, overthinking, or rushed',
  },
  {
    id: 'low',
    emoji: '😔',
    label: 'Low',
    score: 1,
    color: '#7C8DB5',
    suggestedPattern: 'even',
    description: 'Heavy, quiet, or discouraged',
  },
];

export const MOOD_MAP: Record<MoodId, MoodMeta> = MOODS.reduce(
  (acc, mood) => {
    acc[mood.id] = mood;
    return acc;
  },
  {} as Record<MoodId, MoodMeta>
);

export const INFLUENCE_TAGS: Tag[] = [
  'Study',
  'Sleep',
  'Friends',
  'Family',
  'Health',
  'Money',
  'Other',
];

export const BREATHING_PATTERNS: Record<'box' | 'relax478' | 'even', BreathingPatternConfig> = {
  box: {
    id: 'box',
    label: 'Steady',
    subtitle: 'Box (4-4-4-4)',
    description: 'Focus and steady nerves.',
    cycleDuration: 16,
    phases: [
      { name: 'Breathe in', duration: 4, scale: 1.4 },
      { name: 'Hold', duration: 4, scale: 1.4 },
      { name: 'Breathe out', duration: 4, scale: 1.0 },
      { name: 'Hold', duration: 4, scale: 1.0 },
    ],
  },
  relax478: {
    id: 'relax478',
    label: 'Wind down',
    subtitle: '4-7-8',
    description: 'Slow the evening down.',
    cycleDuration: 19,
    phases: [
      { name: 'Breathe in', duration: 4, scale: 1.45 },
      { name: 'Hold', duration: 7, scale: 1.45 },
      { name: 'Breathe out', duration: 8, scale: 1.0 },
    ],
  },
  even: {
    id: 'even',
    label: 'Reset',
    subtitle: 'Even (5-5)',
    description: 'A gentle everyday rhythm.',
    cycleDuration: 10,
    phases: [
      { name: 'Breathe in', duration: 5, scale: 1.35 },
      { name: 'Breathe out', duration: 5, scale: 1.0 },
    ],
  },
};

export function getSuggestedPattern(moodId: MoodId): BreathingPatternConfig {
  const meta = MOOD_MAP[moodId];
  return BREATHING_PATTERNS[meta?.suggestedPattern || 'even'];
}

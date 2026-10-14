export type MoodId = 'joyful' | 'calm' | 'okay' | 'tired' | 'anxious' | 'low';

export type Tag = 'Study' | 'Sleep' | 'Friends' | 'Family' | 'Health' | 'Money' | 'Other';

export interface CheckIn {
  date: string; // YYYY-MM-DD local date
  mood: MoodId;
  score: number;
  tags: Tag[];
  note: string;
  updatedAt: number;
  demo?: boolean;
}

export interface GratitudeEntry {
  id: string;
  text: string;
  createdAt: number;
  demo?: boolean;
}

export interface BreathingSession {
  id: string;
  pattern: 'box' | 'relax478' | 'even';
  seconds: number;
  createdAt: number;
  demo?: boolean;
}

export interface Prefs {
  theme: 'system' | 'light' | 'dark';
  reminderOn: boolean;
  reminderTime: string; // e.g. "20:00"
  blurJournal: boolean;
  soundVolume: number; // 0 to 1
}

export interface TrustedContact {
  name: string;
  phone: string;
}

export type BreathingPatternId = 'box' | 'relax478' | 'even';

export interface BreathingPhase {
  name: 'Breathe in' | 'Hold' | 'Breathe out';
  duration: number; // seconds
  scale: number;
}

export interface BreathingPatternConfig {
  id: BreathingPatternId;
  label: string;
  subtitle: string;
  description: string;
  cycleDuration: number;
  phases: BreathingPhase[];
}

export interface MoodMeta {
  id: MoodId;
  emoji: string;
  label: string;
  score: number;
  color: string;
  suggestedPattern: BreathingPatternId;
  description: string;
}

export interface WeeklyReflectionData {
  checkInCount: number;
  mostFrequentMood: MoodMeta | null;
  bestDay: string | null;
  mostCommonInfluence: Tag | null;
  gratitudeCount: number;
  minutesBreathed: number;
  summaryText: string;
  hasEnoughData: boolean;
}

import { useState, useEffect, useMemo, useCallback } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster, toast } from 'sonner';

// Layout
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';

// Sections
import { Hero } from '@/components/hero/Hero';
import { DailyAffirmation } from '@/components/affirmation/DailyAffirmation';
import { BreathingExercise } from '@/components/breathe/BreathingExercise';
import { GratitudeJournal } from '@/components/journal/GratitudeJournal';
import { Insights } from '@/components/insights/Insights';
import { SupportSection } from '@/components/support/SupportSection';
import { ResetFlow } from '@/components/reset/ResetFlow';

// Settings & Controls
import { SoundControl } from '@/components/settings/SoundControl';
import { ReminderControl } from '@/components/settings/ReminderControl';
import { ReminderBanner } from '@/components/settings/ReminderBanner';

// Hooks & Lib
import { useToday } from '@/hooks/useToday';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import {
  loadCheckIns,
  saveCheckIn,
  deleteCheckIn,
  loadGratitudeEntries,
  saveGratitudeEntry,
  deleteGratitudeEntry,
  loadBreathingSessions,
  saveBreathingSession,
  loadPrefs,
  savePrefs,
  loadTrustedContact,
  saveTrustedContact,
  hasActiveDemoData,
  clearDemoData,
  safeGetItem,
  safeSetItem,
  STORAGE_KEYS,
} from '@/lib/storage';
import { calculateWeeklyReflection, checkGentleNudgeCondition } from '@/lib/insights';
import { generateSampleData } from '@/lib/sampleData';
import { isPastTime } from '@/lib/dates';
import { CheckIn, GratitudeEntry, BreathingSession, TrustedContact, BreathingPatternId, Prefs } from '@/types';
import { MOOD_MAP } from '@/lib/moods';

export default function App() {
  const today = useToday();
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs());
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = loadPrefs();
    if (saved.theme === 'dark') return true;
    if (saved.theme === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main data state
  const [checkins, setCheckins] = useState<CheckIn[]>(() => loadCheckIns());
  const [gratitude, setGratitude] = useState<GratitudeEntry[]>(() => loadGratitudeEntries());
  const [breathing, setBreathing] = useState<BreathingSession[]>(() => loadBreathingSessions());
  const [trustedContact, setTrustedContact] = useState<TrustedContact | null>(() => loadTrustedContact());
  const [isSampleDataActive, setIsSampleDataActive] = useState<boolean>(() => hasActiveDemoData());

  // Interactive UI state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeBreathingPattern, setActiveBreathingPattern] = useState<BreathingPatternId>('box');
  const [nudgeDismissedKey, setNudgeDismissedKey] = useState<string>(() =>
    safeGetItem<string>(STORAGE_KEYS.nudgeDismissedFor, '')
  );
  const [reminderDismissedDate, setReminderDismissedDate] = useState<string>(() =>
    safeGetItem<string>(STORAGE_KEYS.reminderDismissedDate, '')
  );

  // Ambient sound hook
  const ambientSound = useAmbientSound();

  // Apply dark class to document root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      const themeValue = next ? 'dark' : 'light';
      savePrefs({ theme: themeValue });
      return next;
    });
  };

  // Find today's check-in
  const todayCheckIn = useMemo(() => {
    return checkins.find((c) => c.date === today.todayDate) ?? null;
  }, [checkins, today.todayDate]);

  // Current mood color for the Calm Orb
  const currentMoodColor = todayCheckIn ? MOOD_MAP[todayCheckIn.mood].color : '#7FCDBB';

  // Save check-in handler
  const handleSaveCheckIn = useCallback((newCheckIn: CheckIn) => {
    const { checkIns } = saveCheckIn(newCheckIn);
    setCheckins(checkIns);
    setIsSampleDataActive(hasActiveDemoData());
  }, []);

  // Delete check-in handler
  const handleDeleteCheckIn = useCallback((date: string) => {
    const updated = deleteCheckIn(date);
    setCheckins(updated);
    setIsSampleDataActive(hasActiveDemoData());
    toast.success('Check-in deleted');
  }, []);

  // Gratitude entry handlers
  const handleSaveGratitude = useCallback((entry: GratitudeEntry) => {
    const updated = saveGratitudeEntry(entry);
    setGratitude(updated);
    setIsSampleDataActive(hasActiveDemoData());
  }, []);

  const handleDeleteGratitude = useCallback((id: string) => {
    const updated = deleteGratitudeEntry(id);
    setGratitude(updated);
    setIsSampleDataActive(hasActiveDemoData());
    toast.success('Journal entry deleted');
  }, []);

  // Breathing session completion handler
  const handleCompleteBreathing = useCallback((session: BreathingSession) => {
    const updated = saveBreathingSession(session);
    setBreathing(updated);
    setIsSampleDataActive(hasActiveDemoData());
  }, []);

  // Trusted contact handler
  const handleSaveTrustedContact = useCallback((contact: TrustedContact | null) => {
    saveTrustedContact(contact);
    setTrustedContact(contact);
  }, []);

  // Sample data controls
  const handleLoadSampleData = useCallback(() => {
    const sample = generateSampleData(today.now);
    // Merge or replace checkins
    sample.checkins.forEach((c) => saveCheckIn(c));
    sample.gratitude.forEach((g) => saveGratitudeEntry(g));
    sample.breathing.forEach((b) => saveBreathingSession(b));

    setCheckins(loadCheckIns());
    setGratitude(loadGratitudeEntries());
    setBreathing(loadBreathingSessions());
    setIsSampleDataActive(true);
    toast.success('Loaded 14 days of realistic sample wellness data');
  }, [today.now]);

  const handleClearSampleData = useCallback(() => {
    clearDemoData();
    setCheckins(loadCheckIns());
    setGratitude(loadGratitudeEntries());
    setBreathing(loadBreathingSessions());
    setIsSampleDataActive(false);
    toast.success('Sample data removed');
  }, []);

  // Reset all data
  const handleDataReset = useCallback(() => {
    setCheckins([]);
    setGratitude([]);
    setBreathing([]);
    setTrustedContact(null);
    setIsSampleDataActive(false);
  }, []);

  // Weekly reflection calculation
  const weeklyReflection = useMemo(() => {
    return calculateWeeklyReflection(checkins, gratitude, breathing, today.now);
  }, [checkins, gratitude, breathing, today.now]);

  // Gentle nudge calculation
  const nudgeCheck = useMemo(() => {
    return checkGentleNudgeCondition(checkins);
  }, [checkins]);

  const showGentleNudge =
    nudgeCheck.shouldNudge && nudgeCheck.nudgeKey !== nudgeDismissedKey;

  const handleDismissGentleNudge = () => {
    safeSetItem(STORAGE_KEYS.nudgeDismissedFor, nudgeCheck.nudgeKey);
    setNudgeDismissedKey(nudgeCheck.nudgeKey);
  };

  // Reminder Banner calculation
  const shouldShowReminderBanner = useMemo(() => {
    if (!prefs.reminderOn) return false;
    if (todayCheckIn) return false;
    if (reminderDismissedDate === today.todayDate) return false;
    return isPastTime(prefs.reminderTime, today.now);
  }, [prefs.reminderOn, prefs.reminderTime, todayCheckIn, reminderDismissedDate, today.todayDate, today.now]);

  const handleDismissReminder = () => {
    safeSetItem(STORAGE_KEYS.reminderDismissedDate, today.todayDate);
    setReminderDismissedDate(today.todayDate);
  };

  // Start breathing from recommendation
  const handleStartBreathingWithPattern = (patternId: BreathingPatternId) => {
    setActiveBreathingPattern(patternId);
    const breatheEl = document.getElementById('breathe');
    if (breatheEl) {
      breatheEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGoToSupport = () => {
    const supportEl = document.getElementById('support');
    if (supportEl) {
      supportEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-mist dark:bg-deep-tide text-tide dark:text-gray-100 transition-colors flex flex-col font-sans">
        {/* Header */}
        <Header
          onStartReset={() => setIsResetOpen(true)}
          isDark={isDark}
          onToggleDark={toggleTheme}
          isAudioPlaying={ambientSound.isPlaying}
          onToggleAudio={ambientSound.toggle}
        />

        {/* In-app Reminder Banner (if evening reminder is due) */}
        {shouldShowReminderBanner && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 w-full">
            <ReminderBanner
              onDismiss={handleDismissReminder}
              onCheckInNow={() => {
                const el = document.getElementById('today');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Main Content */}
        <main id="main-content" className="flex-1 focus:outline-none">
          {/* Hero: Greeting, Calm Orb, and Daily Check-in */}
          <Hero
            greeting={today.greeting}
            todayCheckIn={todayCheckIn}
            onSaveCheckIn={handleSaveCheckIn}
            onStartBreathingWithPattern={handleStartBreathingWithPattern}
            onStartReset={() => setIsResetOpen(true)}
            todayDate={today.todayDate}
          />

          {/* Daily Affirmation */}
          <DailyAffirmation
            affirmation={today.affirmation}
            dayIndex={today.affirmationIndex}
          />

          {/* Guided Breathing with the Orb */}
          <BreathingExercise
            onSessionComplete={handleCompleteBreathing}
            activePatternId={activeBreathingPattern}
            moodColor={currentMoodColor}
          />

          {/* Gratitude Journal */}
          <GratitudeJournal
            entries={gratitude}
            onSaveEntry={handleSaveGratitude}
            onDeleteEntry={handleDeleteGratitude}
            blurJournal={prefs.blurJournal}
            onToggleBlur={() => {
              const next = !prefs.blurJournal;
              const updated = savePrefs({ blurJournal: next });
              setPrefs(updated);
            }}
          />

          {/* Insights & Patterns */}
          <Insights
            checkins={checkins}
            gratitude={gratitude}
            breathing={breathing}
            weeklyReflection={weeklyReflection}
            showGentleNudge={showGentleNudge}
            onDismissGentleNudge={handleDismissGentleNudge}
            onStartBreathing={() => handleStartBreathingWithPattern('even')}
            onGoToSupport={handleGoToSupport}
            onDeleteCheckIn={handleDeleteCheckIn}
            onLoadSampleData={handleLoadSampleData}
            onClearSampleData={handleClearSampleData}
            isSampleDataActive={isSampleDataActive}
            blurJournal={prefs.blurJournal}
            onToggleBlur={() => {
              const next = !prefs.blurJournal;
              const updated = savePrefs({ blurJournal: next });
              setPrefs(updated);
            }}
          />

          {/* Support Resources */}
          <SupportSection
            trustedContact={trustedContact}
            onSaveTrustedContact={handleSaveTrustedContact}
          />

          {/* Ambient Soundscape & Reminders Settings Section */}
          <section className="py-8 border-t border-border/40">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SoundControl
                  isSupported={ambientSound.isSupported}
                  isPlaying={ambientSound.isPlaying}
                  currentSound={ambientSound.currentSound}
                  volume={ambientSound.volume}
                  onToggle={ambientSound.toggle}
                  onChangeSound={ambientSound.changeSound}
                  onChangeVolume={ambientSound.changeVolume}
                />
                <ReminderControl
                  reminderOn={prefs.reminderOn}
                  reminderTime={prefs.reminderTime}
                  onToggleReminder={(val) => {
                    const updated = savePrefs({ reminderOn: val });
                    setPrefs(updated);
                  }}
                  onChangeTime={(val) => {
                    const updated = savePrefs({ reminderTime: val });
                    setPrefs(updated);
                  }}
                />
              </div>
            </div>
          </section>
        </main>

        {/* 60-second Reset Guided Flow Dialog */}
        <ResetFlow
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          todayDate={today.todayDate}
          affirmation={today.affirmation}
          todayCheckIn={todayCheckIn}
          onSaveCheckIn={handleSaveCheckIn}
          onSaveGratitude={handleSaveGratitude}
          onSaveBreathing={handleCompleteBreathing}
        />

        {/* Footer */}
        <Footer onDataReset={handleDataReset} />

        {/* Mobile floating bottom navigation */}
        <BottomNav />

        {/* Sonner Toaster */}
        <Toaster position="bottom-right" richColors />
      </div>
    </TooltipProvider>
  );
}

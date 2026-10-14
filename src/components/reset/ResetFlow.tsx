import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TransitionPanel } from '@/components/ui/transition-panel';
import { CalmOrb } from '../hero/CalmOrb';
import { MoodPicker } from '../checkin/MoodPicker';
import { InfluenceTags } from '../checkin/InfluenceTags';
import { CheckIn, MoodId, Tag, GratitudeEntry, BreathingSession } from '@/types';
import { MOOD_MAP, getSuggestedPattern } from '@/lib/moods';
import { TextMorph } from '@/components/ui/text-morph';
import { useBreathing } from '@/hooks/useBreathing';
import { Sparkles, CheckCircle2, ChevronRight, X, Heart, Wind, BookOpen, Quote } from 'lucide-react';
import { toast } from 'sonner';

interface ResetFlowProps {
  isOpen: boolean;
  onClose: () => void;
  todayDate: string;
  affirmation: string;
  todayCheckIn: CheckIn | null;
  onSaveCheckIn: (checkIn: CheckIn) => void;
  onSaveGratitude: (entry: GratitudeEntry) => void;
  onSaveBreathing: (session: BreathingSession) => void;
}

export const ResetFlow: React.FC<ResetFlowProps> = ({
  isOpen,
  onClose,
  todayDate,
  affirmation,
  todayCheckIn,
  onSaveCheckIn,
  onSaveGratitude,
  onSaveBreathing,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(todayCheckIn?.mood ?? 'calm');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(todayCheckIn?.tags ?? []);
  const [gratitudeLine, setGratitudeLine] = useState('');
  const [gratitudeError, setGratitudeError] = useState<string | null>(null);

  const moodMeta = selectedMood ? MOOD_MAP[selectedMood] : MOOD_MAP.calm;
  const suggestedPattern = selectedMood ? getSuggestedPattern(selectedMood) : null;

  // 1-minute breathing for the reset flow
  const {
    status: breatheStatus,
    currentPhase,
    phaseRemainingSeconds,
    progressPercent: breatheProgress,
    orbScale,
    start: startBreathe,
    pause: pauseBreathe,
    resume: resumeBreathe,
    reset: resetBreathe,
  } = useBreathing({
    initialPattern: suggestedPattern?.id ?? 'even',
    initialMinutes: 1,
    onComplete: (info) => {
      onSaveBreathing({
        id: `reset-breathe-${Date.now()}`,
        pattern: info.pattern,
        seconds: info.seconds,
        createdAt: Date.now(),
      });
      toast.success('1 minute of calm completed');
      setStepIndex(2); // advance to gratitude
    },
  });

  const handleToggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFinishStep0 = () => {
    if (!selectedMood) {
      toast.error('Pick how you are feeling to continue.');
      return;
    }
    // Save check-in
    const checkIn: CheckIn = {
      date: todayDate,
      mood: selectedMood,
      score: moodMeta.score,
      tags: selectedTags,
      note: todayCheckIn?.note || 'Completed via 60-second Reset',
      updatedAt: Date.now(),
    };
    onSaveCheckIn(checkIn);
    setStepIndex(1); // proceed to breathe
  };

  const handleFinishStep2 = () => {
    const trimmed = gratitudeLine.trim();
    if (trimmed.length < 3) {
      setGratitudeError('Please enter at least 3 characters.');
      return;
    }
    if (trimmed.length > 500) {
      setGratitudeError('Please keep within 500 characters.');
      return;
    }
    setGratitudeError(null);
    onSaveGratitude({
      id: `reset-gratitude-${Date.now()}`,
      text: trimmed,
      createdAt: Date.now(),
    });
    setStepIndex(3); // proceed to affirmation
  };

  const handleFinishStep3 = () => {
    setStepIndex(4); // celebration completion screen
  };

  const handleExit = () => {
    resetBreathe();
    setStepIndex(0);
    onClose();
  };

  const stepLabels = ['Check In', 'Breathe', 'Gratitude', 'Affirmation'];
  const overallProgress = (Math.min(stepIndex, 3) / 3) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleExit()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[32px] border-border bg-white dark:bg-card shadow-2xl">
        <DialogTitle className="sr-only">60-second Reset</DialogTitle>

        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between bg-mist/60 dark:bg-deep-tide/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-seafoam-dark dark:text-seafoam" />
              <span className="text-xs uppercase font-semibold tracking-wider text-tide-muted dark:text-gray-300">
                60-Second Reset
              </span>
            </div>
            <div className="flex items-center gap-2">
              {stepIndex < 4 && (
                <span className="text-xs font-medium text-tide-muted dark:text-gray-400">
                  Step {stepIndex + 1} of 4: {stepLabels[stepIndex]}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleExit}
            className="rounded-full w-8 h-8 text-tide-muted hover:text-tide"
            aria-label="Close 60-second reset"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Overall Progress Bar */}
        {stepIndex < 4 && (
          <Progress value={overallProgress} className="h-1 rounded-none bg-mist-alt" />
        )}

        {/* Steps Container */}
        <div className="p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
          <TransitionPanel
            activeIndex={stepIndex}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            variants={{
              enter: { opacity: 0, x: 20 },
              center: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -20 },
            }}
          >
            {/* Step 0: Check In */}
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-semibold text-tide dark:text-white">
                  How are you feeling right now?
                </h3>
                <p className="text-xs text-tide-muted dark:text-gray-300">
                  Select your mood to attune your reset rhythm.
                </p>
              </div>

              <MoodPicker
                selectedMood={selectedMood}
                onSelectMood={(m) => setSelectedMood(m)}
              />

              <InfluenceTags selectedTags={selectedTags} onToggleTag={handleToggleTag} />
            </div>

            {/* Step 1: Breathe (1 Minute) */}
            <div className="space-y-6 text-center">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-semibold text-tide dark:text-white">
                  One Minute of Calm
                </h3>
                <p className="text-xs text-tide-muted dark:text-gray-300">
                  Follow the orb. Inhale, hold, and gently release.
                </p>
              </div>

              <div className="relative py-4 flex flex-col items-center justify-center min-h-[220px]">
                <CalmOrb
                  moodColor={moodMeta.color}
                  scale={breatheStatus === 'running' ? orbScale : 1.0}
                  isBreathing={breatheStatus === 'running'}
                  size="md"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  {breatheStatus === 'running' || breatheStatus === 'paused' ? (
                    <div className="bg-white/90 dark:bg-deep-tide/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-sm border border-border/80">
                      <div className="text-sm font-serif font-semibold text-tide dark:text-white">
                        <TextMorph>{currentPhase.name}</TextMorph>
                      </div>
                      <div className="text-xl font-mono font-bold text-tide dark:text-white">
                        {phaseRemainingSeconds}s
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-white px-3 py-1 rounded-full bg-tide/50 backdrop-blur-sm">
                      Tap Start to breathe
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-w-xs mx-auto">
                <Progress value={breatheProgress} className="h-1.5 rounded-full" />
                <div className="flex justify-center gap-2">
                  {breatheStatus === 'idle' && (
                    <Button
                      size="sm"
                      onClick={startBreathe}
                      className="rounded-full bg-tide text-white px-5"
                    >
                      <Wind className="w-3.5 h-3.5 mr-1.5" />
                      Start 1-minute breath
                    </Button>
                  )}
                  {breatheStatus === 'running' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={pauseBreathe}
                      className="rounded-full"
                    >
                      Pause
                    </Button>
                  )}
                  {breatheStatus === 'paused' && (
                    <Button
                      size="sm"
                      onClick={resumeBreathe}
                      className="rounded-full bg-tide text-white"
                    >
                      Resume
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2: One line of Gratitude */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-semibold text-tide dark:text-white">
                  One Good Thing
                </h3>
                <p className="text-xs text-tide-muted dark:text-gray-300">
                  Write one line about something you're grateful for today.
                </p>
              </div>

              <textarea
                value={gratitudeLine}
                onChange={(e) => {
                  setGratitudeLine(e.target.value);
                  if (gratitudeError) setGratitudeError(null);
                }}
                placeholder="A small win, a warm drink, a kind friend..."
                rows={3}
                className="w-full p-4 rounded-2xl border border-border text-sm resize-none bg-mist/40 dark:bg-deep-tide/40 text-tide dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusk-lilac"
              />

              {gratitudeError && (
                <p className="text-xs text-rose-600 font-medium">{gratitudeError}</p>
              )}
            </div>

            {/* Step 3: Affirmation */}
            <div className="space-y-6 text-center">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold tracking-wider text-seafoam-dark dark:text-seafoam">
                  Your affirmation for today
                </span>
                <Quote className="w-8 h-8 text-sand-glow mx-auto opacity-70" />
              </div>

              <blockquote className="font-serif text-2xl sm:text-3xl text-tide dark:text-white italic leading-relaxed px-4">
                "{affirmation}"
              </blockquote>

              <p className="text-xs text-tide-muted dark:text-gray-400">
                Let this gentle thought carry you forward.
              </p>
            </div>

            {/* Step 4: Completion Screen */}
            <div className="space-y-6 text-center py-4 flex flex-col items-center">
              <div className="relative my-2">
                <CalmOrb moodColor={moodMeta.color} size="md" showRipples={true} />
              </div>

              <div className="space-y-2 max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-seafoam/25 text-seafoam-dark dark:text-seafoam">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Session Complete</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-tide dark:text-white">
                  You showed up today.
                </h3>
                <p className="text-xs sm:text-sm text-tide-muted dark:text-gray-300 leading-relaxed">
                  Taking just 60 seconds for yourself makes a genuine difference. Your check-in and moment of gratitude are securely saved.
                </p>
              </div>

              <Button
                onClick={handleExit}
                className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide px-8 h-11 font-semibold text-sm shadow-md"
              >
                Return to Haven
              </Button>
            </div>
          </TransitionPanel>

          {/* Navigation Controls between steps */}
          {stepIndex < 4 && (
            <div className="pt-6 border-t border-border/60 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="rounded-full text-xs text-tide-muted"
              >
                Exit reset
              </Button>

              <div className="flex items-center gap-2">
                {stepIndex === 0 && (
                  <Button
                    onClick={handleFinishStep0}
                    className="rounded-full bg-tide text-white px-5 h-9 text-xs font-semibold"
                  >
                    Next: Breathe
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
                {stepIndex === 1 && (
                  <Button
                    onClick={() => {
                      pauseBreathe();
                      setStepIndex(2);
                    }}
                    variant="outline"
                    className="rounded-full px-5 h-9 text-xs font-medium"
                  >
                    Skip breath
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
                {stepIndex === 2 && (
                  <Button
                    onClick={handleFinishStep2}
                    className="rounded-full bg-tide text-white px-5 h-9 text-xs font-semibold"
                  >
                    Next: Affirmation
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                )}
                {stepIndex === 3 && (
                  <Button
                    onClick={handleFinishStep3}
                    className="rounded-full bg-tide text-white px-6 h-9 text-xs font-semibold"
                  >
                    Finish reset
                    <Sparkles className="w-3.5 h-3.5 ml-1.5 text-sand-glow" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

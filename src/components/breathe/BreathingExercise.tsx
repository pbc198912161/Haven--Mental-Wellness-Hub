import React, { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CalmOrb } from '../hero/CalmOrb';
import { PatternPicker } from './PatternPicker';
import { useBreathing } from '@/hooks/useBreathing';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { BreathingPatternId, BreathingSession } from '@/types';
import { TextMorph } from '@/components/ui/text-morph';

interface BreathingExerciseProps {
  onSessionComplete?: (session: BreathingSession) => void;
  activePatternId?: BreathingPatternId;
  moodColor?: string;
}

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  onSessionComplete,
  activePatternId,
  moodColor = '#7FCDBB',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const handleComplete = (sessionInfo: { pattern: BreathingPatternId; seconds: number; minutes: number }) => {
    if (onSessionComplete) {
      onSessionComplete({
        id: `breathe-${Date.now()}`,
        pattern: sessionInfo.pattern,
        seconds: sessionInfo.seconds,
        createdAt: Date.now(),
      });
    }
  };

  const {
    status,
    patternId,
    setPatternId,
    minutes,
    setMinutes,
    currentPhase,
    phaseRemainingSeconds,
    progressPercent,
    orbScale,
    start,
    pause,
    resume,
    reset,
  } = useBreathing({
    initialPattern: activePatternId || 'box',
    initialMinutes: 1,
    onComplete: handleComplete,
  });

  // Pause cleanly when leaving section or tab is hidden
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && status === 'running') {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [status, pause]);

  // Sync if external activePatternId changes
  useEffect(() => {
    if (activePatternId && activePatternId !== patternId) {
      setPatternId(activePatternId);
    }
  }, [activePatternId, patternId, setPatternId]);

  return (
    <section id="breathe" ref={sectionRef} className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-[28px] p-6 sm:p-10 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-8">
          {/* Header */}
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase font-semibold tracking-wider text-seafoam-dark dark:text-seafoam">
              Guided Breathing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-tide dark:text-white">
              Breathe with the Orb
            </h2>
            <p className="text-sm text-tide-muted dark:text-gray-300 max-w-xl">
              Match your rhythm with the breathing orb. Choose a pattern that fits how you feel right now.
            </p>
          </div>

          {/* Pattern and duration selection */}
          <PatternPicker
            currentPattern={patternId}
            onSelectPattern={setPatternId}
            minutes={minutes}
            onSelectMinutes={setMinutes}
            disabled={status === 'running'}
          />

          {/* Center Orb and Phase Display */}
          <div className="relative py-8 flex flex-col items-center justify-center min-h-[320px]">
            {/* Screen reader polite announcement */}
            <div aria-live="polite" className="sr-only">
              {status === 'running'
                ? `${currentPhase.name}, ${phaseRemainingSeconds} seconds remaining.`
                : ''}
            </div>

            {/* Static ring for reduced motion or active orb */}
            {prefersReducedMotion ? (
              <div
                className="w-48 h-48 rounded-full border-4 border-dashed flex flex-col items-center justify-center p-4 text-center"
                style={{ borderColor: moodColor }}
              >
                <span className="text-lg font-serif font-semibold text-tide dark:text-white">
                  {status === 'running' ? currentPhase.name : 'Ready'}
                </span>
                {status === 'running' && (
                  <span className="text-2xl font-mono font-bold mt-1 text-tide dark:text-white">
                    {phaseRemainingSeconds}s
                  </span>
                )}
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <CalmOrb
                  moodColor={moodColor}
                  scale={status === 'running' ? orbScale : 1.0}
                  isBreathing={status === 'running'}
                  size="lg"
                />

                {/* Overlay text inside / directly below orb */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  {status === 'running' || status === 'paused' ? (
                    <div className="bg-white/85 dark:bg-deep-tide/85 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-border/60">
                      <div className="text-base sm:text-lg font-serif font-semibold text-tide dark:text-white">
                        <TextMorph>{currentPhase.name}</TextMorph>
                      </div>
                      <div className="text-2xl font-mono font-bold text-tide dark:text-white mt-0.5">
                        {phaseRemainingSeconds}s
                      </div>
                    </div>
                  ) : status === 'completed' ? (
                    <div className="bg-white/90 dark:bg-card/90 backdrop-blur-md p-4 rounded-2xl shadow-md border border-seafoam text-center">
                      <CheckCircle2 className="w-8 h-8 text-seafoam-dark dark:text-seafoam mx-auto mb-1" />
                      <p className="font-serif text-lg font-semibold text-tide dark:text-white">
                        Well done.
                      </p>
                      <p className="text-xs text-tide-muted dark:text-gray-300">
                        That was {minutes} {minutes === 1 ? 'minute' : 'minutes'} of calm.
                      </p>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-white/90 drop-shadow-sm px-3 py-1 rounded-full bg-tide/40 backdrop-blur-sm">
                      Tap Start when ready
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Session Progress bar */}
          {(status === 'running' || status === 'paused' || status === 'completed') && (
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between text-xs text-tide-muted dark:text-gray-400">
                <span>Session progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 rounded-full" />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            {status === 'idle' && (
              <Button
                onClick={start}
                className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide px-8 h-11 text-sm font-semibold shadow-sm transition-all"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start breathing
              </Button>
            )}

            {status === 'running' && (
              <Button
                onClick={pause}
                variant="outline"
                className="rounded-full px-6 h-11 text-sm font-medium border-border hover:bg-mist-alt"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}

            {status === 'paused' && (
              <>
                <Button
                  onClick={resume}
                  className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide px-6 h-11 text-sm font-semibold"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Resume
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="rounded-full px-5 h-11 text-sm font-medium border-border"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </>
            )}

            {status === 'completed' && (
              <Button
                onClick={reset}
                className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide px-6 h-11 text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Breathe again
              </Button>
            )}
          </div>

          {/* Safety copy */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-mist-alt/60 dark:bg-deep-tide/60 border border-border/60 text-xs text-tide-muted dark:text-gray-300">
            <ShieldAlert className="w-4 h-4 text-tide-muted dark:text-gray-400 shrink-0 mt-0.5" />
            <p>
              If holding your breath feels uncomfortable, shorten the holds or choose Reset. Stop if you feel dizzy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

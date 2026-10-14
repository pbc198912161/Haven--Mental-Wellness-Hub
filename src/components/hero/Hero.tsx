import React from 'react';
import { CalmOrb } from './CalmOrb';
import { MoodCheckIn } from '../checkin/MoodCheckIn';
import { CheckIn } from '@/types';
import { MOOD_MAP } from '@/lib/moods';
import { Disclaimer } from '../layout/Disclaimer';
import { BlurFade } from '@/components/ui/blur-fade';

interface HeroProps {
  greeting: string;
  todayCheckIn: CheckIn | null;
  onSaveCheckIn: (checkIn: CheckIn) => void;
  onStartBreathingWithPattern: (patternId: 'box' | 'relax478' | 'even') => void;
  onStartReset: () => void;
  todayDate: string;
}

export const Hero: React.FC<HeroProps> = ({
  greeting,
  todayCheckIn,
  onSaveCheckIn,
  onStartBreathingWithPattern,
  onStartReset,
  todayDate,
}) => {
  const currentMoodMeta = todayCheckIn ? MOOD_MAP[todayCheckIn.mood] : null;
  const moodColor = currentMoodMeta?.color ?? '#7FCDBB';

  return (
    <section id="today" className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Subtle top disclaimer */}
        <div className="mb-6 flex justify-center sm:justify-start">
          <Disclaimer variant="subtle" />
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Greeting, intro, and CheckIn panel */}
          <div className="lg:col-span-7 space-y-6">
            <BlurFade delay={0.1} duration={0.8}>
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-medium tracking-wide text-seafoam-dark dark:text-seafoam uppercase">
                  Daily Check-in
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-tide dark:text-white leading-tight">
                  {greeting}.
                </h1>
                <p className="text-base sm:text-lg text-tide-muted dark:text-gray-300 leading-relaxed max-w-xl">
                  Take a breath. No streaks, no guilt—just a quiet moment to notice how you are today.
                </p>
              </div>
            </BlurFade>

            {/* Mobile Orb Display: above the form on small screens */}
            <div className="lg:hidden flex flex-col items-center justify-center py-4">
              <CalmOrb moodColor={moodColor} size="md" />
              {currentMoodMeta && (
                <span className="text-xs text-tide-muted dark:text-gray-400 mt-2">
                  Orb attuned to: <strong className="text-tide dark:text-gray-200">{currentMoodMeta.label}</strong>
                </span>
              )}
            </div>

            <BlurFade delay={0.25} duration={0.8}>
              <MoodCheckIn
                todayCheckIn={todayCheckIn}
                onSaveCheckIn={onSaveCheckIn}
                onStartBreathingWithPattern={onStartBreathingWithPattern}
                onStartReset={onStartReset}
                todayDate={todayDate}
              />
            </BlurFade>
          </div>

          {/* Right Column: Signature Calm Orb on Desktop */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative">
            <BlurFade delay={0.3} duration={1.0}>
              <div className="relative p-6 flex flex-col items-center">
                <CalmOrb moodColor={moodColor} size="xl" />
                <div className="text-center mt-6 space-y-1">
                  <p className="font-serif text-lg text-tide dark:text-gray-200">The Calm Orb</p>
                  <p className="text-xs text-tide-muted dark:text-gray-400 max-w-xs">
                    {currentMoodMeta
                      ? `Reflecting your ${currentMoodMeta.label.toLowerCase()} energy today.`
                      : 'Wakes softly and attunes to your check-in color.'}
                  </p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
};

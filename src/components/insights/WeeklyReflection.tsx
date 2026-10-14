import React from 'react';
import { WeeklyReflectionData } from '@/types';
import { NumberTicker } from '@/components/ui/number-ticker';
import { Sparkles, Wind, BookOpen, Smile, Calendar, HeartHandshake } from 'lucide-react';

interface WeeklyReflectionProps {
  reflection: WeeklyReflectionData;
}

export const WeeklyReflection: React.FC<WeeklyReflectionProps> = ({ reflection }) => {
  if (!reflection.hasEnoughData) {
    return (
      <div className="rounded-2xl p-6 bg-mist-alt/60 dark:bg-card/50 border border-dashed border-border text-center space-y-2">
        <Sparkles className="w-6 h-6 text-seafoam-dark dark:text-seafoam mx-auto" />
        <p className="font-serif text-lg font-semibold text-tide dark:text-white">
          Weekly reflection will appear soon
        </p>
        <p className="text-xs text-tide-muted dark:text-gray-300 max-w-sm mx-auto">
          Complete at least 2 check-ins this week to unlock kind patterns and gentle insights into your days.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Written Kind Summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-seafoam/15 via-mist/50 to-sand-glow/15 dark:from-seafoam/10 dark:via-deep-tide dark:to-sand-glow/10 border border-seafoam/30">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-wider text-seafoam-dark dark:text-seafoam">
          <Sparkles className="w-3.5 h-3.5" />
          <span>7-Day Reflection</span>
        </div>
        <p className="font-serif text-base sm:text-lg text-tide dark:text-white leading-relaxed">
          {reflection.summaryText}
        </p>
      </div>

      {/* Bento grid statistics with Number Tickers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Check-ins */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-card/70 border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-tide-muted dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Check-ins</span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-tide dark:text-white">
            <NumberTicker value={reflection.checkInCount} />
            <span className="text-xs font-normal text-tide-muted ml-1">/ 7 days</span>
          </div>
        </div>

        {/* Most frequent mood */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-card/70 border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-tide-muted dark:text-gray-400">
            <Smile className="w-3.5 h-3.5" />
            <span>Common Mood</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{reflection.mostFrequentMood?.emoji}</span>
            <span className="font-serif font-semibold text-lg text-tide dark:text-white">
              {reflection.mostFrequentMood?.label}
            </span>
          </div>
        </div>

        {/* Gratitude count */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-card/70 border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-tide-muted dark:text-gray-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gratitude notes</span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-tide dark:text-white">
            <NumberTicker value={reflection.gratitudeCount} />
          </div>
        </div>

        {/* Minutes breathed */}
        <div className="p-4 rounded-2xl bg-white/70 dark:bg-card/70 border border-border/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-tide-muted dark:text-gray-400">
            <Wind className="w-3.5 h-3.5" />
            <span>Minutes calm</span>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-tide dark:text-white">
            <NumberTicker value={reflection.minutesBreathed} />
            <span className="text-xs font-normal text-tide-muted ml-1">mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};

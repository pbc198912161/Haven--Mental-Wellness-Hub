import React from 'react';
import { CheckIn } from '@/types';
import { MOOD_MAP } from '@/lib/moods';
import { getPastDates, formatDateDisplay } from '@/lib/dates';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MoodRibbonProps {
  checkins: CheckIn[];
}

export const MoodRibbon: React.FC<MoodRibbonProps> = ({ checkins }) => {
  const dates = getPastDates(30);
  const checkinByDate = new Map<string, CheckIn>();
  checkins.forEach((c) => checkinByDate.set(c.date, c));

  return (
    <TooltipProvider delay={150}>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-tide-muted dark:text-gray-400">
          <span className="font-semibold uppercase tracking-wider">30-Day Mood Ribbon</span>
          <span>Older → Today</span>
        </div>

        {/* 30 days ribbon dots */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-1.5 p-3 rounded-2xl bg-white/70 dark:bg-card/70 border border-border/80">
          {dates.map((dateStr) => {
            const entry = checkinByDate.get(dateStr);
            const mood = entry ? MOOD_MAP[entry.mood] : null;

            return (
              <Tooltip key={dateStr}>
                <TooltipTrigger
                  aria-label={`${formatDateDisplay(dateStr, { short: true })}: ${
                    mood ? mood.label : 'No check-in'
                  }`}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-dusk-lilac ${
                    mood ? 'shadow-xs' : 'border border-dashed border-border dark:border-gray-600 bg-transparent'
                  }`}
                  style={{
                    backgroundColor: mood ? mood.color : undefined,
                  }}
                />
                <TooltipContent side="top" className="text-xs p-2 rounded-xl">
                  <p className="font-semibold">{formatDateDisplay(dateStr, { short: true })}</p>
                  {mood ? (
                    <p className="flex items-center gap-1 mt-0.5">
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </p>
                  ) : (
                    <p className="text-tide-muted/80 text-[11px]">No check-in</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

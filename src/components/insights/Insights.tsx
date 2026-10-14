import React, { useState } from 'react';
import { CheckIn, GratitudeEntry, BreathingSession, WeeklyReflectionData } from '@/types';
import { MoodChart } from './MoodChart';
import { MoodRibbon } from './MoodRibbon';
import { WeeklyReflection } from './WeeklyReflection';
import { GentleNudge } from './GentleNudge';
import { MOOD_MAP } from '@/lib/moods';
import { formatDateDisplay, getDaysShownUpCount } from '@/lib/dates';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Trash2, Eye, EyeOff, Info, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface InsightsProps {
  checkins: CheckIn[];
  gratitude: GratitudeEntry[];
  breathing: BreathingSession[];
  weeklyReflection: WeeklyReflectionData;
  showGentleNudge: boolean;
  onDismissGentleNudge: () => void;
  onStartBreathing: () => void;
  onGoToSupport: () => void;
  onDeleteCheckIn: (date: string) => void;
  onLoadSampleData: () => void;
  onClearSampleData: () => void;
  isSampleDataActive: boolean;
  blurJournal: boolean;
  onToggleBlur: () => void;
}

export const Insights: React.FC<InsightsProps> = ({
  checkins,
  gratitude,
  breathing,
  weeklyReflection,
  showGentleNudge,
  onDismissGentleNudge,
  onStartBreathing,
  onGoToSupport,
  onDeleteCheckIn,
  onLoadSampleData,
  onClearSampleData,
  isSampleDataActive,
  blurJournal,
  onToggleBlur,
}) => {
  const [checkInToDelete, setCheckInToDelete] = useState<string | null>(null);

  // Calculate "Days you showed up" this month
  const now = new Date();
  const allRecordedDates = [
    ...checkins.map((c) => c.date),
    ...gratitude.map((g) => new Date(g.createdAt).toISOString().slice(0, 10)),
    ...breathing.map((b) => new Date(b.createdAt).toISOString().slice(0, 10)),
  ];
  const daysShowedUp = getDaysShownUpCount(allRecordedDates, {
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const monthName = now.toLocaleString(undefined, { month: 'long' });

  return (
    <section id="insights" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Sample data active banner */}
        {isSampleDataActive && (
          <div className="p-3.5 px-4 rounded-2xl bg-sand-glow/20 dark:bg-sand-glow/15 border border-sand-glow/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-tide dark:text-gray-200">
              <Info className="w-4 h-4 text-tide dark:text-sand-glow shrink-0" />
              <span>You're viewing sample data. Clear it to start fresh with your own story.</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onClearSampleData}
              className="rounded-full text-xs h-7 px-3 border-tide/30 text-tide dark:text-white"
            >
              Clear sample data
            </Button>
          </div>
        )}

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase font-semibold tracking-wider text-seafoam-dark dark:text-seafoam">
              Insights & Patterns
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-tide dark:text-white">
              Understanding Your Rhythm
            </h2>
            <p className="text-sm text-tide-muted dark:text-gray-300 max-w-xl">
              Gentle reflections without judgment or pressure. Showing up is enough.
            </p>
          </div>

          {/* Days you showed up badge (No streaks!) */}
          <div className="p-3.5 px-5 rounded-2xl bg-white/80 dark:bg-card/80 border border-border shadow-xs flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-xl bg-seafoam/25 dark:bg-seafoam/15 text-seafoam-dark dark:text-seafoam">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-tide-muted dark:text-gray-400 font-medium">
                Days you showed up in {monthName}
              </p>
              <p className="font-serif text-xl font-bold text-tide dark:text-white">
                {daysShowedUp} {daysShowedUp === 1 ? 'day' : 'days'}
              </p>
            </div>
          </div>
        </div>

        {/* Gentle nudge card if condition triggered */}
        {showGentleNudge && (
          <GentleNudge
            onStartBreathing={onStartBreathing}
            onGoToSupport={onGoToSupport}
            onDismiss={onDismissGentleNudge}
          />
        )}

        {/* Empty state when no check-ins exist */}
        {checkins.length === 0 ? (
          <div className="rounded-[28px] p-8 sm:p-12 text-center border border-dashed border-border/80 bg-white/40 dark:bg-card/40 flex flex-col items-center justify-center space-y-4">
            <Calendar className="w-10 h-10 text-tide-muted/60 dark:text-gray-400" />
            <div className="space-y-1 max-w-sm">
              <h3 className="font-serif text-xl font-semibold text-tide dark:text-white">
                Your first check-in will appear here
              </h3>
              <p className="text-xs text-tide-muted dark:text-gray-400">
                Log today's mood above or preview the hub with sample data to see the charts and reflection in action.
              </p>
            </div>
            <Button
              onClick={onLoadSampleData}
              className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide text-xs font-semibold px-5 h-10"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sand-glow" />
              Preview with sample data
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Weekly reflection bento summary */}
            <div className="rounded-[28px] p-6 sm:p-8 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm">
              <WeeklyReflection reflection={weeklyReflection} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Chart panel */}
              <div className="lg:col-span-7 rounded-[28px] p-6 sm:p-7 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-6">
                <MoodChart checkins={checkins} />
                <MoodRibbon checkins={checkins} />
              </div>

              {/* History List panel */}
              <div className="lg:col-span-5 rounded-[28px] p-6 sm:p-7 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-400">
                    Check-in History ({checkins.length})
                  </span>
                  <button
                    type="button"
                    onClick={onToggleBlur}
                    className="inline-flex items-center gap-1 text-xs text-tide-muted hover:text-tide dark:text-gray-400 transition-colors"
                  >
                    {blurJournal ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{blurJournal ? 'Unblur' : 'Blur notes'}</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                  {checkins.map((item) => {
                    const mood = MOOD_MAP[item.mood];
                    return (
                      <div
                        key={item.date}
                        className="p-3.5 rounded-2xl bg-mist/60 dark:bg-deep-tide/50 border border-border/70 flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ backgroundColor: `${mood.color}30` }}
                          >
                            {mood.emoji}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-xs text-tide dark:text-white">
                                {formatDateDisplay(item.date)}
                              </span>
                              <span
                                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: `${mood.color}25`,
                                  color: '#14323F',
                                }}
                              >
                                {mood.label}
                              </span>
                            </div>

                            {item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] px-1.5 py-0.5 rounded-full bg-white dark:bg-card text-tide-muted border border-border/50"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {item.note && (
                              <p
                                className={`text-xs text-tide-muted dark:text-gray-300 italic pt-0.5 break-words ${
                                  blurJournal ? 'filter blur-sm select-none' : ''
                                }`}
                              >
                                "{item.note}"
                              </p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCheckInToDelete(item.date)}
                          className="w-7 h-7 rounded-full text-tide-muted hover:text-rose-600 opacity-70 group-hover:opacity-100 transition-opacity"
                          title="Delete check-in"
                          aria-label={`Delete check-in for ${item.date}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Check-in Alert Dialog */}
        <AlertDialog
          open={checkInToDelete !== null}
          onOpenChange={(open) => !open && setCheckInToDelete(null)}
        >
          <AlertDialogContent className="rounded-[28px] max-w-md bg-white dark:bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-xl">Delete check-in?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-tide-muted dark:text-gray-300">
                Are you sure you want to remove this day's check-in entry?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (checkInToDelete) {
                    onDeleteCheckIn(checkInToDelete);
                    setCheckInToDelete(null);
                  }
                }}
                className="rounded-full bg-rose-600 text-white hover:bg-rose-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </section>
  );
};

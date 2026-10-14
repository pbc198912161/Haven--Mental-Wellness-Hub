import React from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReminderBannerProps {
  onDismiss: () => void;
  onCheckInNow: () => void;
}

export const ReminderBanner: React.FC<ReminderBannerProps> = ({ onDismiss, onCheckInNow }) => {
  return (
    <div
      role="region"
      aria-label="Daily check-in reminder"
      className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-seafoam/25 via-sand-glow/20 to-dusk-lilac/25 dark:from-seafoam/15 dark:via-deep-tide dark:to-dusk-lilac/15 border border-seafoam/40 flex items-center justify-between gap-3 shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-full bg-white dark:bg-card text-seafoam-dark dark:text-seafoam shrink-0">
          <Bell className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-medium text-tide dark:text-gray-100">
          A quiet moment for you? Check in whenever you're ready.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          onClick={onCheckInNow}
          className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide text-xs h-7 px-3 font-semibold"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Check in
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-tide-muted hover:text-tide dark:hover:text-white transition-colors"
          aria-label="Dismiss reminder for today"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

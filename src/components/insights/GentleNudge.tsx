import React from 'react';
import { HeartHandshake, Wind, PhoneCall, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GentleNudgeProps {
  onStartBreathing: () => void;
  onGoToSupport: () => void;
  onDismiss: () => void;
}

export const GentleNudge: React.FC<GentleNudgeProps> = ({
  onStartBreathing,
  onGoToSupport,
  onDismiss,
}) => {
  return (
    <div
      role="region"
      aria-label="Support suggestion"
      className="p-5 sm:p-6 rounded-[28px] bg-gradient-to-r from-sand-glow/20 via-rose-50/50 to-dusk-lilac/20 dark:from-sand-glow/10 dark:via-deep-tide dark:to-dusk-lilac/10 border border-sand-glow/40 shadow-sm relative space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-full bg-sand-glow/30 dark:bg-sand-glow/20 text-tide dark:text-sand-glow">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-tide dark:text-white">
              Rough few days?
            </h3>
            <p className="text-xs sm:text-sm text-tide-muted dark:text-gray-300">
              You don't have to carry it alone.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-full text-tide-muted hover:text-tide dark:hover:text-white transition-colors"
          aria-label="Dismiss gentle nudge"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-tide-muted dark:text-gray-300 leading-relaxed">
        We noticed low or anxious moments over your last few check-ins. If things feel heavy, taking a slow breath or talking to someone you trust can help ease the weight.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button
          onClick={onStartBreathing}
          size="sm"
          className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide text-xs font-semibold px-4 h-9"
        >
          <Wind className="w-3.5 h-3.5 mr-1.5" />
          Try a breathing exercise
        </Button>
        <Button
          onClick={onGoToSupport}
          variant="outline"
          size="sm"
          className="rounded-full border-tide/30 text-tide dark:text-white hover:bg-white/60 dark:hover:bg-card/60 text-xs font-medium px-4 h-9"
        >
          <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
          See support options
        </Button>
      </div>
    </div>
  );
};

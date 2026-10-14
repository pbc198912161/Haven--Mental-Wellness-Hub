import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';

interface DailyAffirmationProps {
  affirmation: string;
  dayIndex: number;
}

export const DailyAffirmation: React.FC<DailyAffirmationProps> = ({ affirmation, dayIndex }) => {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`"${affirmation}" — via Haven`);
      setCopied(true);
      toast.success('Copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy to clipboard.');
    }
  };

  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-[28px] p-6 sm:p-10 bg-gradient-to-br from-white/90 via-mist/50 to-white/70 dark:from-card/90 dark:via-deep-tide/80 dark:to-card/70 backdrop-blur-md border border-border/80 shadow-sm relative overflow-hidden">
          {/* Subtle warm decorative glow */}
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-sand-glow/15 dark:bg-sand-glow/10 blur-2xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-300">
              <Sparkles className="w-4 h-4 text-sand-glow" aria-hidden="true" />
              <span>Today's Affirmation · Day {dayIndex + 1} of 31</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="rounded-full h-8 px-3 text-xs border-border bg-white/60 dark:bg-card/60 hover:bg-white dark:hover:bg-card text-tide dark:text-gray-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-seafoam-dark dark:text-seafoam" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <div className="py-2">
            {prefersReducedMotion ? (
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-tide dark:text-white leading-relaxed italic">
                "{affirmation}"
              </p>
            ) : (
              <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-tide dark:text-white leading-relaxed italic">
                <TextGenerateEffect
                  words={`"${affirmation}"`}
                  className="font-normal font-serif text-tide dark:text-white"
                  duration={0.6}
                />
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-tide-muted/80 dark:text-gray-400">
            A fresh thought for today. Refreshes gently at midnight.
          </p>
        </div>
      </div>
    </section>
  );
};

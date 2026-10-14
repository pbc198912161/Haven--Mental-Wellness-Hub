import React from 'react';
import { BreathingPatternId } from '@/types';
import { BREATHING_PATTERNS } from '@/lib/moods';

interface PatternPickerProps {
  currentPattern: BreathingPatternId;
  onSelectPattern: (pattern: BreathingPatternId) => void;
  minutes: number;
  onSelectMinutes: (minutes: number) => void;
  disabled?: boolean;
}

export const PatternPicker: React.FC<PatternPickerProps> = ({
  currentPattern,
  onSelectPattern,
  minutes,
  onSelectMinutes,
  disabled = false,
}) => {
  const patterns: BreathingPatternId[] = ['box', 'relax478', 'even'];

  return (
    <div className="space-y-4">
      {/* Pattern Segmented Control */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-300">
          Breathing Pattern
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup">
          {patterns.map((pId) => {
            const config = BREATHING_PATTERNS[pId];
            const isSelected = currentPattern === pId;
            return (
              <button
                key={pId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={() => onSelectPattern(pId)}
                className={`p-3 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? 'bg-white dark:bg-card border-tide dark:border-seafoam shadow-sm ring-1 ring-tide/20 dark:ring-seafoam/20'
                    : 'bg-white/50 dark:bg-card/40 border-border/80 hover:bg-white dark:hover:bg-card text-tide-muted dark:text-gray-300'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-tide dark:text-white">
                    {config.label}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-mist dark:bg-deep-tide text-tide-muted dark:text-gray-300">
                    {config.subtitle}
                  </span>
                </div>
                <p className="text-xs text-tide-muted dark:text-gray-400 mt-1 leading-snug">
                  {config.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Length Control (1, 2, 3 minutes) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-300">
          Duration
        </span>
        <div className="flex gap-1.5 p-1 rounded-full bg-mist-alt/80 dark:bg-deep-tide/80 border border-border">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMinutes(m)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                minutes === m
                  ? 'bg-tide text-white dark:bg-white dark:text-tide shadow-sm'
                  : 'text-tide-muted dark:text-gray-300 hover:text-tide'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

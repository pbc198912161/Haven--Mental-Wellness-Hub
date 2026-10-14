import React from 'react';
import { MoodId } from '@/types';
import { MOODS } from '@/lib/moods';

interface MoodPickerProps {
  selectedMood: MoodId | null;
  onSelectMood: (mood: MoodId) => void;
  hasError?: boolean;
}

export const MoodPicker: React.FC<MoodPickerProps> = ({
  selectedMood,
  onSelectMood,
  hasError = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % MOODS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + MOODS.length) % MOODS.length;
    } else {
      return;
    }
    e.preventDefault();
    onSelectMood(MOODS[nextIndex].id);
  };

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label="How are you feeling today?"
        aria-required="true"
        className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5"
      >
        {MOODS.map((mood, idx) => {
          const isSelected = selectedMood === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (!selectedMood && idx === 0) ? 0 : -1}
              onClick={() => onSelectMood(mood.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`group flex flex-col items-center justify-center p-2.5 min-h-[64px] min-w-[56px] rounded-2xl transition-all border text-center ${
                isSelected
                  ? 'border-tide dark:border-white shadow-md bg-white dark:bg-card scale-[1.03] ring-2'
                  : 'border-border/80 bg-white/60 dark:bg-card/50 hover:bg-white dark:hover:bg-card hover:border-border text-tide-muted dark:text-gray-300'
              }`}
              style={{
                borderColor: isSelected ? mood.color : undefined,
                boxShadow: isSelected ? `0 6px 18px -4px ${mood.color}40` : undefined,
              }}
            >
              <span className="text-2xl sm:text-3xl filter transition-transform group-hover:scale-110">
                {mood.emoji}
              </span>
              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  isSelected ? 'text-tide dark:text-white font-semibold' : 'text-tide-muted dark:text-gray-300'
                }`}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
      {hasError && (
        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium" role="alert">
          Pick how you're feeling to save.
        </p>
      )}
    </div>
  );
};

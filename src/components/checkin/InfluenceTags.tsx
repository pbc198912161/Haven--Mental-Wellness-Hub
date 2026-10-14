import React from 'react';
import { Tag } from '@/types';
import { INFLUENCE_TAGS } from '@/lib/moods';

interface InfluenceTagsProps {
  selectedTags: Tag[];
  onToggleTag: (tag: Tag) => void;
  className?: string;
}

export const InfluenceTags: React.FC<InfluenceTagsProps> = ({
  selectedTags,
  onToggleTag,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-medium text-tide-muted dark:text-gray-300">
        What's influencing your day? <span className="text-tide-muted/70">(optional)</span>
      </label>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Influence tags">
        {INFLUENCE_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              aria-pressed={isSelected}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-tide text-white dark:bg-white dark:text-tide shadow-sm ring-1 ring-tide dark:ring-white'
                  : 'bg-white/80 dark:bg-card/80 text-tide-muted dark:text-gray-300 hover:text-tide dark:hover:text-white hover:bg-white dark:hover:bg-card border border-border/80'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

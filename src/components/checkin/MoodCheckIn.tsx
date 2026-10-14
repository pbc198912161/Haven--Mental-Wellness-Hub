import React, { useState, useEffect } from 'react';
import { CheckIn, MoodId, Tag } from '@/types';
import { MOOD_MAP, getSuggestedPattern } from '@/lib/moods';
import { MoodPicker } from './MoodPicker';
import { InfluenceTags } from './InfluenceTags';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Edit2, CheckCircle2, Wind } from 'lucide-react';
import { toast } from 'sonner';

interface MoodCheckInProps {
  todayCheckIn: CheckIn | null;
  onSaveCheckIn: (checkIn: CheckIn) => void;
  onStartBreathingWithPattern: (patternId: 'box' | 'relax478' | 'even') => void;
  onStartReset: () => void;
  todayDate: string;
}

export const MoodCheckIn: React.FC<MoodCheckInProps> = ({
  todayCheckIn,
  onSaveCheckIn,
  onStartBreathingWithPattern,
  onStartReset,
  todayDate,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(todayCheckIn?.mood ?? null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(todayCheckIn?.tags ?? []);
  const [note, setNote] = useState<string>(todayCheckIn?.note ?? '');
  const [moodError, setMoodError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [suggestedPatternInfo, setSuggestedPatternInfo] = useState<{
    patternId: 'box' | 'relax478' | 'even';
    label: string;
  } | null>(null);

  // Sync state if todayCheckIn changes
  useEffect(() => {
    if (todayCheckIn && !isEditing) {
      setSelectedMood(todayCheckIn.mood);
      setSelectedTags(todayCheckIn.tags);
      setNote(todayCheckIn.note);
    }
  }, [todayCheckIn, isEditing]);

  const handleToggleTag = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMood) {
      setMoodError(true);
      return;
    }
    setMoodError(false);

    if (note.length > 280) {
      toast.error('Notes must be 280 characters or fewer.');
      return;
    }

    const moodMeta = MOOD_MAP[selectedMood];
    const checkIn: CheckIn = {
      date: todayDate,
      mood: selectedMood,
      score: moodMeta.score,
      tags: selectedTags,
      note: note.trim(),
      updatedAt: Date.now(),
    };

    onSaveCheckIn(checkIn);
    setIsEditing(false);

    const isUpdate = !!todayCheckIn;
    toast.success(isUpdate ? "Today's check-in updated" : "Check-in saved");

    // Suggest breathing
    const pattern = getSuggestedPattern(selectedMood);
    setSuggestedPatternInfo({
      patternId: pattern.id,
      label: pattern.label,
    });
  };

  const isCheckedIn = !!todayCheckIn && !isEditing;

  if (isCheckedIn && todayCheckIn) {
    const meta = MOOD_MAP[todayCheckIn.mood];
    const pattern = getSuggestedPattern(todayCheckIn.mood);

    return (
      <div className="rounded-[28px] p-6 sm:p-7 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-seafoam-dark dark:text-seafoam" />
            <span className="text-xs uppercase tracking-wider font-semibold text-tide-muted dark:text-gray-300">
              Checked in for today
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="rounded-full text-xs text-tide-muted hover:text-tide dark:hover:text-white"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner"
            style={{ backgroundColor: `${meta.color}25`, border: `1.5px solid ${meta.color}` }}
          >
            {meta.emoji}
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-tide dark:text-gray-100">
              Feeling {meta.label}
            </h3>
            <p className="text-xs text-tide-muted dark:text-gray-400 mt-0.5">{meta.description}</p>
          </div>
        </div>

        {todayCheckIn.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {todayCheckIn.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-mist-alt dark:bg-deep-tide text-tide dark:text-gray-200 border border-border/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {todayCheckIn.note && (
          <p className="text-sm text-tide/90 dark:text-gray-200 bg-mist/60 dark:bg-deep-tide/60 p-3.5 rounded-2xl italic border border-border/40">
            "{todayCheckIn.note}"
          </p>
        )}

        {/* Gentle breathing recommendation banner */}
        <div className="p-4 rounded-2xl bg-seafoam/15 dark:bg-seafoam/10 border border-seafoam/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Wind className="w-5 h-5 text-seafoam-dark dark:text-seafoam shrink-0" />
            <p className="text-xs sm:text-sm text-tide dark:text-gray-200">
              Want to try a breathing exercise? We gently suggest{' '}
              <span className="font-semibold text-tide dark:text-white">{pattern.label}</span>.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onStartBreathingWithPattern(pattern.id)}
            className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-seafoam dark:text-deep-tide dark:hover:bg-seafoam/90 text-xs font-medium px-4 h-8 shrink-0"
          >
            Start {pattern.label}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-[28px] p-6 sm:p-7 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-6"
    >
      <div>
        <label className="block text-sm font-semibold text-tide dark:text-gray-100 mb-2">
          How are you feeling right now?
        </label>
        <MoodPicker
          selectedMood={selectedMood}
          onSelectMood={(mood) => {
            setSelectedMood(mood);
            setMoodError(false);
          }}
          hasError={moodError}
        />
      </div>

      <InfluenceTags selectedTags={selectedTags} onToggleTag={handleToggleTag} />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="mood-note"
            className="block text-xs font-medium text-tide-muted dark:text-gray-300"
          >
            Add a note <span className="text-tide-muted/70">(optional)</span>
          </label>
          <span
            className={`text-xs ${
              note.length > 280
                ? 'text-rose-600 font-semibold'
                : 'text-tide-muted/70 dark:text-gray-400'
            }`}
          >
            {note.length}/280
          </span>
        </div>
        <Textarea
          id="mood-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A thought, something that happened, or what is on your mind today..."
          rows={2}
          className="rounded-2xl resize-none text-sm bg-white/70 dark:bg-deep-tide/50 border-border"
        />
        {note.length > 280 && (
          <p className="text-xs text-rose-600 dark:text-rose-400">
            Please keep your note within 280 characters.
          </p>
        )}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          type="submit"
          className="flex-1 rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide dark:hover:bg-gray-100 font-medium h-11 transition-all"
        >
          {todayCheckIn ? 'Update check-in' : 'Save check-in'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onStartReset}
          className="rounded-full border-seafoam/60 hover:bg-seafoam/15 text-tide dark:text-white font-medium h-11 transition-colors"
        >
          <Sparkles className="w-4 h-4 mr-1.5 text-seafoam-dark dark:text-seafoam" />
          Start 60s Reset
        </Button>
      </div>

      {suggestedPatternInfo && (
        <div className="mt-3 p-3.5 rounded-2xl bg-seafoam/15 dark:bg-seafoam/10 border border-seafoam/30 flex items-center justify-between gap-2 animate-fadeIn">
          <span className="text-xs sm:text-sm text-tide dark:text-gray-200">
            Want to try a breathing exercise? We suggest{' '}
            <strong className="text-tide dark:text-white">{suggestedPatternInfo.label}</strong>.
          </span>
          <Button
            type="button"
            size="sm"
            onClick={() => onStartBreathingWithPattern(suggestedPatternInfo.patternId)}
            className="rounded-full text-xs h-7 px-3 bg-tide text-white"
          >
            Start
          </Button>
        </div>
      )}
    </form>
  );
};

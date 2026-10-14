import React, { useState } from 'react';
import { GratitudeEntry } from '@/types';
import { GRATITUDE_PROMPT_CHIPS } from '@/lib/affirmations';
import { EntryList } from './EntryList';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

interface GratitudeJournalProps {
  entries: GratitudeEntry[];
  onSaveEntry: (entry: GratitudeEntry) => void;
  onDeleteEntry: (id: string) => void;
  blurJournal: boolean;
  onToggleBlur: () => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({
  entries,
  onSaveEntry,
  onDeleteEntry,
  blurJournal,
  onToggleBlur,
}) => {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChipClick = (prompt: string) => {
    setText((prev) => {
      if (!prev.trim()) return prompt + ' ';
      return prev + '\n' + prompt + ' ';
    });
    setErrorMsg(null);
  };

  const handleStartEdit = (entry: GratitudeEntry) => {
    setEditingId(entry.id);
    setText(entry.text);
    setErrorMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setText('');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (trimmed.length < 3) {
      setErrorMsg('Please write at least 3 characters.');
      return;
    }
    if (trimmed.length > 500) {
      setErrorMsg('Please keep your entry within 500 characters.');
      return;
    }

    setErrorMsg(null);

    const newEntry: GratitudeEntry = {
      id: editingId ?? `gratitude-${Date.now()}`,
      text: trimmed,
      createdAt: editingId
        ? (entries.find((e) => e.id === editingId)?.createdAt ?? Date.now())
        : Date.now(),
    };

    onSaveEntry(newEntry);
    setText('');
    setEditingId(null);
    toast.success('Saved to your journal');
  };

  return (
    <section id="journal" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="space-y-2 mb-8 text-center sm:text-left">
          <span className="text-xs uppercase font-semibold tracking-wider text-seafoam-dark dark:text-seafoam">
            Gratitude Journal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-tide dark:text-white">
            One Small Good Thing
          </h2>
          <p className="text-sm text-tide-muted dark:text-gray-300 max-w-xl">
            You don't need a huge breakthrough. A warm cup, a kind word, or a quiet breath is enough to anchor your day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-6 rounded-[28px] p-6 sm:p-7 bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tide dark:text-gray-200 uppercase tracking-wider">
                {editingId ? 'Edit Journal Entry' : 'Write a moment'}
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-tide-muted hover:text-tide underline"
                >
                  Cancel editing
                </button>
              )}
            </div>

            {/* Prompt Chips */}
            <div className="space-y-1.5">
              <span className="text-xs text-tide-muted dark:text-gray-400">
                Tap a thought starter to begin:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GRATITUDE_PROMPT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChipClick(chip)}
                    className="text-left px-3 py-1.5 rounded-full text-xs bg-mist-alt/80 dark:bg-deep-tide text-tide dark:text-gray-300 hover:bg-mist hover:text-tide border border-border/80 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="gratitude-text" className="font-medium text-tide-muted dark:text-gray-300">
                  Your thoughts
                </label>
                <span
                  className={
                    text.length > 500
                      ? 'text-rose-600 font-semibold'
                      : 'text-tide-muted/70 dark:text-gray-400'
                  }
                >
                  {text.length}/500
                </span>
              </div>

              <Textarea
                id="gratitude-text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Write one sentence or thought you are grateful for today..."
                rows={4}
                className="rounded-2xl resize-none text-sm bg-white/70 dark:bg-deep-tide/50 border-border"
              />

              {errorMsg && (
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  className="rounded-full bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide dark:hover:bg-gray-100 px-6 h-10 text-sm font-semibold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sand-glow" />
                  {editingId ? 'Save changes' : 'Save to journal'}
                </Button>
              </div>
            </form>
          </div>

          {/* List Side */}
          <div className="lg:col-span-6">
            <EntryList
              entries={entries}
              onDelete={onDeleteEntry}
              onEdit={handleStartEdit}
              isBlurred={blurJournal}
              onToggleBlur={onToggleBlur}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

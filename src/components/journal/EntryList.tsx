import React, { useState } from 'react';
import { GratitudeEntry } from '@/types';
import { formatDateTimeDisplay } from '@/lib/dates';
import { Button } from '@/components/ui/button';
import { Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
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

interface EntryListProps {
  entries: GratitudeEntry[];
  onDelete: (id: string) => void;
  onEdit: (entry: GratitudeEntry) => void;
  isBlurred: boolean;
  onToggleBlur: () => void;
}

export const EntryList: React.FC<EntryListProps> = ({
  entries,
  onDelete,
  onEdit,
  isBlurred,
  onToggleBlur,
}) => {
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="rounded-[28px] p-8 text-center border border-dashed border-border/80 bg-white/40 dark:bg-card/40 flex flex-col items-center justify-center min-h-[220px]">
        <p className="font-serif text-lg text-tide dark:text-gray-200">
          One small good thing is enough.
        </p>
        <p className="text-xs text-tide-muted dark:text-gray-400 mt-1 max-w-xs">
          What made your day a little lighter today? Write a line to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Privacy toggle header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-tide-muted dark:text-gray-400">
          Saved Moments ({entries.length})
        </span>
        <button
          type="button"
          onClick={onToggleBlur}
          className="inline-flex items-center gap-1.5 text-xs text-tide-muted hover:text-tide dark:text-gray-400 dark:hover:text-white transition-colors"
          title={isBlurred ? 'Show journal text' : 'Blur text for privacy'}
        >
          {isBlurred ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{isBlurred ? 'Unblur entries' : 'Privacy blur'}</span>
        </button>
      </div>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {entries.map((entry) => {
          const isHovered = hoveredEntryId === entry.id;
          const shouldBlur = isBlurred && !isHovered;

          return (
            <div
              key={entry.id}
              onMouseEnter={() => setHoveredEntryId(entry.id)}
              onMouseLeave={() => setHoveredEntryId(null)}
              onClick={() => {
                if (isBlurred) {
                  setHoveredEntryId(isHovered ? null : entry.id);
                }
              }}
              className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-card/90 border border-border shadow-xs hover:shadow-sm transition-all relative group"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-[11px] font-medium text-tide-muted/80 dark:text-gray-400">
                  {formatDateTimeDisplay(entry.createdAt)}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(entry);
                    }}
                    className="w-7 h-7 rounded-full text-tide-muted hover:text-tide"
                    title="Edit entry"
                    aria-label="Edit entry"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEntryToDelete(entry.id);
                    }}
                    className="w-7 h-7 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete entry"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <p
                className={`mt-2 text-sm text-tide dark:text-gray-100 leading-relaxed transition-all select-text break-words ${
                  shouldBlur ? 'filter blur-sm select-none' : ''
                }`}
              >
                {entry.text}
              </p>

              {entry.demo && (
                <span className="inline-block mt-2 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-seafoam/20 text-seafoam-dark dark:text-seafoam">
                  sample entry
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={entryToDelete !== null}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
      >
        <AlertDialogContent className="rounded-[28px] max-w-md bg-white dark:bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl">Delete this gratitude entry?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-tide-muted dark:text-gray-300">
              This line will be removed from your saved journal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (entryToDelete) {
                  onDelete(entryToDelete);
                  setEntryToDelete(null);
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
  );
};

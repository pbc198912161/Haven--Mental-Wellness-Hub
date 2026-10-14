import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Disclaimer } from './Disclaimer';
import { exportAllDataAsJSON, eraseAllData } from '@/lib/storage';
import { toast } from 'sonner';

interface FooterProps {
  onDataReset: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onDataReset }) => {
  const [isEraseOpen, setIsEraseOpen] = useState(false);

  const handleExport = () => {
    try {
      const json = exportAllDataAsJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `haven-wellness-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Your wellness data was exported to JSON.');
    } catch {
      toast.error('Unable to export data.');
    }
  };

  const handleErase = () => {
    try {
      eraseAllData();
      setIsEraseOpen(false);
      onDataReset();
      toast.success('All Haven data has been cleared from this device.');
    } catch {
      toast.error('Failed to clear data.');
    }
  };

  return (
    <footer className="mt-20 border-t border-border/80 bg-mist-alt/60 dark:bg-deep-tide/95 pt-12 pb-24 md:pb-12 text-tide-muted dark:text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sand-glow via-seafoam to-dusk-lilac" />
            <span className="font-serif text-lg font-semibold text-tide dark:text-gray-200">Haven</span>
            <span className="text-xs text-tide-muted dark:text-gray-400">· Calm corner for students</span>
          </div>

          {/* Privacy controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {/* Stays on this device badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-card/70 border border-border text-tide dark:text-gray-200">
              <ShieldCheck className="w-3.5 h-3.5 text-seafoam-dark dark:text-seafoam" />
              <span>Stays on this device</span>
            </div>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-full text-xs h-8 border-border bg-white/50 dark:bg-card/50 hover:bg-white dark:hover:bg-card"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export my data
            </Button>

            {/* Erase Dialog */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEraseOpen(true)}
              className="rounded-full text-xs h-8 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/40 bg-white/50 dark:bg-card/50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Erase everything
            </Button>
            <AlertDialog open={isEraseOpen} onOpenChange={setIsEraseOpen}>
              <AlertDialogContent className="rounded-[28px] max-w-md bg-white dark:bg-card border-border">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-serif text-xl">Clear all saved Haven data?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-tide-muted dark:text-gray-300">
                    This will permanently remove your check-in history, journal entries, and custom settings from this browser. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full">Keep my data</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleErase}
                    className="rounded-full bg-destructive text-white hover:bg-destructive/90"
                  >
                    Yes, erase everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Disclaimer */}
        <Disclaimer variant="footer" />

        {/* Bottom copyright / note */}
        <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-tide-muted/70 dark:text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} Haven. Built for student wellness.</p>
          <p className="flex items-center gap-1">
            Crafted with calm intent <Heart className="w-3 h-3 text-rose-400 inline" fill="currentColor" />
          </p>
        </div>
      </div>
    </footer>
  );
};

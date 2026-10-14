import React from 'react';
import { ShieldCheck, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportAllDataAsJSON, eraseAllData } from '@/lib/storage';
import { toast } from 'sonner';

interface PrivacyControlsProps {
  onDataReset: () => void;
}

export const PrivacyControls: React.FC<PrivacyControlsProps> = ({ onDataReset }) => {
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
    if (window.confirm('Are you sure you want to clear all Haven data on this device? This cannot be undone.')) {
      eraseAllData();
      onDataReset();
      toast.success('All data has been cleared.');
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-seafoam-dark dark:text-seafoam" />
        <span className="font-serif text-lg font-semibold text-tide dark:text-white">
          Privacy & Storage
        </span>
      </div>

      <p className="text-xs text-tide-muted dark:text-gray-300">
        Everything you write or log stays purely on this device in your browser's localStorage. No remote servers, no analytics, no external tracking.
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="rounded-full text-xs h-8"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Export JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleErase}
          className="rounded-full text-xs h-8 text-destructive hover:text-destructive border-destructive/20"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Erase everything
        </Button>
      </div>
    </div>
  );
};

import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerProps {
  className?: string;
  variant?: 'banner' | 'subtle' | 'footer';
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ className = '', variant = 'subtle' }) => {
  if (variant === 'banner') {
    return (
      <aside
        aria-label="Medical disclaimer"
        className={`flex items-center justify-between gap-3 px-4 py-2 text-xs rounded-full bg-mist-alt/80 dark:bg-deep-tide/90 border border-border text-tide-muted dark:text-gray-300 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-seafoam-dark dark:text-seafoam shrink-0" aria-hidden="true" />
          <span>Haven supports everyday wellbeing. It isn't a medical service and can't replace professional help.</span>
        </div>
        <a
          href="#support"
          className="underline font-medium hover:text-tide dark:hover:text-white transition-colors shrink-0"
        >
          View helplines
        </a>
      </aside>
    );
  }

  if (variant === 'footer') {
    return (
      <p className={`text-xs text-tide-muted/80 dark:text-gray-400 max-w-xl mx-auto text-center ${className}`}>
        Haven supports everyday wellbeing. It isn't a medical service and can't replace professional help. If you or someone you know is in crisis, please connect with trusted professionals or emergency services.
      </p>
    );
  }

  return (
    <div
      role="note"
      className={`text-xs text-tide-muted/90 dark:text-gray-400 inline-flex items-center gap-1.5 ${className}`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-seafoam-dark dark:text-seafoam inline shrink-0" aria-hidden="true" />
      <span>Haven supports everyday wellbeing. It isn't a medical service and can't replace professional help.</span>
    </div>
  );
};

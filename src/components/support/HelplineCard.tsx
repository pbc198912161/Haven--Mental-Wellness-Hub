import React from 'react';
import { HelplineInfo } from '@/lib/helplines';
import { Phone, ShieldAlert, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelplineCardProps {
  helpline: HelplineInfo;
}

export const HelplineCard: React.FC<HelplineCardProps> = ({ helpline }) => {
  return (
    <div
      className={`p-5 sm:p-6 rounded-[28px] border transition-all ${
        helpline.highlight
          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 shadow-sm'
          : 'bg-white/80 dark:bg-card/85 backdrop-blur-md border-border shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl ${
              helpline.highlight
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200'
                : 'bg-seafoam/25 text-seafoam-dark dark:text-seafoam'
            }`}
          >
            {helpline.highlight ? <ShieldAlert className="w-5 h-5" /> : <HeartPulse className="w-5 h-5" />}
          </div>
          <h3 className="font-serif text-lg font-semibold text-tide dark:text-white leading-snug">
            {helpline.service}
          </h3>
        </div>
      </div>

      <p className="text-xs text-tide-muted dark:text-gray-300 mb-4">{helpline.notes}</p>

      {/* Tap-to-call buttons */}
      <div className="flex flex-wrap gap-2">
        {helpline.numbers.map((num) => (
          <a
            key={num.tel}
            href={`tel:${num.tel}`}
            className={`inline-flex items-center justify-center rounded-full h-10 px-4 text-xs font-semibold transition-all shadow-xs ${
              helpline.highlight
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-tide hover:bg-tide/90 text-white dark:bg-white dark:text-tide'
            }`}
          >
            <Phone className="w-3.5 h-3.5 mr-2" />
            Call {num.display}
          </a>
        ))}
      </div>
    </div>
  );
};

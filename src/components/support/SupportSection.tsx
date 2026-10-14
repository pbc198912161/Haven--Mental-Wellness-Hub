import React from 'react';
import { HELPLINES, HELPLINE_FOOTER_NOTE, WHEN_TO_REACH_OUT_TEXT } from '@/lib/helplines';
import { HelplineCard } from './HelplineCard';
import { TrustedContact } from './TrustedContact';
import { TrustedContact as ITrustedContact } from '@/types';
import { ShieldAlert, Info, PhoneCall } from 'lucide-react';
import { Disclaimer } from '../layout/Disclaimer';

interface SupportSectionProps {
  trustedContact: ITrustedContact | null;
  onSaveTrustedContact: (contact: ITrustedContact | null) => void;
}

export const SupportSection: React.FC<SupportSectionProps> = ({
  trustedContact,
  onSaveTrustedContact,
}) => {
  return (
    <section id="support" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Urgent Emergency Banner */}
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <p className="font-semibold text-rose-900 dark:text-rose-100 text-sm sm:text-base">
                If you or someone near you is in immediate danger, call 112.
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Emergency services are free, confidential, and available 24 hours a day across India.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call 112 now
          </a>
        </div>

        {/* Section Header */}
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase font-semibold tracking-wider text-seafoam-dark dark:text-seafoam">
            Support Resources
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-tide dark:text-white">
            Care & Helplines
          </h2>
          <p className="text-sm text-tide-muted dark:text-gray-300 max-w-xl">
            Free, confidential support is always available whenever you need someone who understands.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HELPLINES.map((h) => (
            <HelplineCard key={h.service} helpline={h} />
          ))}

          {/* Trusted Contact Card */}
          <TrustedContact contact={trustedContact} onSaveContact={onSaveTrustedContact} />

          {/* When to reach out card */}
          <div className="p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-seafoam-dark dark:text-seafoam">
                <Info className="w-4 h-4" />
                <span>When to reach out</span>
              </div>
              <p className="font-serif text-base text-tide dark:text-white leading-relaxed">
                {WHEN_TO_REACH_OUT_TEXT}
              </p>
            </div>
            <p className="text-xs text-tide-muted dark:text-gray-400">
              There is no minimum threshold of distress required to ask for support.
            </p>
          </div>
        </div>

        {/* Disclaimer in Support Section */}
        <div className="pt-2">
          <Disclaimer variant="banner" />
        </div>

        {/* Footer verification note */}
        <p className="text-xs text-tide-muted/80 dark:text-gray-400 text-center">
          {HELPLINE_FOOTER_NOTE}
        </p>
      </div>
    </section>
  );
};

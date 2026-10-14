import React from 'react';
import { Sun, Moon, Volume2, VolumeX, Sparkles, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onStartReset: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onStartReset,
  isDark,
  onToggleDark,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-mist/85 dark:bg-deep-tide/85 border-b border-border/60 transition-colors">
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-tide focus:text-white focus:rounded-full focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-dusk-lilac"
      >
        Skip to main content
      </a>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a
            href="#today"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('today');
            }}
            className="group flex items-center gap-2.5 focus-visible:rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sand-glow via-seafoam to-dusk-lilac shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-tide dark:text-gray-100">
                Haven
              </span>
            </div>
          </a>
          <span className="hidden md:inline-block text-xs text-tide-muted dark:text-gray-400 pl-2 border-l border-border/60">
            A calm space for students
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-tide-muted dark:text-gray-300">
          <button
            onClick={() => scrollTo('today')}
            className="px-3 py-1.5 rounded-full hover:text-tide dark:hover:text-white hover:bg-mist-alt dark:hover:bg-card transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => scrollTo('breathe')}
            className="px-3 py-1.5 rounded-full hover:text-tide dark:hover:text-white hover:bg-mist-alt dark:hover:bg-card transition-colors"
          >
            Breathe
          </button>
          <button
            onClick={() => scrollTo('journal')}
            className="px-3 py-1.5 rounded-full hover:text-tide dark:hover:text-white hover:bg-mist-alt dark:hover:bg-card transition-colors"
          >
            Journal
          </button>
          <button
            onClick={() => scrollTo('insights')}
            className="px-3 py-1.5 rounded-full hover:text-tide dark:hover:text-white hover:bg-mist-alt dark:hover:bg-card transition-colors"
          >
            Insights
          </button>
          <button
            onClick={() => scrollTo('support')}
            className="px-3 py-1.5 rounded-full hover:text-tide dark:hover:text-white hover:bg-mist-alt dark:hover:bg-card transition-colors"
          >
            Support
          </button>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ambient sound toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAudio}
            aria-label={isAudioPlaying ? 'Mute ambient sound' : 'Play ambient calming sound'}
            title={isAudioPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
            className="rounded-full w-9 h-9 text-tide-muted dark:text-gray-300 hover:text-tide hover:bg-mist-alt dark:hover:bg-card"
          >
            {isAudioPlaying ? (
              <Volume2 className="w-4 h-4 text-seafoam-dark dark:text-seafoam animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 opacity-60" />
            )}
          </Button>

          {/* Dark / Light toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDark}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="rounded-full w-9 h-9 text-tide-muted dark:text-gray-300 hover:text-tide hover:bg-mist-alt dark:hover:bg-card"
          >
            {isDark ? <Sun className="w-4 h-4 text-sand-glow" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* 60s Reset Quick Button */}
          <Button
            onClick={onStartReset}
            size="sm"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-seafoam/20 hover:bg-seafoam/35 text-tide dark:text-white border border-seafoam/40 font-medium px-3.5 py-1.5 h-9 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-seafoam-dark dark:text-seafoam" />
            <span>60s Reset</span>
          </Button>

          {/* Permanent "Need help now?" button */}
          <Button
            onClick={() => scrollTo('support')}
            size="sm"
            className="rounded-full bg-tide hover:bg-tide/90 text-white dark:bg-rose-950/80 dark:hover:bg-rose-900/90 dark:text-rose-100 border border-tide/20 dark:border-rose-800 font-medium px-3 sm:px-4 py-1.5 h-9 shadow-sm transition-all hover:shadow"
          >
            <HeartHandshake className="w-3.5 h-3.5 mr-1 text-sand-glow dark:text-rose-300 shrink-0" />
            <span className="text-xs sm:text-sm whitespace-nowrap">Need help now?</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

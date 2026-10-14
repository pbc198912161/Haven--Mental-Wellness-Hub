import React from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SoundType } from '@/hooks/useAmbientSound';

interface SoundControlProps {
  isSupported: boolean;
  isPlaying: boolean;
  currentSound: SoundType;
  volume: number;
  onToggle: () => void;
  onChangeSound: (sound: SoundType) => void;
  onChangeVolume: (vol: number) => void;
}

export const SoundControl: React.FC<SoundControlProps> = ({
  isSupported,
  isPlaying,
  currentSound,
  volume,
  onToggle,
  onChangeSound,
  onChangeVolume,
}) => {
  if (!isSupported) return null;

  const soundOptions: { id: SoundType; label: string; icon: any; desc: string }[] = [
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain, desc: 'Soft band-pass filtered flutter' },
    { id: 'waves', label: 'Ocean Waves', icon: Waves, desc: 'Rhythmic low-pass brown noise' },
    { id: 'drone', label: 'Warm Drone', icon: Sparkles, desc: 'Two soothing detuned sine waves' },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-[28px] bg-white/80 dark:bg-card/85 backdrop-blur-md border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-seafoam-dark dark:text-seafoam animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-tide-muted dark:text-gray-400" />
          )}
          <span className="font-serif text-lg font-semibold text-tide dark:text-white">
            Ambient Soundscape
          </span>
        </div>

        <Button
          onClick={onToggle}
          size="sm"
          className={`rounded-full px-4 h-8 text-xs font-semibold transition-all ${
            isPlaying
              ? 'bg-seafoam text-tide hover:bg-seafoam/90'
              : 'bg-tide text-white hover:bg-tide/90 dark:bg-white dark:text-tide'
          }`}
        >
          {isPlaying ? 'Stop audio' : 'Play sound'}
        </Button>
      </div>

      <p className="text-xs text-tide-muted dark:text-gray-400">
        Synthesized in real-time in your browser with the Web Audio API. No external audio files or downloads.
      </p>

      {/* Sound Options */}
      <div className="grid grid-cols-3 gap-2">
        {soundOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentSound === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeSound(opt.id)}
              className={`p-3 rounded-2xl text-center border transition-all ${
                isSelected
                  ? 'bg-tide text-white dark:bg-white dark:text-tide border-tide dark:border-white shadow-xs'
                  : 'bg-white/60 dark:bg-deep-tide/50 text-tide-muted dark:text-gray-300 border-border/80 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1.5" />
              <span className="text-xs font-semibold block">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Volume Slider */}
      <div className="pt-2 space-y-1.5">
        <div className="flex justify-between text-xs text-tide-muted dark:text-gray-400">
          <span>Volume</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
        <Slider
          value={[volume]}
          min={0.05}
          max={1.0}
          step={0.01}
          onValueChange={(val: any) => {
            const v = Array.isArray(val) ? val[0] : (val as number);
            onChangeVolume(v);
          }}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

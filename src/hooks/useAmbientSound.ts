import { useState, useRef, useEffect, useCallback } from 'react';

export type SoundType = 'rain' | 'waves' | 'drone';

export function useAmbientSound() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<SoundType>('rain');
  const [volume, setVolume] = useState<number>(0.4);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{ stop: () => void } | null>(null);

  // Check Web Audio API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setIsSupported(false);
      }
    }
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Stop active generators
  const stopActive = useCallback(() => {
    if (activeNodesRef.current) {
      try {
        activeNodesRef.current.stop();
      } catch {
        // ignore
      }
      activeNodesRef.current = null;
    }
  }, []);

  // Start sound generator
  const startSound = useCallback(
    (type: SoundType, vol: number) => {
      stopActive();
      const ctx = getAudioContext();
      if (!ctx) return;

      if (!masterGainRef.current) {
        masterGainRef.current = ctx.createGain();
        masterGainRef.current.connect(ctx.destination);
      }

      // Smooth fade-in over 1.5s
      const now = ctx.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(0.001, now);
      masterGainRef.current.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), now + 1.5);

      if (type === 'rain') {
        // Rain: white noise through band-pass filter with slight flutter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 1000;
        bandpass.Q.value = 0.8;

        const rainGain = ctx.createGain();
        rainGain.gain.value = 0.5;

        // LFO flutter
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 0.08;
        lfo.connect(lfoGain);
        lfoGain.connect(rainGain.gain);

        whiteNoise.connect(bandpass);
        bandpass.connect(rainGain);
        rainGain.connect(masterGainRef.current);

        whiteNoise.start();
        lfo.start();

        activeNodesRef.current = {
          stop: () => {
            try {
              whiteNoise.stop();
              lfo.stop();
              whiteNoise.disconnect();
              bandpass.disconnect();
              rainGain.disconnect();
            } catch {
              // ignore
            }
          },
        };
      } else if (type === 'waves') {
        // Waves: brown noise through low-pass with slow ~0.1Hz gain LFO
        const bufferSize = ctx.sampleRate * 2;
        const brownBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = brownBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const brownNoise = ctx.createBufferSource();
        brownNoise.buffer = brownBuffer;
        brownNoise.loop = true;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 400;

        const waveGain = ctx.createGain();
        waveGain.gain.value = 0.4;

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // ~10 second wave cycle
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        lfoGain.connect(waveGain.gain);

        brownNoise.connect(lowpass);
        lowpass.connect(waveGain);
        waveGain.connect(masterGainRef.current);

        brownNoise.start();
        lfo.start();

        activeNodesRef.current = {
          stop: () => {
            try {
              brownNoise.stop();
              lfo.stop();
              brownNoise.disconnect();
              lowpass.disconnect();
              waveGain.disconnect();
            } catch {
              // ignore
            }
          },
        };
      } else if (type === 'drone') {
        // Soft drone: two detuned low sine oscillators at very low gain
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const droneGain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.value = 110; // A2 note
        osc2.type = 'sine';
        osc2.frequency.value = 110.6; // slight warm chorus detune

        droneGain.gain.value = 0.2;

        osc1.connect(droneGain);
        osc2.connect(droneGain);
        droneGain.connect(masterGainRef.current);

        osc1.start();
        osc2.start();

        activeNodesRef.current = {
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
              osc1.disconnect();
              osc2.disconnect();
              droneGain.disconnect();
            } catch {
              // ignore
            }
          },
        };
      }
    },
    [getAudioContext, stopActive]
  );

  const toggle = useCallback(() => {
    if (isPlaying) {
      // Fade out over 1.5s
      if (masterGainRef.current && audioCtxRef.current) {
        const now = audioCtxRef.current.currentTime;
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, now);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        setTimeout(() => {
          stopActive();
          setIsPlaying(false);
        }, 1500);
      } else {
        stopActive();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(true);
      startSound(currentSound, volume);
    }
  }, [isPlaying, currentSound, volume, startSound, stopActive]);

  const changeSound = useCallback(
    (sound: SoundType) => {
      setCurrentSound(sound);
      if (isPlaying) {
        startSound(sound, volume);
      }
    },
    [isPlaying, volume, startSound]
  );

  const changeVolume = useCallback((newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(Math.max(0.001, newVol), now);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopActive();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopActive]);

  return {
    isSupported,
    isPlaying,
    currentSound,
    volume,
    toggle,
    changeSound,
    changeVolume,
  };
}

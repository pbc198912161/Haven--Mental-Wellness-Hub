import { useState, useEffect, useRef, useCallback } from 'react';
import { BreathingPatternId, BreathingPhase } from '@/types';
import { BREATHING_PATTERNS } from '@/lib/moods';

export type BreathingStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface UseBreathingOptions {
  initialPattern?: BreathingPatternId;
  initialMinutes?: number; // 1, 2, or 3
  onComplete?: (session: { pattern: BreathingPatternId; seconds: number; minutes: number }) => void;
}

export interface UseBreathingReturn {
  status: BreathingStatus;
  patternId: BreathingPatternId;
  setPatternId: (pattern: BreathingPatternId) => void;
  minutes: number;
  setMinutes: (m: number) => void;
  currentPhase: BreathingPhase;
  phaseIndex: number;
  phaseRemainingSeconds: number;
  cycleCountdownSeconds: number;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  progressPercent: number; // 0 to 100
  orbScale: number; // 1.0 to ~1.45
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useBreathing(options: UseBreathingOptions = {}): UseBreathingReturn {
  const { initialPattern = 'box', initialMinutes = 1, onComplete } = options;

  const [patternId, setPatternId] = useState<BreathingPatternId>(initialPattern);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [status, setStatus] = useState<BreathingStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const patternConfig = BREATHING_PATTERNS[patternId] || BREATHING_PATTERNS.box;
  const cycleDuration = patternConfig.cycleDuration;

  // Round session length to nearest whole cycle count
  const targetTotalSeconds = minutes * 60;
  const cycleCount = Math.max(1, Math.round(targetTotalSeconds / cycleDuration));
  const totalDurationSeconds = cycleCount * cycleDuration;
  const totalDurationMs = totalDurationSeconds * 1000;

  const startTimeRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const currentSegmentMs = now - startTimeRef.current;
    const currentTotalMs = accumulatedMsRef.current + currentSegmentMs;

    if (currentTotalMs >= totalDurationMs) {
      setElapsedMs(totalDurationMs);
      setStatus('completed');
      startTimeRef.current = null;
      accumulatedMsRef.current = totalDurationMs;
      if (onCompleteRef.current) {
        onCompleteRef.current({
          pattern: patternId,
          seconds: totalDurationSeconds,
          minutes,
        });
      }
      return;
    }

    setElapsedMs(currentTotalMs);
    rafRef.current = requestAnimationFrame(tick);
  }, [totalDurationMs, patternId, totalDurationSeconds, minutes]);

  const start = useCallback(() => {
    accumulatedMsRef.current = 0;
    startTimeRef.current = performance.now();
    setElapsedMs(0);
    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (startTimeRef.current !== null) {
      accumulatedMsRef.current += performance.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setStatus('paused');
  }, [status]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    startTimeRef.current = performance.now();
    setStatus('running');
  }, [status]);

  const reset = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    accumulatedMsRef.current = 0;
    setElapsedMs(0);
    setStatus('idle');
  }, []);

  useEffect(() => {
    if (status === 'running') {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [status, tick]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Compute phase and scale derived purely from elapsed time
  const currentElapsedSec = elapsedMs / 1000;
  const cycleTimeSec = currentElapsedSec % cycleDuration;

  let accumulatedPhaseTime = 0;
  let activePhaseIndex = 0;
  let activePhase = patternConfig.phases[0];
  let phaseStartTime = 0;

  for (let i = 0; i < patternConfig.phases.length; i++) {
    const phase = patternConfig.phases[i];
    if (cycleTimeSec < accumulatedPhaseTime + phase.duration) {
      activePhaseIndex = i;
      activePhase = phase;
      phaseStartTime = accumulatedPhaseTime;
      break;
    }
    accumulatedPhaseTime += phase.duration;
  }

  const phaseElapsed = Math.max(0, cycleTimeSec - phaseStartTime);
  const phaseRemainingSeconds = Math.max(1, Math.ceil(activePhase.duration - phaseElapsed));
  const cycleCountdownSeconds = Math.max(1, Math.ceil(cycleDuration - cycleTimeSec));

  // Orb scale calculation
  let orbScale = 1.0;
  const phaseProgress = Math.min(1, Math.max(0, phaseElapsed / activePhase.duration));
  // Smooth sine ease in-out
  const eased = 0.5 - 0.5 * Math.cos(phaseProgress * Math.PI);

  if (activePhase.name === 'Breathe in') {
    orbScale = 1.0 + (activePhase.scale - 1.0) * eased;
  } else if (activePhase.name === 'Breathe out') {
    orbScale = activePhase.scale + (1.0 - activePhase.scale) * (1 - (1.0 - (0.5 - 0.5 * Math.cos(phaseProgress * Math.PI))));
  } else {
    // Hold
    orbScale = activePhase.scale;
  }

  const progressPercent = Math.min(100, (elapsedMs / totalDurationMs) * 100);

  return {
    status,
    patternId,
    setPatternId: (p) => {
      reset();
      setPatternId(p);
    },
    minutes,
    setMinutes: (m) => {
      reset();
      setMinutes(m);
    },
    currentPhase: activePhase,
    phaseIndex: activePhaseIndex,
    phaseRemainingSeconds,
    cycleCountdownSeconds,
    totalElapsedSeconds: Math.floor(currentElapsedSec),
    totalDurationSeconds,
    progressPercent,
    orbScale,
    start,
    pause,
    resume,
    reset,
  };
}

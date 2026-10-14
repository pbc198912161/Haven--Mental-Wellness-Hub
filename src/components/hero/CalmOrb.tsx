import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CalmOrbProps {
  moodColor?: string; // Hex color from mood or default seafoam
  scale?: number; // External scale multiplier (e.g. for breathing)
  isBreathing?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRipples?: boolean;
}

export const CalmOrb: React.FC<CalmOrbProps> = ({
  moodColor = '#7FCDBB',
  scale = 1.0,
  isBreathing = false,
  className = '',
  size = 'lg',
  showRipples = false,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72',
    xl: 'w-64 h-64 sm:w-80 sm:h-80',
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background ambient halo */}
      <motion.div
        animate={{
          backgroundColor: moodColor,
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: 'easeInOut' },
          opacity: prefersReducedMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={`absolute rounded-full blur-3xl pointer-events-none ${sizeClasses[size]} scale-125`}
        aria-hidden="true"
      />

      {/* Completion ripple effect when requested */}
      {showRipples && !prefersReducedMotion && (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            style={{ borderColor: moodColor }}
            className={`absolute rounded-full border-2 pointer-events-none ${sizeClasses[size]}`}
            aria-hidden="true"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: 'easeOut' }}
            style={{ borderColor: moodColor }}
            className={`absolute rounded-full border pointer-events-none ${sizeClasses[size]}`}
            aria-hidden="true"
          />
        </>
      )}

      {/* Living Calm Orb */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        animate={
          isBreathing
            ? {
                scale: scale,
                opacity: 1,
              }
            : prefersReducedMotion
            ? { opacity: 1, scale: 1 }
            : {
                scale: [1, 1.03, 1],
                y: [0, -4, 0],
                opacity: 1,
              }
        }
        transition={
          isBreathing
            ? {
                scale: { duration: 0.1, ease: 'linear' },
              }
            : prefersReducedMotion
            ? { duration: 0 }
            : {
                // Entrance and idle drift
                scale: { duration: 1.2, ease: 'easeOut' },
                y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 1.0 },
              }
        }
        className={`relative rounded-full shadow-2xl overflow-hidden cursor-default ${sizeClasses[size]}`}
        style={{
          boxShadow: `0 20px 50px -10px ${moodColor}55, 0 0 40px -5px ${moodColor}40`,
        }}
      >
        {/* Layered radial gradient inside the orb */}
        <motion.div
          animate={{
            background: `radial-gradient(circle at 35% 30%, #FFFFFF 0%, #FFFFFF99 15%, ${moodColor} 55%, #14323F 100%)`,
          }}
          transition={{
            background: { duration: 1.2, ease: 'easeInOut' },
          }}
          className="absolute inset-0 w-full h-full rounded-full"
        />

        {/* Soft specular highlight reflection */}
        <div
          className="absolute top-3 left-6 w-1/3 h-1/4 rounded-full bg-white/40 blur-[3px] pointer-events-none transform -rotate-12"
          aria-hidden="true"
        />

        {/* Subtle inner mist ring */}
        <div
          className="absolute inset-1 rounded-full border border-white/20 pointer-events-none"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
};

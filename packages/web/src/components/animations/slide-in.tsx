/**
 * SlideIn Animation Component
 *
 * Wrapper component that applies slide-in animation to its children
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeInUp, slideInLeft, slideInRight, slideInUp, slideInDown } from '@/lib/animations/variants';
import type { ReactNode } from 'react';

export interface SlideInProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Slide direction */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Animation delay in seconds */
  delay?: number;
  /** Custom className */
  className?: string;
  /** Disable animation (overrides reduced motion check) */
  disabled?: boolean;
}

/**
 * SlideIn component
 *
 * Applies a slide-in animation to its children. Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <SlideIn direction="up" delay={0.1}>
 *   <div>Content that slides in from below</div>
 * </SlideIn>
 * ```
 */
export function SlideIn({ children, direction = 'up', delay = 0, className, disabled }: SlideInProps) {
  const shouldReduceMotion = useReducedMotion();

  // If disabled or reduced motion, render without animation
  if (disabled || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Select variant based on direction
  const variants = (() => {
    switch (direction) {
      case 'up':
        return fadeInUp; // Combines fade and slide up
      case 'down':
        return slideInDown;
      case 'left':
        return slideInLeft;
      case 'right':
        return slideInRight;
      default:
        return fadeInUp;
    }
  })();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

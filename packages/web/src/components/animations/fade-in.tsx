/**
 * FadeIn Animation Component
 *
 * Wrapper component that applies fade-in animation to its children
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeIn } from '@/lib/animations/variants';
import type { ReactNode } from 'react';

export interface FadeInProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  /** Custom className */
  className?: string;
  /** Disable animation (overrides reduced motion check) */
  disabled?: boolean;
}

/**
 * FadeIn component
 *
 * Applies a fade-in animation to its children. Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <FadeIn delay={0.2}>
 *   <div>Content that fades in</div>
 * </FadeIn>
 * ```
 */
export function FadeIn({ children, delay = 0, className, disabled }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  // If disabled or reduced motion, render without animation
  if (disabled || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

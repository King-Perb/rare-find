/**
 * ScrollReveal Component
 *
 * Component that reveals its children when scrolled into view
 * Uses IntersectionObserver to detect when element enters viewport
 */

'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeInUp } from '@/lib/animations/variants';
import type { ReactNode } from 'react';
import type { Variants } from 'framer-motion';

export interface ScrollRevealProps {
  /** Child elements to reveal */
  readonly children: ReactNode;
  /** Custom className */
  readonly className?: string;
  /** Animation variants (default: fadeInUp) */
  readonly variants?: Variants;
  /** Threshold for intersection (0-1, default: 0.5) */
  readonly threshold?: number | number[];
  /** Root margin for intersection observer (default: '0px') */
  readonly rootMargin?: string;
  /** Whether to trigger animation only once (default: true) */
  readonly triggerOnce?: boolean;
  /** Disable animation */
  readonly disabled?: boolean;
}

/**
 * ScrollReveal component
 *
 * Reveals children with animation when scrolled into view.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <ScrollReveal>
 *   <div>Content that reveals on scroll</div>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  className = '',
  variants = fadeInUp,
  threshold = 0.5,
  rootMargin = '0px',
  triggerOnce = true,
  disabled = false,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const { isVisible, ref } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  // If disabled or reduced motion, render without animation
  if (disabled || shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

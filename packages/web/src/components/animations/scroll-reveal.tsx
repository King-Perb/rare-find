/**
 * ScrollReveal Component
 *
 * Component that reveals its children when scrolled into view
 * Uses IntersectionObserver to detect when element enters viewport
 */

'use client';

import { BaseAnimation, type BaseAnimationProps } from '@/lib/animations/base-animation';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { fadeInUp } from '@/lib/animations/variants';
import type { Variants } from 'framer-motion';

export interface ScrollRevealProps extends BaseAnimationProps {
  /** Animation variants (default: fadeInUp) */
  readonly variants?: Variants;
  /** Threshold for intersection (0-1, default: 0.5) */
  readonly threshold?: number | number[];
  /** Root margin for intersection observer (default: '0px') */
  readonly rootMargin?: string;
  /** Whether to trigger animation only once (default: true) */
  readonly triggerOnce?: boolean;
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
  const { isVisible, ref } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <BaseAnimation
      ref={ref}
      variants={variants}
      animate={isVisible ? 'visible' : 'hidden'}
      className={className}
      disabled={disabled}
    >
      {children}
    </BaseAnimation>
  );
}

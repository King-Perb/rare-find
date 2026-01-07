/**
 * SlideIn Animation Component
 *
 * Wrapper component that applies slide-in animation to its children
 */

'use client';

import { BaseAnimation, type BaseAnimationProps } from '@/lib/animations/base-animation';
import { fadeInUp, slideInLeft, slideInRight, slideInDown } from '@/lib/animations/variants';
import type { Variants } from 'framer-motion';

export interface SlideInProps extends BaseAnimationProps {
  /** Slide direction */
  readonly direction?: 'up' | 'down' | 'left' | 'right';
  /** Animation delay in seconds */
  readonly delay?: number;
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
  // Select variant based on direction
  const variants: Variants = (() => {
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
    <BaseAnimation
      variants={variants}
      delay={delay}
      className={className}
      disabled={disabled}
    >
      {children}
    </BaseAnimation>
  );
}

/**
 * FadeIn Animation Component
 *
 * Wrapper component that applies fade-in animation to its children
 */

'use client';

import { BaseAnimation, type BaseAnimationProps } from '@/lib/animations/base-animation';
import { fadeIn } from '@/lib/animations/variants';

export interface FadeInProps extends BaseAnimationProps {
  /** Animation delay in seconds */
  readonly delay?: number;
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
  return (
    <BaseAnimation
      variants={fadeIn}
      delay={delay}
      className={className}
      disabled={disabled}
    >
      {children}
    </BaseAnimation>
  );
}

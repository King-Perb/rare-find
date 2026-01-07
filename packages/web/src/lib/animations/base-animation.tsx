/**
 * Base Animation Components
 *
 * Shared base components and types for animation components to reduce duplication
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { ReactNode } from 'react';
import type { Variants } from 'framer-motion';

/**
 * Base props shared by all animation components
 */
export interface BaseAnimationProps {
  /** Child elements to animate */
  readonly children: ReactNode;
  /** Custom className */
  readonly className?: string;
  /** Disable animation (overrides reduced motion check) */
  readonly disabled?: boolean;
}

/**
 * Props for animation components that use variants
 */
export interface VariantAnimationProps extends BaseAnimationProps {
  /** Animation variants */
  readonly variants: Variants;
  /** Animation delay in seconds */
  readonly delay?: number;
  /** Initial animation state */
  readonly initial?: string;
  /** Animate state */
  readonly animate?: string | boolean;
  /** Custom ref callback (optional) */
  readonly ref?: ((node: HTMLElement | null) => void) | undefined;
}

/**
 * Base animation wrapper component
 *
 * Handles common logic for all animation components:
 * - Reduced motion detection
 * - Disabled state
 * - Motion wrapper with variants
 */
export function BaseAnimation({
  children,
  className,
  disabled,
  variants,
  delay = 0,
  initial = 'hidden',
  animate = 'visible',
  ref,
}: VariantAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  // If disabled or reduced motion, render without animation
  if (disabled || shouldReduceMotion) {
    if (ref) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

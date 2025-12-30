/**
 * StaggerContainer Component
 *
 * Container component that applies stagger animation to its children
 * Children appear sequentially with a delay between each
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { staggerContainer, staggerItem } from '@/lib/animations/variants';
import type { ReactNode } from 'react';

export interface StaggerContainerProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Custom className */
  className?: string;
  /** Delay before starting animation (in seconds) */
  delay?: number;
  /** Delay between each child (in seconds, default: 0.1) */
  staggerDelay?: number;
  /** Disable animation */
  disabled?: boolean;
}

/**
 * StaggerContainer component
 *
 * Applies stagger animation to children, making them appear sequentially.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <StaggerContainer>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </StaggerContainer>
 * ```
 */
export function StaggerContainer({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  disabled = false,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  // If disabled or reduced motion, render without animation
  if (disabled || shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Create custom variants with configurable delays
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={staggerItem}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={staggerItem}>{children}</motion.div>
      )}
    </motion.div>
  );
}

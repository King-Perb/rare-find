/**
 * AnimatedButton Component
 *
 * Button component with hover, click, and loading animations
 */

'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { springTransition } from '@/lib/animations/transitions';
import type { ReactNode } from 'react';

export interface AnimatedButtonProps {
  /** Child elements (button content) */
  children: ReactNode;
  /** Show loading state */
  isLoading?: boolean;
  /** Loading text (default: "Loading...") */
  loadingText?: string;
  /** Variant style */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** HTML id attribute */
  id?: string;
  /** HTML aria-label attribute */
  'aria-label'?: string;
}

/**
 * AnimatedButton component
 *
 * Button with hover, click, and loading animations. Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <AnimatedButton onClick={handleClick} isLoading={loading}>
 *   Submit
 * </AnimatedButton>
 * ```
 */
export function AnimatedButton({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  type = 'button',
  onClick,
  disabled,
  className = '',
  id,
  'aria-label': ariaLabel,
}: AnimatedButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  // Base classes - keep opacity-100 for background, only reduce opacity for disabled state if needed
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';

  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white opacity-100 hover:bg-blue-700 focus:ring-blue-500 relative z-10 disabled:bg-blue-600 disabled:opacity-100',
    secondary: 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 focus:ring-zinc-500 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600',
    outline: 'border-2 border-zinc-300 text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 focus:ring-zinc-500 dark:border-zinc-600 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:bg-zinc-800',
    ghost: 'text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-500 dark:text-zinc-300 dark:hover:bg-zinc-800',
  };

  // Animation variants - disable when reduced motion is enabled
  const hoverVariants = shouldReduceMotion ? undefined : {
    scale: 1.02,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: springTransition,
  };

  const tapVariants = shouldReduceMotion ? undefined : {
    scale: 0.98,
    transition: springTransition,
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={hoverVariants}
      whileTap={tapVariants}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      id={id}
      aria-label={ariaLabel}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

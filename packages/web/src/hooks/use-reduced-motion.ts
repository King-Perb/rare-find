/**
 * useReducedMotion Hook
 *
 * Hook to detect and respect user's reduced motion preferences
 * Uses Framer Motion's built-in useReducedMotion hook
 */

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Hook to detect if user prefers reduced motion
 *
 * @returns true if user has reduced motion preference enabled, false otherwise
 *
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 * const variants = shouldReduceMotion ? {} : fadeInUp;
 *
 * return (
 *   <motion.div variants={variants}>
 *     Content
 *   </motion.div>
 * );
 * ```
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}

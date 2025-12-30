/**
 * useCountUp Hook
 *
 * Hook for animating numbers from a start value to a target value
 * with smooth easing and reduced motion support
 */

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './use-reduced-motion';

export interface UseCountUpOptions {
  /** Target value to count up to */
  target: number;
  /** Starting value (default: 0) */
  start?: number;
  /** Animation duration in milliseconds (default: 1000) */
  duration?: number;
  /** Custom formatter function for the displayed value */
  formatter?: (value: number) => string | number;
  /** Easing function (default: easeOutCubic) */
  easing?: (t: number) => number;
}

/**
 * Easing function: easeOutCubic
 * Creates smooth deceleration at the end
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Hook to animate a number from start to target value
 *
 * @param options - Configuration options for the count-up animation
 * @returns Current animated value (or formatted value if formatter provided)
 *
 * @example
 * ```tsx
 * const value = useCountUp({ target: 100, duration: 1000 });
 * return <div>{value}</div>;
 * ```
 *
 * @example
 * ```tsx
 * const formatted = useCountUp({
 *   target: 150.50,
 *   duration: 2000,
 *   formatter: (val) => `$${val.toFixed(2)}`
 * });
 * return <div>{formatted}</div>;
 * ```
 */
export function useCountUp({
  target,
  start = 0,
  duration = 1000,
  formatter,
  easing = easeOutCubic,
}: UseCountUpOptions): number | string {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(start);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const startValueRef = useRef(start);
  const targetRef = useRef(target);

  useEffect(() => {
    // Update target if it changes
    targetRef.current = target;
    startValueRef.current = value; // Use current value as new start when target changes
  }, [target, value]);

  useEffect(() => {
    // If reduced motion is enabled, jump to target immediately
    if (shouldReduceMotion) {
      setValue(targetRef.current);
      return;
    }

    // Reset animation state
    startValueRef.current = start;
    setValue(start);
    startTimeRef.current = undefined;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Apply easing
      const easedProgress = easing(progress);

      // Calculate current value
      const currentValue = startValueRef.current + (targetRef.current - startValueRef.current) * easedProgress;
      setValue(currentValue);

      // Continue animation if not complete
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate) as unknown as number;
      } else {
        // Ensure we end exactly at target
        setValue(targetRef.current);
      }
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate) as unknown as number;

    // Cleanup
    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current as unknown as number);
      }
    };
  }, [start, duration, easing, shouldReduceMotion]);

  // Apply formatter if provided
  if (formatter) {
    return formatter(value);
  }

  return value;
}

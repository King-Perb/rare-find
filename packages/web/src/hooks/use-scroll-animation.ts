/**
 * useScrollAnimation Hook
 *
 * Hook for detecting when an element enters or leaves the viewport
 * using IntersectionObserver API
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from './use-reduced-motion';

export interface UseScrollAnimationOptions {
  /** Threshold for intersection (0-1, default: 0.5) */
  threshold?: number | number[];
  /** Root margin for intersection observer (default: '0px') */
  rootMargin?: string;
  /** Callback when element enters viewport */
  onEnter?: () => void;
  /** Callback when element leaves viewport */
  onExit?: () => void;
  /** Whether to trigger immediately if element is already visible (default: false) */
  triggerOnce?: boolean;
}

export interface UseScrollAnimationReturn {
  /** Whether the element is currently visible in viewport */
  isVisible: boolean;
  /** Ref to attach to the element to observe */
  ref: (node: HTMLElement | null) => void;
}

/**
 * Hook to detect when an element enters or leaves the viewport
 *
 * @param options - Configuration options for scroll animation
 * @returns Object with isVisible state and ref callback
 *
 * @example
 * ```tsx
 * const { isVisible, ref } = useScrollAnimation({
 *   threshold: 0.5,
 *   onEnter: () => console.log('Element entered viewport')
 * });
 *
 * return <div ref={ref}>{isVisible ? 'Visible' : 'Not visible'}</div>;
 * ```
 */
export function useScrollAnimation({
  threshold = 0.5,
  rootMargin = '0px',
  onEnter,
  onExit,
  triggerOnce = false,
}: UseScrollAnimationOptions = {}): UseScrollAnimationReturn {
  const shouldReduceMotion = useReducedMotion();
  // Initialize state based on reduced motion preference
  const [isVisible, setIsVisible] = useState(() => shouldReduceMotion);
  const elementRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  // Callback ref to set the element
  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  // Handle reduced motion case separately to avoid synchronous setState in effect
  useEffect(() => {
    if (shouldReduceMotion && elementRef.current) {
      // State is already initialized to true, just handle callbacks
      if (onEnter && !hasTriggeredRef.current) {
        onEnter();
        if (triggerOnce) {
          hasTriggeredRef.current = true;
        }
      }
    }
  }, [shouldReduceMotion, onEnter, triggerOnce]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip observer setup if reduced motion is enabled
    if (shouldReduceMotion) {
      return;
    }

    // Create IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;

          if (isIntersecting) {
            setIsVisible(true);
            if (onEnter && (!triggerOnce || !hasTriggeredRef.current)) {
              onEnter();
              if (triggerOnce) {
                hasTriggeredRef.current = true;
              }
            }
          } else {
            setIsVisible(false);
            if (onExit) {
              onExit();
            }
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);
    observerRef.current = observer;

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, onEnter, onExit, triggerOnce, shouldReduceMotion]);

  return { isVisible, ref };
}

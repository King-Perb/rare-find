/**
 * useInViewport Hook
 *
 * Hook to detect when an element enters the viewport using Intersection Observer
 */

import { useEffect, useRef, useState } from 'react';

export interface UseInViewportOptions {
  /** Threshold for intersection (0-1, default: 0.1 means 10% visible) */
  threshold?: number;
  /** Root margin for intersection observer (default: '0px') */
  rootMargin?: string;
  /** Whether to trigger only once (default: false) */
  once?: boolean;
}

/**
 * Hook to detect when an element is in the viewport
 *
 * @param options - Configuration options for viewport detection
 * @returns A tuple of [ref, isInViewport] where:
 *   - ref: Ref to attach to the element you want to observe
 *   - isInViewport: Boolean indicating if the element is currently in viewport
 *
 * @example
 * ```tsx
 * const [ref, isInViewport] = useInViewport();
 *
 * return (
 *   <div ref={ref}>
 *     {isInViewport && <AnimatedComponent />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * const [ref, isInViewport] = useInViewport({ threshold: 0.5, once: true });
 *
 * return (
 *   <div ref={ref}>
 *     {isInViewport && <CountUpAnimation />}
 *   </div>
 * );
 * ```
 */
export function useInViewport({
  threshold = 0.1,
  rootMargin = '0px',
  once = false,
}: UseInViewportOptions = {}): [React.RefObject<HTMLElement | null>, boolean] {
  const [isInViewport, setIsInViewport] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    // If once is true and we've already triggered, don't set up observer
    if (once && hasTriggeredRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
            if (once) {
              hasTriggeredRef.current = true;
            }
          } else if (!once) {
            // Only update to false if not using once mode
            setIsInViewport(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [ref, isInViewport];
}

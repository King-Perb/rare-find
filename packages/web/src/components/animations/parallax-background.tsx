/**
 * ParallaxBackground Component
 *
 * Component that creates parallax effects with background elements
 * Different layers move at different speeds based on scroll position
 * Respects reduced motion preferences and optimizes for 60fps
 */

'use client';

import { useScroll, motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useEffect, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  GradientBlob,
  CircleCluster,
  CircleClusterAlt,
  FloatingDots,
} from './parallax-assets';

export interface ParallaxBackgroundProps {
  /** Child elements to render on top of parallax background */
  readonly children?: ReactNode;
  /** Custom className */
  readonly className?: string;
  /** Disable parallax effects */
  readonly disabled?: boolean;
  /** Debug mode - increases opacity for testing */
  readonly debug?: boolean;
}

/**
 * ParallaxBackground component
 *
 * Creates a multi-layer parallax effect with background elements moving at different speeds.
 * Far background moves slowest, near background moves fastest.
 * Respects reduced motion preferences.
 *
 * @example
 * ```tsx
 * <ParallaxBackground>
 *   <div>Your content here</div>
 * </ParallaxBackground>
 * ```
 */
export function ParallaxBackground({
  children,
  className = '',
  disabled = false,
  debug = false,
}: ParallaxBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  // Use window scroll to track scroll position
  const { scrollY } = useScroll();

  // Store the last scroll position to calculate deltas
  const lastScrollY = useRef(0);

  // Use motion values to store current transform positions
  // This preserves state when content changes dynamically
  const midY = useMotionValue(0);
  const nearY = useMotionValue(0);
  const farXLeft = useMotionValue(0);
  const farXRight = useMotionValue(0);
  const farXLeftMobile = useMotionValue(0);
  const farXRightMobile = useMotionValue(0);
  const midXLeft = useMotionValue(0);
  const midXRight = useMotionValue(0);
  const midXLeftMobile = useMotionValue(0);
  const midXRightMobile = useMotionValue(0);
  const clusterScale = useMotionValue(1);

  // Disable parallax if reduced motion is enabled or component is disabled
  const isParallaxDisabled = disabled || shouldReduceMotion;

  // Initialize scroll position on mount
  useEffect(() => {
    lastScrollY.current = scrollY.get();
  }, [scrollY]);

  // Update parallax positions based on scroll deltas
  // This preserves position when content is added/removed
  useAnimationFrame(() => {
    if (isParallaxDisabled) {
      // Reset to initial positions when disabled
      midY.set(0);
      nearY.set(0);
      farXLeft.set(0);
      farXRight.set(0);
      farXLeftMobile.set(0);
      farXRightMobile.set(0);
      midXLeft.set(0);
      midXRight.set(0);
      midXLeftMobile.set(0);
      midXRightMobile.set(0);
      clusterScale.set(1);
      return;
    }

    const currentScrollY = scrollY.get();
    const deltaY = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    // Update positions based on scroll delta, not absolute position
    // This prevents position reset when content changes
    // Increased speeds for more pronounced parallax effect
    const midSpeed = 0.2; // Mid background moves at 20% of scroll speed
    const nearSpeed = 0.5; // Near background moves at 50% of scroll speed (fastest)
    const farXSpeed = 0.15; // Far background horizontal: 15% of scroll speed
    const midXSpeed = 0.2; // Mid background horizontal: 20% of scroll speed

    midY.set(midY.get() - deltaY * midSpeed);
    nearY.set(nearY.get() - deltaY * nearSpeed);

    // Horizontal movements (desktop)
    farXLeft.set(farXLeft.get() - deltaY * farXSpeed);
    farXRight.set(farXRight.get() + deltaY * farXSpeed);
    midXLeft.set(midXLeft.get() - deltaY * midXSpeed);
    midXRight.set(midXRight.get() + deltaY * midXSpeed);

    // Horizontal movements (mobile) - smaller amounts (75% of desktop)
    farXLeftMobile.set(farXLeftMobile.get() - deltaY * farXSpeed * 0.75);
    farXRightMobile.set(farXRightMobile.get() + deltaY * farXSpeed * 0.75);
    midXLeftMobile.set(midXLeftMobile.get() - deltaY * midXSpeed * 0.75);
    midXRightMobile.set(midXRightMobile.get() + deltaY * midXSpeed * 0.75);

    // Scale based on scroll - matches original [1, 1.3] at full scroll
    // Original reached 1.3 at scrollYProgress = 1, so we approximate based on typical page height
    const typicalPageHeight = 2000; // Approximate typical scrollable height
    const scaleProgress = Math.min(1, currentScrollY / typicalPageHeight);
    const newScale = 1 + (scaleProgress * 0.3); // Scale from 1 to 1.3
    clusterScale.set(newScale);
  });

  // When parallax is disabled, ensure transforms are explicitly set to 0
  // GradientBlobs: no vertical movement, only horizontal
  const farY = 0; // GradientBlobs stay vertically fixed

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Far Background Layer - Moves Slowest */}
      {/* Desktop: Left blob - moves left (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXLeft,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 -left-1/2 -translate-y-1/2"
          opacity={debug ? 0.5 : 0.3}
        />
      </motion.div>
      {/* Mobile: Left blob - moves left (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXLeftMobile,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 left-0 -translate-y-1/2"
          opacity={debug ? 0.5 : 0.4}
        />
      </motion.div>
      {/* Desktop: Right blob - moves right (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXRight,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 -right-1/3 -translate-y-1/2"
          opacity={debug ? 0.45 : 0.25}
        />
      </motion.div>
      {/* Mobile: Right blob - moves right (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXRightMobile,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 right-0 -translate-y-1/2"
          opacity={debug ? 0.5 : 0.4}
        />
      </motion.div>

      {/* Mid Background Layer - Moves at Medium Speed */}
      {/* Desktop: Left Circle Cluster - moves left, spreads on scroll */}
      <motion.div
        style={{
          y: midY,
          x: midXLeft,
          scale: clusterScale,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleCluster
          className="absolute bottom-40 left-40"
          opacity={debug ? 0.5 : 0.3}
        />
      </motion.div>
      {/* Mobile: Left Circle Cluster - moves left, spreads on scroll */}
      <motion.div
        style={{
          y: midY,
          x: midXLeftMobile,
          scale: clusterScale,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleCluster
          className="absolute bottom-32 left-4 scale-75"
          opacity={debug ? 0.5 : 0.3}
        />
      </motion.div>
      {/* Desktop: Right Circle Cluster - moves right, spreads on scroll, different configuration */}
      <motion.div
        style={{
          y: midY,
          x: midXRight,
          scale: clusterScale,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleClusterAlt
          className="absolute top-20 right-20"
          opacity={debug ? 0.55 : 0.35}
        />
      </motion.div>
      {/* Mobile: Right Circle Cluster - moves right, spreads on scroll, different configuration */}
      <motion.div
        style={{
          y: midY,
          x: midXRightMobile,
          scale: clusterScale,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleClusterAlt
          className="absolute top-4 right-4 scale-75"
          opacity={debug ? 0.55 : 0.35}
        />
      </motion.div>

      {/* Near Background Layer - Moves Fastest */}
      {/* Desktop: FloatingDots */}
      <motion.div
        style={{
          y: nearY,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingDots
          className="absolute top-1/4 left-1/4"
          opacity={debug ? 0.6 : 0.4}
        />
        <FloatingDots
          className="absolute bottom-1/4 right-1/4"
          opacity={debug ? 0.55 : 0.35}
        />
      </motion.div>
      {/* Mobile: FloatingDots - adjusted positioning */}
      <motion.div
        style={{
          y: nearY,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <FloatingDots
          className="absolute top-1/4 left-4 scale-75"
          opacity={debug ? 0.6 : 0.4}
        />
        <FloatingDots
          className="absolute bottom-1/4 right-4 scale-75"
          opacity={debug ? 0.55 : 0.35}
        />
      </motion.div>

      {/* Content Layer - Renders on top of parallax background */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

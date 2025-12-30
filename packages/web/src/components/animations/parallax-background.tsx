/**
 * ParallaxBackground Component
 *
 * Component that creates parallax effects with background elements
 * Different layers move at different speeds based on scroll position
 * Respects reduced motion preferences and optimizes for 60fps
 */

'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
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
  // Use window scroll instead of container scroll for full-page parallax
  // When no target is specified, it tracks the window scroll
  const { scrollYProgress } = useScroll();

  // Disable parallax if reduced motion is enabled or component is disabled
  const isParallaxDisabled = disabled || shouldReduceMotion;

  // Different parallax speeds for different layers
  // Far background (GradientBlob) - no vertical movement, only horizontal
  // Mid background (0.5x speed) - moves at medium speed
  // Near background (0.8x speed) - moves fastest
  // When parallax is disabled, use constant 0 values
  const midBackgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -250] // Negative for upward movement, faster
  );
  const nearBackgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -600] // Negative for upward movement (to the top)
  );

  // Horizontal parallax for some elements
  // Gradient Blob: move outward (off-screen) as user scrolls
  // Left blob moves left (negative), right blob moves right (positive)
  const farBackgroundXLeft = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -200] // Move left (off-screen)
  );
  const farBackgroundXRight = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 200] // Move right (off-screen)
  );
  // Circle Cluster: left moves left, right moves right
  const midBackgroundXLeft = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -250] // Left cluster moves left
  );
  const midBackgroundXRight = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 250] // Right cluster moves right
  );

  // Scale transform to make circles spread slightly as user scrolls
  const circleClusterScale = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [1, 1] : [1, 1.15] // Scale from 1 to 1.15 (15% larger = spreading)
  );

  // When parallax is disabled, ensure transforms are explicitly set to 0
  // GradientBlobs: no vertical movement, only horizontal
  const farY = 0; // GradientBlobs stay vertically fixed
  const midY = isParallaxDisabled ? 0 : midBackgroundY;
  const nearY = isParallaxDisabled ? 0 : nearBackgroundY;
  const farXLeft = isParallaxDisabled ? 0 : farBackgroundXLeft;
  const farXRight = isParallaxDisabled ? 0 : farBackgroundXRight;
  const midXLeft = isParallaxDisabled ? 0 : midBackgroundXLeft;
  const midXRight = isParallaxDisabled ? 0 : midBackgroundXRight;
  const clusterScale = isParallaxDisabled ? 1 : circleClusterScale;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Far Background Layer - Moves Slowest */}
      {/* Left blob - moves left (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXLeft,
        }}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 -left-1/2 -translate-y-1/2"
          opacity={debug ? 0.5 : 0.3}
        />
      </motion.div>
      {/* Right blob - moves right (off-screen) as user scrolls */}
      <motion.div
        style={{
          y: farY,
          x: farXRight,
        }}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <GradientBlob
          className="absolute top-1/2 -right-1/3 -translate-y-1/2"
          opacity={debug ? 0.45 : 0.25}
        />
      </motion.div>

      {/* Mid Background Layer - Moves at Medium Speed */}
      {/* Left Circle Cluster - moves left, spreads on scroll */}
      <motion.div
        style={{
          y: midY,
          x: midXLeft,
          scale: clusterScale,
        }}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleCluster
          className="absolute bottom-40 left-40"
          opacity={debug ? 0.5 : 0.3}
        />
      </motion.div>
      {/* Right Circle Cluster - moves right, spreads on scroll, different configuration */}
      <motion.div
        style={{
          y: midY,
          x: midXRight,
          scale: clusterScale,
        }}
        className="fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <CircleClusterAlt
          className="absolute top-20 right-20"
          opacity={debug ? 0.55 : 0.35}
        />
      </motion.div>

      {/* Near Background Layer - Moves Fastest */}
      <motion.div
        style={{
          y: nearY,
        }}
        className="fixed inset-0 pointer-events-none"
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

      {/* Content Layer - Renders on top of parallax background */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

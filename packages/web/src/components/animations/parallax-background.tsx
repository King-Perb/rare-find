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
  // Desktop: larger movement, Mobile: smaller movement
  const farBackgroundXLeft = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -200] // Move left (off-screen) - desktop
  );
  const farBackgroundXRight = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 200] // Move right (off-screen) - desktop
  );
  // Mobile: smaller movement amounts
  const farBackgroundXLeftMobile = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -150] // Move left (off-screen) - mobile
  );
  const farBackgroundXRightMobile = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 150] // Move right (off-screen) - mobile
  );
  // Circle Cluster: left moves left, right moves right
  const midBackgroundXLeft = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -250] // Left cluster moves left - desktop
  );
  const midBackgroundXRight = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 250] // Right cluster moves right - desktop
  );
  // Mobile: smaller movement amounts
  const midBackgroundXLeftMobile = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, -150] // Left cluster moves left - mobile
  );
  const midBackgroundXRightMobile = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [0, 0] : [0, 150] // Right cluster moves right - mobile
  );

  // Scale transform to make circles spread/zoom out more as user scrolls
  const circleClusterScale = useTransform(
    scrollYProgress,
    [0, 1],
    isParallaxDisabled ? [1, 1] : [1, 1.3] // Scale from 1 to 1.3 (30% larger = more zoom out)
  );

  // When parallax is disabled, ensure transforms are explicitly set to 0
  // GradientBlobs: no vertical movement, only horizontal
  const farY = 0; // GradientBlobs stay vertically fixed
  const midY = isParallaxDisabled ? 0 : midBackgroundY;
  const nearY = isParallaxDisabled ? 0 : nearBackgroundY;
  const farXLeft = isParallaxDisabled ? 0 : farBackgroundXLeft;
  const farXRight = isParallaxDisabled ? 0 : farBackgroundXRight;
  const farXLeftMobile = isParallaxDisabled ? 0 : farBackgroundXLeftMobile;
  const farXRightMobile = isParallaxDisabled ? 0 : farBackgroundXRightMobile;
  const midXLeft = isParallaxDisabled ? 0 : midBackgroundXLeft;
  const midXRight = isParallaxDisabled ? 0 : midBackgroundXRight;
  const midXLeftMobile = isParallaxDisabled ? 0 : midBackgroundXLeftMobile;
  const midXRightMobile = isParallaxDisabled ? 0 : midBackgroundXRightMobile;
  const clusterScale = isParallaxDisabled ? 1 : circleClusterScale;

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

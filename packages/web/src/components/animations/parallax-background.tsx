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

// Parallax speed constants
const PARALLAX_SPEEDS = {
  midY: 0.2, // Mid background vertical: 20% of scroll speed
  nearY: 0.5, // Near background vertical: 50% of scroll speed (fastest)
  farX: 0.15, // Far background horizontal: 15% of scroll speed
  midX: 0.2, // Mid background horizontal: 20% of scroll speed
  mobileMultiplier: 0.75, // Mobile uses 75% of desktop speeds
} as const;

// Scale configuration
const SCALE_CONFIG = {
  min: 1,
  max: 1.3,
  typicalPageHeight: 2000, // Approximate typical scrollable height
} as const;


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
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  // Create motion values for all parallax layers
  // Left elements move left (negative), right elements move right (positive)
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

  // Group motion values for easier reset
  const allMotionValues = [
    { value: midY, initial: 0 },
    { value: nearY, initial: 0 },
    { value: farXLeft, initial: 0 },
    { value: farXRight, initial: 0 },
    { value: farXLeftMobile, initial: 0 },
    { value: farXRightMobile, initial: 0 },
    { value: midXLeft, initial: 0 },
    { value: midXRight, initial: 0 },
    { value: midXLeftMobile, initial: 0 },
    { value: midXRightMobile, initial: 0 },
    { value: clusterScale, initial: 1 },
  ];

  const isParallaxDisabled = disabled || shouldReduceMotion;

  // Initialize scroll position on mount
  useEffect(() => {
    lastScrollY.current = scrollY.get();
  }, [scrollY]);

  // Reset all motion values to initial state
  const resetAllLayers = () => {
    allMotionValues.forEach(({ value, initial }) => value.set(initial));
  };

  // Update parallax positions based on scroll deltas
  // This preserves position when content is added/removed
  useAnimationFrame(() => {
    if (isParallaxDisabled) {
      resetAllLayers();
      return;
    }

    const currentScrollY = scrollY.get();
    const deltaY = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    // Update vertical positions
    midY.set(midY.get() - deltaY * PARALLAX_SPEEDS.midY);
    nearY.set(nearY.get() - deltaY * PARALLAX_SPEEDS.nearY);

    // Update horizontal positions (desktop)
    // Left elements move left (negative), right elements move right (positive)
    farXLeft.set(farXLeft.get() - deltaY * PARALLAX_SPEEDS.farX);
    farXRight.set(farXRight.get() + deltaY * PARALLAX_SPEEDS.farX);
    midXLeft.set(midXLeft.get() - deltaY * PARALLAX_SPEEDS.midX);
    midXRight.set(midXRight.get() + deltaY * PARALLAX_SPEEDS.midX);

    // Update horizontal positions (mobile) - 75% of desktop speed
    farXLeftMobile.set(farXLeftMobile.get() - deltaY * PARALLAX_SPEEDS.farX * PARALLAX_SPEEDS.mobileMultiplier);
    farXRightMobile.set(farXRightMobile.get() + deltaY * PARALLAX_SPEEDS.farX * PARALLAX_SPEEDS.mobileMultiplier);
    midXLeftMobile.set(midXLeftMobile.get() - deltaY * PARALLAX_SPEEDS.midX * PARALLAX_SPEEDS.mobileMultiplier);
    midXRightMobile.set(midXRightMobile.get() + deltaY * PARALLAX_SPEEDS.midX * PARALLAX_SPEEDS.mobileMultiplier);

    // Update scale based on scroll
    const scaleProgress = Math.min(1, currentScrollY / SCALE_CONFIG.typicalPageHeight);
    const newScale = SCALE_CONFIG.min + (scaleProgress * (SCALE_CONFIG.max - SCALE_CONFIG.min));
    clusterScale.set(newScale);
  });

  // Helper to create parallax element with responsive variants
  const createParallaxElement = (
    Component: typeof GradientBlob | typeof CircleCluster | typeof CircleClusterAlt | typeof FloatingDots,
    config: {
      desktop: { className: string; opacity: number; x?: ReturnType<typeof useMotionValue<number>> | number; y?: ReturnType<typeof useMotionValue<number>> | number; scale?: ReturnType<typeof useMotionValue<number>> };
      mobile: { className: string; opacity: number; x?: ReturnType<typeof useMotionValue<number>> | number; y?: ReturnType<typeof useMotionValue<number>> | number; scale?: ReturnType<typeof useMotionValue<number>> };
    }
  ) => (
    <>
      <motion.div
        style={{
          y: config.desktop.y ?? 0,
          x: config.desktop.x ?? 0,
          scale: config.desktop.scale,
        }}
        className="hidden md:block fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <Component
          className={config.desktop.className}
          opacity={debug ? config.desktop.opacity * 1.5 : config.desktop.opacity}
        />
      </motion.div>
      <motion.div
        style={{
          y: config.mobile.y ?? 0,
          x: config.mobile.x ?? 0,
          scale: config.mobile.scale,
        }}
        className="md:hidden fixed inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <Component
          className={config.mobile.className}
          opacity={debug ? config.mobile.opacity * 1.5 : config.mobile.opacity}
        />
      </motion.div>
    </>
  );

  const farY = 0; // GradientBlobs stay vertically fixed

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Far Background Layer - Moves Slowest */}
      {createParallaxElement(GradientBlob, {
        desktop: {
          className: 'absolute top-1/2 -left-1/2 -translate-y-1/2',
          opacity: 0.3,
          y: farY,
          x: farXLeft,
        },
        mobile: {
          className: 'absolute top-1/2 left-0 -translate-y-1/2',
          opacity: 0.4,
          y: farY,
          x: farXLeftMobile,
        },
      })}
      {createParallaxElement(GradientBlob, {
        desktop: {
          className: 'absolute top-1/2 -right-1/3 -translate-y-1/2',
          opacity: 0.25,
          y: farY,
          x: farXRight,
        },
        mobile: {
          className: 'absolute top-1/2 right-0 -translate-y-1/2',
          opacity: 0.4,
          y: farY,
          x: farXRightMobile,
        },
      })}

      {/* Mid Background Layer - Moves at Medium Speed */}
      {createParallaxElement(CircleCluster, {
        desktop: {
          className: 'absolute bottom-40 left-40',
          opacity: 0.3,
          y: midY,
          x: midXLeft,
          scale: clusterScale,
        },
        mobile: {
          className: 'absolute bottom-32 left-4 scale-75',
          opacity: 0.3,
          y: midY,
          x: midXLeftMobile,
          scale: clusterScale,
        },
      })}
      {createParallaxElement(CircleClusterAlt, {
        desktop: {
          className: 'absolute top-20 right-20',
          opacity: 0.35,
          y: midY,
          x: midXRight,
          scale: clusterScale,
        },
        mobile: {
          className: 'absolute top-4 right-4 scale-75',
          opacity: 0.35,
          y: midY,
          x: midXRightMobile,
          scale: clusterScale,
        },
      })}

      {/* Near Background Layer - Moves Fastest */}
      {createParallaxElement(FloatingDots, {
        desktop: {
          className: 'absolute top-1/4 left-1/4',
          opacity: 0.4,
          y: nearY,
        },
        mobile: {
          className: 'absolute top-1/4 left-4 scale-75',
          opacity: 0.4,
          y: nearY,
        },
      })}
      {createParallaxElement(FloatingDots, {
        desktop: {
          className: 'absolute bottom-1/4 right-1/4',
          opacity: 0.35,
          y: nearY,
        },
        mobile: {
          className: 'absolute bottom-1/4 right-4 scale-75',
          opacity: 0.35,
          y: nearY,
        },
      })}

      {/* Content Layer - Renders on top of parallax background */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

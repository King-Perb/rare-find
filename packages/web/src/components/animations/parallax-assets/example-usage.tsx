/**
 * Example Usage of Parallax Assets
 *
 * This file demonstrates how to use parallax assets in a parallax background component
 */

'use client';

import React from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  GradientBlob,
  CircleCluster,
  FloatingDots,
  MagnifyingGlass,
  PriceTag,
  Sparkle,
} from './index';

/**
 * Example Parallax Background Component
 *
 * This shows how to implement parallax effects using the assets
 */
export function ExampleParallaxBackground() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Different parallax speeds for different layers
  // Far background moves slower (0.2x), near background moves faster (0.8x)
  const farBackgroundY = useTransform(scrollY, [0, 1000], [0, 200]);
  const midBackgroundY = useTransform(scrollY, [0, 1000], [0, 500]);
  const nearBackgroundY = useTransform(scrollY, [0, 1000], [0, 800]);

  // Disable parallax if user prefers reduced motion
  const farY = shouldReduceMotion ? 0 : farBackgroundY;
  const midY = shouldReduceMotion ? 0 : midBackgroundY;
  const nearY = shouldReduceMotion ? 0 : nearBackgroundY;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Far Background Layer - Moves Slowest */}
      <motion.div
        style={{ y: farY }}
        className="absolute inset-0 pointer-events-none"
      >
        <GradientBlob
          className="absolute -top-32 -left-32"
          opacity={0.1}
        />
        <GradientBlob
          className="absolute -bottom-32 -right-32"
          opacity={0.08}
        />
      </motion.div>

      {/* Mid Background Layer - Moves at Medium Speed */}
      <motion.div
        style={{ y: midY }}
        className="absolute inset-0 pointer-events-none"
      >
        <CircleCluster
          className="absolute top-20 right-20"
          opacity={0.15}
        />
        <CircleCluster
          className="absolute bottom-40 left-40"
          opacity={0.12}
        />
      </motion.div>

      {/* Near Background Layer - Moves Fastest */}
      <motion.div
        style={{ y: nearY }}
        className="absolute inset-0 pointer-events-none"
      >
        <FloatingDots
          className="absolute top-1/4 left-1/4"
          opacity={0.2}
        />
        <FloatingDots
          className="absolute bottom-1/4 right-1/4"
          opacity={0.18}
        />

        {/* Theme Icons */}
        <div className="absolute top-1/3 right-1/3">
          <MagnifyingGlass size={120} opacity={0.12} />
        </div>
        <div className="absolute bottom-1/3 left-1/3">
          <PriceTag size={100} opacity={0.12} />
        </div>
        <div className="absolute top-1/2 right-1/4">
          <Sparkle size={80} opacity={0.15} />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Simple Static Background Example
 *
 * For cases where you don't need scroll-based parallax
 */
export function SimpleParallaxBackground() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-50 dark:bg-black">
      {/* Static background elements */}
      <GradientBlob
        className="absolute -top-32 -left-32"
        opacity={0.08}
      />
      <CircleCluster
        className="absolute top-20 right-20"
        opacity={0.12}
      />
      <FloatingDots
        className="absolute bottom-20 left-20"
        opacity={0.15}
      />

      {/* Content goes here */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your Content Here</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Parallax assets provide subtle background depth
          </p>
        </div>
      </div>
    </div>
  );
}

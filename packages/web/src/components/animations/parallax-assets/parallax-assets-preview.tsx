/**
 * Parallax Assets Preview
 *
 * Preview component to visualize all parallax assets
 * Useful for testing and selecting which assets to use
 */

'use client';

import React from 'react';
import {
  GradientBlob,
  CircleCluster,
  FloatingDots,
  WavePattern,
  HexagonGrid,
  MagnifyingGlass,
  PriceTag,
  Coin,
  Sparkle,
  TrendingUp,
  Shield,
} from './index';

export function ParallaxAssetsPreview() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 space-y-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Parallax Assets Preview</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Preview all available parallax assets. These can be used directly in React or exported as PNGs.
        </p>

        {/* Geometric Shapes Section */}
        <section className="space-y-8 mb-16">
          <h2 className="text-2xl font-semibold mb-4">Geometric Shapes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gradient Blob */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-4">Gradient Blob</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Large organic blob - use for far background (slow parallax)
              </p>
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <GradientBlob className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Circle Cluster */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-4">Circle Cluster</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Medium circles - use for mid background (medium parallax)
              </p>
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <CircleCluster className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Floating Dots */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-4">Floating Dots</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Small dots - use for near background (fast parallax)
              </p>
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <FloatingDots className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Wave Pattern */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium mb-4">Wave Pattern</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Horizontal wave - use for horizontal parallax
              </p>
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <WavePattern className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Hexagon Grid */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 md:col-span-2">
              <h3 className="font-medium mb-4">Hexagon Grid</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                Subtle grid texture - use for background texture
              </p>
              <div className="relative h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <HexagonGrid className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </section>

        {/* Theme Icons Section */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Theme Icons</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { Component: MagnifyingGlass, name: 'Magnifying Glass', description: 'Search/discovery theme' },
              { Component: PriceTag, name: 'Price Tag', description: 'Bargain/deal theme' },
              { Component: Coin, name: 'Coin', description: 'Value/currency theme' },
              { Component: Sparkle, name: 'Sparkle', description: 'Highlight/deal theme' },
              { Component: TrendingUp, name: 'Trending Up', description: 'Market value theme' },
              { Component: Shield, name: 'Shield', description: 'Trust/confidence theme' },
            ].map(({ Component, name, description }) => (
              <div
                key={name}
                className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center"
              >
                <h3 className="font-medium mb-2">{name}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{description}</p>
                <div className="relative h-32 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                  <Component size={80} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

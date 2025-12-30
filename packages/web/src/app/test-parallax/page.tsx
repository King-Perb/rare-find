/**
 * Parallax Test/Debug Page
 *
 * Test page to visualize parallax background elements
 * Shows all elements with increased opacity for testing
 */

'use client';

import { ParallaxBackground } from '@/components/animations/parallax-background';
import { useState } from 'react';

export default function TestParallaxPage() {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Debug Controls */}
      <div className="fixed top-4 right-4 z-50 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium">Debug Mode (Higher Opacity)</span>
        </label>
      </div>

      {/* Test Parallax Background */}
      <ParallaxBackground className="w-full min-h-screen" debug={debugMode}>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
          <div className="max-w-4xl w-full space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
                Parallax Background Test
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                Scroll down to see parallax effects. Toggle debug mode to see elements more clearly.
              </p>
            </div>

            {/* Content sections to enable scrolling */}
            <div className="space-y-32">
              <section className="p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-semibold mb-4">Section 1</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  This section helps you see the parallax effect. The background elements should move
                  at different speeds as you scroll.
                </p>
              </section>

              <section className="p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-semibold mb-4">Section 2</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Keep scrolling to observe the parallax movement. Far background moves slowest, near
                  background moves fastest.
                </p>
              </section>

              <section className="p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-semibold mb-4">Section 3</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  All parallax elements should be visible in the background. Check the browser
                  inspector to see the SVG elements.
                </p>
              </section>

              <section className="p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-semibold mb-4">Section 4</h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  End of test page. Scroll back up to see the parallax effect in reverse.
                </p>
              </section>
            </div>
          </div>
        </div>
      </ParallaxBackground>
    </div>
  );
}

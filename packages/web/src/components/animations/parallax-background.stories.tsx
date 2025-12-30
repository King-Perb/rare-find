/**
 * Storybook Stories for ParallaxBackground Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ParallaxBackground } from './parallax-background';

const meta: Meta<typeof ParallaxBackground> = {
  title: 'Animations/ParallaxBackground',
  component: ParallaxBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Component that creates parallax effects with background elements. Different layers move at different speeds based on scroll position. Respects reduced motion preferences and optimizes for 60fps.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ParallaxBackground>;

export const Default: Story = {
  render: () => (
    <div className="h-screen">
      <ParallaxBackground className="h-full">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-bold mb-4">Parallax Background</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Scroll to see the parallax effect. Background elements move at different speeds.
            </p>
          </div>
        </div>
      </ParallaxBackground>
      <div className="h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Keep scrolling to see parallax effect</p>
      </div>
      <div className="h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">End of parallax section</p>
      </div>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div className="h-screen">
      <ParallaxBackground className="h-full">
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">
              Hero Section
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              This hero section has a parallax background. The background elements move slower than
              the foreground content, creating a sense of depth.
            </p>
          </div>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
      </ParallaxBackground>
      <div className="h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Scroll to see parallax effect</p>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="h-screen">
      <ParallaxBackground disabled className="h-full">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-bold mb-4">Parallax Disabled</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Parallax effects are disabled. Background elements remain static.
            </p>
          </div>
        </div>
      </ParallaxBackground>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  render: () => (
    <div className="h-screen">
      <ParallaxBackground className="h-full bg-gradient-to-b from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-black">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white/80 dark:bg-zinc-900/80 rounded-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-bold mb-4">Custom Background</h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Parallax background with custom gradient background.
            </p>
          </div>
        </div>
      </ParallaxBackground>
    </div>
  ),
};

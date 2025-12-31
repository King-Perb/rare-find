/**
 * Storybook Stories for ScrollReveal Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ScrollReveal } from './scroll-reveal';

const meta: Meta<typeof ScrollReveal> = {
  title: 'Animations/ScrollReveal',
  component: ScrollReveal,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Component that reveals its children with animation when scrolled into view. Uses IntersectionObserver to detect when element enters viewport. Respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScrollReveal>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-8 bg-blue-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Content that reveals on scroll</h2>
        <p className="text-zinc-600">
          This content will fade in and slide up when it comes into view. Scroll down to see the animation.
        </p>
      </div>
    ),
  },
};

export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-32">
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">Scroll down to see reveal animations</p>
      </div>
      <ScrollReveal>
        <div className="p-8 bg-blue-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Section 1</h2>
          <p className="text-zinc-600">This section reveals when scrolled into view.</p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="p-8 bg-green-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Section 2</h2>
          <p className="text-zinc-600">This section also reveals when scrolled into view.</p>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="p-8 bg-purple-100 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Section 3</h2>
          <p className="text-zinc-600">Each section animates independently.</p>
        </div>
      </ScrollReveal>
      <div className="h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-600">End of page</p>
      </div>
    </div>
  ),
};

export const WithCustomThreshold: Story = {
  args: {
    children: (
      <div className="p-8 bg-yellow-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Custom Threshold (0.3)</h2>
        <p className="text-zinc-600">
          This content will reveal when 30% of it is visible (instead of the default 50%).
        </p>
      </div>
    ),
    threshold: 0.3,
  },
};

export const WithRootMargin: Story = {
  args: {
    children: (
      <div className="p-8 bg-indigo-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Early Trigger (100px margin)</h2>
        <p className="text-zinc-600">
          This content will start animating 100px before it enters the viewport.
        </p>
      </div>
    ),
    rootMargin: '100px',
  },
};

export const TriggerOnce: Story = {
  args: {
    children: (
      <div className="p-8 bg-pink-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Trigger Once (default)</h2>
        <p className="text-zinc-600">
          This animation will only trigger once. Scroll past it and back - it won&apos;t re-animate.
        </p>
      </div>
    ),
    triggerOnce: true,
  },
};

export const TriggerMultiple: Story = {
  args: {
    children: (
      <div className="p-8 bg-teal-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Trigger Multiple Times</h2>
        <p className="text-zinc-600">
          This animation will trigger every time it enters the viewport. Scroll past and back to see it re-animate.
        </p>
      </div>
    ),
    triggerOnce: false,
  },
};

export const Disabled: Story = {
  args: {
    children: (
      <div className="p-8 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Animation Disabled</h2>
        <p className="text-zinc-600">This content appears immediately without animation.</p>
      </div>
    ),
    disabled: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Custom Styling</h2>
        <p className="text-zinc-600">Content with custom className applied.</p>
      </div>
    ),
    className: 'p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg',
  },
};

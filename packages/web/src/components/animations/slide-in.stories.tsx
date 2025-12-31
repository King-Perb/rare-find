/**
 * Storybook Stories for SlideIn Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SlideIn } from './slide-in';

const meta: Meta<typeof SlideIn> = {
  title: 'Animations/SlideIn',
  component: SlideIn,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Wrapper component that applies slide-in animation to its children. Supports multiple directions and respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SlideIn>;

export const SlideUp: Story = {
  args: {
    children: <div className="p-4 bg-blue-100 rounded-lg">Content that slides up</div>,
    direction: 'up',
  },
};

export const SlideDown: Story = {
  args: {
    children: <div className="p-4 bg-green-100 rounded-lg">Content that slides down</div>,
    direction: 'down',
  },
};

export const SlideLeft: Story = {
  args: {
    children: <div className="p-4 bg-purple-100 rounded-lg">Content that slides from left</div>,
    direction: 'left',
  },
};

export const SlideRight: Story = {
  args: {
    children: <div className="p-4 bg-yellow-100 rounded-lg">Content that slides from right</div>,
    direction: 'right',
  },
};

export const WithDelay: Story = {
  args: {
    children: <div className="p-4 bg-blue-100 rounded-lg">Content that slides up after 0.3s</div>,
    direction: 'up',
    delay: 0.3,
  },
};

export const Disabled: Story = {
  args: {
    children: <div className="p-4 bg-red-100 rounded-lg">Animation disabled</div>,
    direction: 'up',
    disabled: true,
  },
};

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SlideIn direction="up" delay={0}>
        <div className="p-4 bg-blue-100 rounded-lg">Slide Up</div>
      </SlideIn>
      <SlideIn direction="down" delay={0.1}>
        <div className="p-4 bg-green-100 rounded-lg">Slide Down</div>
      </SlideIn>
      <SlideIn direction="left" delay={0.2}>
        <div className="p-4 bg-purple-100 rounded-lg">Slide Left</div>
      </SlideIn>
      <SlideIn direction="right" delay={0.3}>
        <div className="p-4 bg-yellow-100 rounded-lg">Slide Right</div>
      </SlideIn>
    </div>
  ),
};

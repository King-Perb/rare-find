/**
 * Storybook Stories for FadeIn Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FadeIn } from './fade-in';

const meta: Meta<typeof FadeIn> = {
  title: 'Animations/FadeIn',
  component: FadeIn,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Wrapper component that applies fade-in animation to its children. Respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  args: {
    children: <div className="p-4 bg-blue-100 rounded-lg">Content that fades in</div>,
  },
};

export const WithDelay: Story = {
  args: {
    children: <div className="p-4 bg-green-100 rounded-lg">Content that fades in after 0.5s</div>,
    delay: 0.5,
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: <div>Content with custom styling</div>,
    className: 'p-6 bg-purple-100 rounded-xl',
  },
};

export const Disabled: Story = {
  args: {
    children: <div className="p-4 bg-yellow-100 rounded-lg">Animation disabled</div>,
    disabled: true,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FadeIn delay={0}>
        <div className="p-4 bg-blue-100 rounded-lg">Item 1</div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="p-4 bg-green-100 rounded-lg">Item 2</div>
      </FadeIn>
      <FadeIn delay={0.2}>
        <div className="p-4 bg-purple-100 rounded-lg">Item 3</div>
      </FadeIn>
    </div>
  ),
};

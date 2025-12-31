/**
 * Storybook Stories for StaggerContainer Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { StaggerContainer } from './stagger-container';

const meta: Meta<typeof StaggerContainer> = {
  title: 'Animations/StaggerContainer',
  component: StaggerContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Container component that applies stagger animation to its children, making them appear sequentially. Respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StaggerContainer>;

export const Default: Story = {
  args: {
    children: [
      <div key="1" className="p-4 bg-blue-100 rounded-lg mb-2">
        Item 1
      </div>,
      <div key="2" className="p-4 bg-green-100 rounded-lg mb-2">
        Item 2
      </div>,
      <div key="3" className="p-4 bg-purple-100 rounded-lg mb-2">
        Item 3
      </div>,
    ],
  },
};

export const WithCustomStaggerDelay: Story = {
  args: {
    children: [
      <div key="1" className="p-4 bg-blue-100 rounded-lg mb-2">
        Item 1 (0.2s delay)
      </div>,
      <div key="2" className="p-4 bg-green-100 rounded-lg mb-2">
        Item 2 (0.4s delay)
      </div>,
      <div key="3" className="p-4 bg-purple-100 rounded-lg mb-2">
        Item 3 (0.6s delay)
      </div>,
    ],
    staggerDelay: 0.2,
  },
};

export const WithInitialDelay: Story = {
  args: {
    children: [
      <div key="1" className="p-4 bg-blue-100 rounded-lg mb-2">
        Item 1
      </div>,
      <div key="2" className="p-4 bg-green-100 rounded-lg mb-2">
        Item 2
      </div>,
      <div key="3" className="p-4 bg-purple-100 rounded-lg mb-2">
        Item 3
      </div>,
    ],
    delay: 0.5,
  },
};

export const FeatureCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      <StaggerContainer>
        <div className="p-6 bg-white rounded-2xl border border-zinc-200 text-center">
          <div className="h-12 w-12 rounded-xl bg-blue-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Feature 1</h3>
          <p className="text-sm text-zinc-600">Description of feature 1</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-zinc-200 text-center">
          <div className="h-12 w-12 rounded-xl bg-green-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Feature 2</h3>
          <p className="text-sm text-zinc-600">Description of feature 2</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-zinc-200 text-center">
          <div className="h-12 w-12 rounded-xl bg-purple-100 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Feature 3</h3>
          <p className="text-sm text-zinc-600">Description of feature 3</p>
        </div>
      </StaggerContainer>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const Disabled: Story = {
  args: {
    children: [
      <div key="1" className="p-4 bg-yellow-100 rounded-lg mb-2">
        Item 1 (no animation)
      </div>,
      <div key="2" className="p-4 bg-yellow-100 rounded-lg mb-2">
        Item 2 (no animation)
      </div>,
      <div key="3" className="p-4 bg-yellow-100 rounded-lg mb-2">
        Item 3 (no animation)
      </div>,
    ],
    disabled: true,
  },
};

export const WithCustomClassName: Story = {
  args: {
    children: [
      <div key="1" className="p-4 bg-blue-100 rounded-lg">Item 1</div>,
      <div key="2" className="p-4 bg-green-100 rounded-lg">Item 2</div>,
      <div key="3" className="p-4 bg-purple-100 rounded-lg">Item 3</div>,
    ],
    className: 'flex flex-col gap-4',
  },
};

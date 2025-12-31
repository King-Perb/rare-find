/**
 * Storybook Stories for AnimatedButton Component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimatedButton } from './animated-button';

const meta: Meta<typeof AnimatedButton> = {
  title: 'Components/UI/AnimatedButton',
  component: AnimatedButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component with hover, click, and loading animations. Respects reduced motion preferences.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedButton>;

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Click me',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Click me',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Click me',
    variant: 'ghost',
  },
};

export const Loading: Story = {
  args: {
    children: 'Submit',
    isLoading: true,
    loadingText: 'Loading...',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Submit
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </>
    ),
    variant: 'primary',
  },
};

export const HoverInteraction: Story = {
  args: {
    children: 'Hover me',
    variant: 'primary',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Hover over button to trigger animation
    await userEvent.hover(button);
  },
};

export const ClickInteraction: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    onClick: () => {
      console.log('Button clicked!');
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    // Click button to trigger animation
    await userEvent.click(button);
  },
};

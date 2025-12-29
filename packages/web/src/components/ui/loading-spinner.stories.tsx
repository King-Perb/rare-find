import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LoadingSpinner } from './loading-spinner';

const meta = {
  title: 'Components/UI/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'Main loading message',
    },
    subtitle: {
      control: 'text',
      description: 'Optional secondary message',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the spinner',
    },
    variant: {
      control: 'select',
      options: ['simple', 'card'],
      description: 'Display variant',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: 'Loading...',
  },
};

export const Simple: Story = {
  args: {
    message: 'Loading...',
    variant: 'simple',
  },
};

export const Card: Story = {
  args: {
    message: 'Analyzing listing...',
    subtitle: 'Extracting data and evaluating market value',
    variant: 'card',
  },
};

export const Small: Story = {
  args: {
    message: 'Loading...',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    message: 'Loading...',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    message: 'Loading...',
    size: 'large',
  },
};

export const WithSubtitle: Story = {
  args: {
    message: 'Processing request...',
    subtitle: 'This may take a few seconds',
    variant: 'simple',
  },
};

export const CardWithSubtitle: Story = {
  args: {
    message: 'Analyzing listing...',
    subtitle: 'Extracting data and evaluating market value',
    variant: 'card',
  },
};

export const NoMessage: Story = {
  args: {
    message: undefined,
    variant: 'simple',
  },
};

export const EvaluationLoading: Story = {
  args: {
    message: 'Analyzing listing and generating evaluation...',
    variant: 'simple',
    size: 'medium',
  },
};

export const CardEvaluationLoading: Story = {
  args: {
    message: 'Analyzing listing...',
    subtitle: 'Extracting data and evaluating market value',
    variant: 'card',
    size: 'large',
  },
};

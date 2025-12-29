import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ErrorDisplay } from './error-display';

const meta = {
  title: 'Components/UI/ErrorDisplay',
  component: ErrorDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    id: {
      control: 'text',
      description: 'Optional ID for accessibility',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
  },
} satisfies Meta<typeof ErrorDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: 'This is an error message',
  },
};

export const LeftAligned: Story = {
  args: {
    error: 'This error message is left-aligned',
    align: 'left',
  },
};

export const CenterAligned: Story = {
  args: {
    error: 'This error message is center-aligned',
    align: 'center',
  },
};

export const RightAligned: Story = {
  args: {
    error: 'This error message is right-aligned',
    align: 'right',
  },
};

export const WithCustomId: Story = {
  args: {
    error: 'Error with custom ID for form validation',
    id: 'url-error',
  },
};

export const WithCustomClassName: Story = {
  args: {
    error: 'Error with custom margin top',
    className: 'mt-3',
  },
};

export const LongErrorMessage: Story = {
  args: {
    error: 'This is a very long error message that might wrap to multiple lines. It demonstrates how the component handles longer text content and ensures readability.',
  },
};

export const EmptyError: Story = {
  args: {
    error: null,
  },
};

export const EmptyString: Story = {
  args: {
    error: '',
  },
};

export const ValidationError: Story = {
  args: {
    error: 'Please provide an Amazon or eBay listing URL',
    id: 'url-error',
    align: 'left',
  },
};

export const APIError: Story = {
  args: {
    error: 'Failed to fetch listing data. Please try again later.',
    id: 'api-error',
  },
};

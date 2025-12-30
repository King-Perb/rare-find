import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvaluationForm } from './evaluation-form';
import type { UseEvaluationReturn } from '@/hooks/use-evaluation';

// Mock evaluation hook for Storybook
const createMockEvaluation = (overrides?: Partial<UseEvaluationReturn>): UseEvaluationReturn => ({
  isLoading: false,
  error: null,
  result: null,
  listing: null,
  evaluateListing: async () => {
    // Mock implementation - does nothing in Storybook
  },
  setMockData: () => {
    // Mock implementation - does nothing in Storybook
  },
  reset: () => {
    // Mock implementation - does nothing in Storybook
  },
  ...overrides,
});

const meta = {
  title: 'Components/Evaluation/EvaluationForm',
  component: EvaluationForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the URL input',
    },
    submitText: {
      control: 'text',
      description: 'Text for the submit button',
    },
  },
} satisfies Meta<typeof EvaluationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    evaluation: createMockEvaluation(),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/listing url/i) || canvas.getByPlaceholderText(/paste amazon/i);

    // Test typing in input (covers onChange handler lines 152-153)
    await userEvent.type(input, 'https://www.amazon.com/dp/B08XYZ123');
  },
};

export const Loading: Story = {
  args: {
    evaluation: createMockEvaluation({
      isLoading: true,
    }),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const WithError: Story = {
  args: {
    evaluation: createMockEvaluation({
      error: 'Please provide an Amazon or eBay listing URL',
    }),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const WithResult: Story = {
  args: {
    evaluation: createMockEvaluation({
      result: {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 25.5,
          confidenceScore: 85,
          reasoning: 'This item appears to be undervalued based on recent market trends and condition.',
          factors: ['Recent sales data', 'Item condition', 'Market demand'],
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.0.0',
        evaluationMode: 'multimodal',
        evaluatedAt: new Date(),
      },
      listing: {
        id: 'test-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ123',
        title: 'Test Product',
        price: 120,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ123',
        available: true,
      },
    }),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    evaluation: createMockEvaluation(),
    placeholder: 'Enter your listing URL...',
    submitText: 'Analyze',
  },
};

export const HeroVariant: Story = {
  args: {
    evaluation: createMockEvaluation(),
    variant: 'hero',
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const HeroWithIcon: Story = {
  args: {
    evaluation: createMockEvaluation(),
    variant: 'hero',
    showIcon: true,
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const HeroWithHelperText: Story = {
  args: {
    evaluation: createMockEvaluation(),
    variant: 'hero',
    showHelperText: true,
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const HeroWithMockButton: Story = {
  args: {
    evaluation: createMockEvaluation(),
    variant: 'hero',
    showMockButton: true,
    onShowMock: () => {
      console.log('Show mock clicked');
    },
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const HeroLoading: Story = {
  args: {
    evaluation: createMockEvaluation({
      isLoading: true,
    }),
    variant: 'hero',
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const HeroWithError: Story = {
  args: {
    evaluation: createMockEvaluation({
      error: 'Invalid URL format',
    }),
    variant: 'hero',
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
};

export const WithCustomValidation: Story = {
  args: {
    evaluation: createMockEvaluation(),
    onValidate: (url: string) => {
      if (!url.includes('amazon.com') && !url.includes('ebay.com')) {
        return 'URL must be from Amazon or eBay';
      }
      return null;
    },
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/listing url/i) || canvas.getByPlaceholderText(/paste amazon/i);
    const submitButton = canvas.getByRole('button', { name: /evaluate listing/i });

    // Test typing and clearing error (covers onChange handler)
    await userEvent.type(input, 'test');
    await userEvent.clear(input);
    await userEvent.type(input, 'https://www.google.com');
    await userEvent.click(submitButton);
  },
};

export const WithResultAndReset: Story = {
  args: {
    evaluation: createMockEvaluation({
      result: {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 25.5,
          confidenceScore: 85,
          reasoning: 'This item appears to be undervalued.',
          factors: ['Recent sales data', 'Item condition'],
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.0.0',
        evaluationMode: 'multimodal',
        evaluatedAt: new Date(),
      },
      listing: {
        id: 'test-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ123',
        title: 'Test Product',
        price: 120,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ123',
        available: true,
      },
    }),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Test reset button click (covers handleReset function)
    const resetButton = canvas.getByRole('button', { name: /evaluate another listing/i });
    await userEvent.click(resetButton);
  },
};

// Add interaction test for form submission scenarios
export const FormSubmission: Story = {
  args: {
    evaluation: createMockEvaluation(),
    placeholder: 'Paste Amazon or eBay listing URL here...',
    submitText: 'Evaluate Listing',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(/listing url/i) || canvas.getByPlaceholderText(/paste amazon/i);
    const submitButton = canvas.getByRole('button', { name: /evaluate listing/i });

    // Test empty submission (covers validation in handleSubmit)
    await userEvent.click(submitButton);

    // Test invalid URL submission (covers URL validation)
    await userEvent.type(input, 'not-a-valid-url');
    await userEvent.click(submitButton);

    // Test valid URL submission (covers full submit flow)
    await userEvent.clear(input);
    await userEvent.type(input, 'https://www.amazon.com/dp/B08XYZ123');
    await userEvent.click(submitButton);
  },
};

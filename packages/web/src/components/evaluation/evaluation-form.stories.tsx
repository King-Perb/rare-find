import type { Meta, StoryObj } from '@storybook/nextjs-vite';
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


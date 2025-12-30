import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EvaluationResults } from './evaluation-results';
import type { EvaluationResult } from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';

// Mock data for stories
const mockListing: MarketplaceListing = {
  id: 'test-1',
  marketplace: 'amazon',
  marketplaceId: 'B08XYZ123',
  title: 'Vintage Collectible Item - Rare Edition',
  description: 'This is a rare collectible item in excellent condition. Perfect for collectors and enthusiasts.',
  price: 120,
  currency: 'USD',
  images: [
    'https://m.media-amazon.com/images/I/example1.jpg',
    'https://m.media-amazon.com/images/I/example2.jpg',
    'https://m.media-amazon.com/images/I/example3.jpg',
    'https://m.media-amazon.com/images/I/example4.jpg',
  ],
  category: 'Collectibles',
  condition: 'Like New',
  sellerName: 'TrustedSeller123',
  sellerRating: 98.5,
  listingUrl: 'https://www.amazon.com/dp/B08XYZ123',
  available: true,
};

const mockEvaluationResult: EvaluationResult = {
  evaluation: {
    estimatedMarketValue: 150,
    undervaluationPercentage: 25.5,
    confidenceScore: 85,
    reasoning: 'This item appears to be significantly undervalued based on recent market trends. The condition is excellent, and similar items have sold for $150-175 in the past 30 days. The seller has a high rating, which adds credibility. The item shows no signs of wear and appears authentic based on the provided images.',
    factors: [
      'Recent sales data shows similar items selling for $150-175',
      'Item condition is excellent with no visible wear',
      'Seller has high rating (98.5%) indicating reliability',
      'Market demand for this category is strong',
      'Item appears authentic based on images',
    ],
    isReplicaOrNovelty: false,
  },
  modelVersion: 'gpt-4o',
  promptVersion: '1.0.0',
  evaluationMode: 'multimodal',
  evaluatedAt: new Date(),
};

const meta = {
  title: 'Components/Evaluation/EvaluationResults',
  component: EvaluationResults,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EvaluationResults>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    result: mockEvaluationResult,
    listing: mockListing,
  },
};

export const GoodDeal: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        estimatedMarketValue: 200,
        undervaluationPercentage: 66.7,
        confidenceScore: 92,
        reasoning: 'This is an exceptional deal! The item is significantly undervalued and represents excellent value for money.',
      },
    },
    listing: {
      ...mockListing,
      price: 120,
    },
  },
};

export const Overpriced: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        estimatedMarketValue: 80,
        undervaluationPercentage: -33.3,
        confidenceScore: 75,
        reasoning: 'This item appears to be overpriced compared to recent market data. Similar items have sold for significantly less.',
      },
    },
    listing: {
      ...mockListing,
      price: 120,
    },
  },
};

export const ReplicaItem: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        estimatedMarketValue: 25,
        undervaluationPercentage: -58.3,
        confidenceScore: 88,
        reasoning: 'This item has been identified as a replica or novelty item, not an authentic collectible. The estimated value reflects its value as a replica, which is typically much lower than an authentic version.',
        isReplicaOrNovelty: true,
      },
    },
    listing: {
      ...mockListing,
      price: 60,
    },
  },
};

export const LowConfidence: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        confidenceScore: 45,
        reasoning: 'Limited market data available for this item. The evaluation is based on limited information and should be used with caution.',
      },
    },
    listing: mockListing,
  },
};

export const HighConfidence: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        confidenceScore: 95,
        reasoning: 'Extensive market data and clear indicators support this evaluation. High confidence in the accuracy of the estimated value.',
      },
    },
    listing: mockListing,
  },
};

export const MinimalListing: Story = {
  args: {
    result: mockEvaluationResult,
    listing: {
      ...mockListing,
      description: undefined,
      category: undefined,
      condition: undefined,
      sellerName: undefined,
      sellerRating: undefined,
      images: [],
    },
  },
};

export const WithAnimations: Story = {
  args: {
    result: mockEvaluationResult,
    listing: mockListing,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story demonstrates the animation features of EvaluationResults: results cards slide in from the right, metrics count up from zero, progress bars fill smoothly, and images fade in. All animations respect reduced motion preferences.',
      },
    },
  },
};

export const AnimationSequence: Story = {
  args: {
    result: mockEvaluationResult,
    listing: mockListing,
  },
  render: (args) => {
    // Simulate the animation sequence by showing the component
    // In a real scenario, you would see:
    // 1. Results card slides in from right with fade
    // 2. Metrics count up from 0 to their final values
    // 3. Progress bar fills smoothly
    // 4. Images fade in sequentially
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold mb-2">Animation Sequence:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-600">
            <li>Results card slides in from right with fade animation</li>
            <li>Metrics (market value, undervaluation %, confidence) count up from 0</li>
            <li>Progress bar fills smoothly based on confidence score</li>
            <li>Listing images fade in sequentially</li>
            <li>All animations respect reduced motion preferences</li>
          </ol>
        </div>
        <EvaluationResults result={args.result} listing={args.listing} />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the complete animation sequence: slide-in, count-up, progress fill, and image fade-in. Scroll to see the component and observe the animations.',
      },
    },
  },
};

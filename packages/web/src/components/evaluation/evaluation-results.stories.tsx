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
  price: 120.0,
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
    estimatedMarketValue: 150.0,
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
        estimatedMarketValue: 200.0,
        undervaluationPercentage: 66.7,
        confidenceScore: 92,
        reasoning: 'This is an exceptional deal! The item is significantly undervalued and represents excellent value for money.',
      },
    },
    listing: {
      ...mockListing,
      price: 120.0,
    },
  },
};

export const Overpriced: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        estimatedMarketValue: 80.0,
        undervaluationPercentage: -33.3,
        confidenceScore: 75,
        reasoning: 'This item appears to be overpriced compared to recent market data. Similar items have sold for significantly less.',
      },
    },
    listing: {
      ...mockListing,
      price: 120.0,
    },
  },
};

export const ReplicaItem: Story = {
  args: {
    result: {
      ...mockEvaluationResult,
      evaluation: {
        ...mockEvaluationResult.evaluation,
        estimatedMarketValue: 25.0,
        undervaluationPercentage: -58.3,
        confidenceScore: 88,
        reasoning: 'This item has been identified as a replica or novelty item, not an authentic collectible. The estimated value reflects its value as a replica, which is typically much lower than an authentic version.',
        isReplicaOrNovelty: true,
      },
    },
    listing: {
      ...mockListing,
      price: 60.0,
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




/**
 * Mock Evaluation Data
 *
 * Sample data for testing the evaluation results UI without calling the API
 * Use this to test different scenarios: good deals, bad deals, replicas, etc.
 */

import type { EvaluationResult } from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';

// Common image URLs reused across mock listings
const COMMON_IMAGES = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop&ixlib=rb-4.0.3',
] as const;

/**
 * Factory function to create mock listings
 */
function createMockListing(overrides: Partial<MarketplaceListing>): MarketplaceListing {
  return {
    id: 'B0B63YW1D8',
    marketplace: 'amazon',
    marketplaceId: 'B0B63YW1D8',
    title: 'Vintage 1960s Mid-Century Modern Ceramic Vase - Authentic',
    description: 'Authentic mid-century modern ceramic vase from the 1960s. Excellent condition with original maker\'s mark. Rare find in this condition.',
    price: 14.88,
    currency: 'USD',
    images: [...COMMON_IMAGES],
    category: 'Antiques',
    condition: 'vintage',
    sellerName: 'MarshLing Store',
    sellerRating: 4.5,
    listingUrl: 'https://www.amazon.com/dp/B0B63YW1D8',
    available: true,
    ...overrides,
  };
}

/**
 * Factory function to create mock evaluation results
 */
function createMockEvaluation(overrides: {
  estimatedMarketValue: number;
  undervaluationPercentage: number;
  confidenceScore: number;
  reasoning: string;
  factors: string[];
}): EvaluationResult {
  return {
    evaluation: {
      estimatedMarketValue: overrides.estimatedMarketValue,
      undervaluationPercentage: overrides.undervaluationPercentage,
      confidenceScore: overrides.confidenceScore,
      reasoning: overrides.reasoning,
      factors: overrides.factors,
      isReplicaOrNovelty: false,
    },
    modelVersion: 'gpt-4o',
    promptVersion: '1.0.0',
    evaluationMode: 'multimodal',
    evaluatedAt: new Date(),
  };
}

/**
 * Mock listing data - Bargain (undervalued authentic item)
 */
export const mockListingOverpricedReplica = createMockListing({
  id: 'B0B63YW1D8',
  marketplaceId: 'B0B63YW1D8',
  description: 'Authentic mid-century modern ceramic vase from the 1960s. Excellent condition with original maker\'s mark. Rare find in this condition. Seller may not be aware of true value.',
  price: 14.88,
  listingUrl: 'https://www.amazon.com/dp/B0B63YW1D8',
});

/**
 * Mock evaluation result - Bargain (undervalued authentic item)
 */
export const mockEvaluationOverpricedReplica = createMockEvaluation({
  estimatedMarketValue: 28.5,
  undervaluationPercentage: 47.8,
  confidenceScore: 85,
  reasoning: 'This is an authentic mid-century modern ceramic vase in excellent condition. The maker\'s mark is clearly visible and matches known examples from the 1960s. Comparable items in similar condition typically sell for $25-30. The current listing price of $14.88 represents a significant bargain opportunity - you could save over $13 by purchasing this undervalued item.',
  factors: ['authentic vintage item', 'excellent condition', 'rare maker\'s mark', 'below market average by 47.8%'],
});

/**
 * Mock listing data - Good deal (undervalued authentic item)
 */
export const mockListingGoodDeal = createMockListing({
  id: 'B08XYZ1234',
  marketplaceId: 'B08XYZ1234',
  price: 45.99,
  sellerName: 'Antique Treasures',
  sellerRating: 4.8,
  listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
});

/**
 * Mock evaluation result - Good deal (undervalued)
 */
export const mockEvaluationGoodDeal = createMockEvaluation({
  estimatedMarketValue: 75,
  undervaluationPercentage: 38.7,
  confidenceScore: 85,
  reasoning: 'This is an authentic mid-century modern ceramic vase in excellent condition. The maker\'s mark is clearly visible and matches known examples from the 1960s. Comparable items in similar condition typically sell for $70-80. The current listing price represents a significant bargain opportunity.',
  factors: ['authentic vintage item', 'excellent condition', 'rare maker\'s mark', 'below market average by 38.7%'],
});

/**
 * Mock listing data - Fairly priced authentic item
 */
export const mockListingFairPrice = createMockListing({
  id: 'B09ABC5678',
  marketplaceId: 'B09ABC5678',
  title: 'Antique Silver Pocket Watch - 1920s',
  description: 'Beautiful antique silver pocket watch from the 1920s. Fully functional with original chain. Some wear consistent with age.',
  price: 125,
  sellerName: 'Timepieces & Co',
  sellerRating: 4.6,
  listingUrl: 'https://www.amazon.com/dp/B09ABC5678',
});

/**
 * Mock evaluation result - Fairly priced
 */
export const mockEvaluationFairPrice = createMockEvaluation({
  estimatedMarketValue: 130,
  undervaluationPercentage: 3.8,
  confidenceScore: 75,
  reasoning: 'This is an authentic 1920s silver pocket watch in good condition. The price is close to market value, with only a slight undervaluation. The watch appears functional and includes the original chain, which adds to its value.',
  factors: ['authentic vintage item', 'functional condition', 'includes original chain', 'priced near market value'],
});

/**
 * Mock listing data - Slightly overpriced authentic item
 */
export const mockListingSlightlyOverpriced = createMockListing({
  id: 'B10XYZ9012',
  marketplaceId: 'B10XYZ9012',
  title: 'Vintage Art Deco Jewelry Box - 1930s',
  description: 'Elegant Art Deco jewelry box from the 1930s. Original hardware and lining. Some minor scratches on the exterior.',
  price: 95,
  sellerName: 'Vintage Finds',
  sellerRating: 4.3,
  listingUrl: 'https://www.amazon.com/dp/B10XYZ9012',
});

/**
 * Mock evaluation result - Slightly overpriced
 */
export const mockEvaluationSlightlyOverpriced = createMockEvaluation({
  estimatedMarketValue: 85,
  undervaluationPercentage: -11.8,
  confidenceScore: 80,
  reasoning: 'This is an authentic Art Deco jewelry box from the 1930s. While it has original hardware and lining, the minor scratches and wear reduce its value compared to pristine examples. The current price is slightly above typical market value for items in this condition.',
  factors: ['authentic vintage item', 'original hardware', 'minor wear', 'slightly above market value'],
});

/**
 * Helper function to get mock data by scenario
 */
export function getMockEvaluationData(scenario: 'overpriced-replica' | 'good-deal' | 'fair-price' | 'slightly-overpriced'): {
  listing: MarketplaceListing;
  result: EvaluationResult;
} {
  // Default fallback for runtime safety (TypeScript ensures type safety at compile time)
  const defaultResult = {
    listing: mockListingOverpricedReplica,
    result: mockEvaluationOverpricedReplica,
  };

  switch (scenario) {
    case 'overpriced-replica':
      return defaultResult;
    case 'good-deal':
      return {
        listing: mockListingGoodDeal,
        result: mockEvaluationGoodDeal,
      };
    case 'fair-price':
      return {
        listing: mockListingFairPrice,
        result: mockEvaluationFairPrice,
      };
    case 'slightly-overpriced':
      return {
        listing: mockListingSlightlyOverpriced,
        result: mockEvaluationSlightlyOverpriced,
      };
    default:
      // TypeScript ensures this is unreachable, but included for runtime safety
      return defaultResult;
  }
}

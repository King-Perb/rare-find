/**
 * Test Utilities
 *
 * Helper functions and mocks for testing services
 */

import { vi } from 'vitest';
import type {
  ILogger,
  IMarketplaceService,
  IListingService,
  IEvaluationService,
} from '@rare-find/shared/lib/interfaces';
import type { IDatabaseService, IAuthService } from '../interfaces';
import type {
  MarketplaceListing,
  EvaluationResult,
} from '@rare-find/shared';

/**
 * Create a mock logger
 */
export function createMockLogger(): ILogger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

/**
 * Create a mock marketplace service
 */
export function createMockMarketplaceService(): IMarketplaceService {
  return {
    parseMarketplaceUrl: vi.fn(),
    fetchListingFromUrl: vi.fn(),
    getListingById: vi.fn(),
    search: vi.fn(),
  };
}

/**
 * Create a mock listing service
 */
export function createMockListingService(): IListingService {
  return {
    validateListing: vi.fn(),
    normalizeListing: vi.fn(),
  };
}

/**
 * Create a mock evaluation service
 */
export function createMockEvaluationService(): IEvaluationService {
  return {
    evaluateListing: vi.fn(),
  };
}

/**
 * Create a mock database service
 */
export function createMockDatabaseService(): IDatabaseService {
  return {
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    getListingById: vi.fn(),
    createListing: vi.fn(),
    updateListing: vi.fn(),
    findListingByMarketplace: vi.fn(),
    createAIEvaluation: vi.fn(),
    getEvaluationByListingId: vi.fn(),
    createRecommendation: vi.fn(),
    getRecommendationsByUserId: vi.fn(),
    getRecommendationById: vi.fn(),
    updateRecommendation: vi.fn(),
    createNotification: vi.fn(),
    getUnreadNotifications: vi.fn(),
    markNotificationAsRead: vi.fn(),
    createPreference: vi.fn(),
    getPreferencesByUserId: vi.fn(),
    getActivePreferences: vi.fn(),
    updatePreference: vi.fn(),
    deletePreference: vi.fn(),
  };
}

/**
 * Create a mock auth service
 */
export function createMockAuthService(): IAuthService {
  return {
    getCurrentUser: vi.fn(),
    getSession: vi.fn(),
    signOut: vi.fn(),
  };
}

/**
 * Create a sample marketplace listing for testing
 */
export function createSampleListing(overrides?: Partial<MarketplaceListing>): MarketplaceListing {
  return {
    id: 'test-listing-1',
    marketplace: 'amazon',
    marketplaceId: 'B08XYZ123',
    title: 'Test Product',
    description: 'A test product description',
    price: 99.99,
    currency: 'USD',
    images: ['https://example.com/image1.jpg'],
    category: 'Electronics',
    condition: 'new',
    sellerName: 'Test Seller',
    sellerRating: 4.5,
    listingUrl: 'https://amazon.com/dp/B08XYZ123',
    available: true,
    ...overrides,
  };
}

/**
 * Create a sample evaluation result for testing
 */
export function createSampleEvaluationResult(overrides?: Partial<EvaluationResult>): EvaluationResult {
  return {
    evaluation: {
      estimatedMarketValue: 120,
      undervaluationPercentage: 20,
      confidenceScore: 85,
      reasoning: 'This is a good deal based on market analysis',
      factors: ['Price below market average', 'Good seller rating'],
    },
    modelVersion: 'gpt-4o',
    promptVersion: '1.0',
    evaluationMode: 'multimodal',
    evaluatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock fetch response for successful API calls
 */
export function createMockFetchResponse<T>(data: T, ok: boolean = true): Response {
  return {
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request',
    json: async () => data,
  } as Response;
}

/**
 * Create a mock fetch response for evaluation API success
 */
export function createMockEvaluationResponse(
  result: EvaluationResult,
  listing: MarketplaceListing
): Response {
  return createMockFetchResponse({
    success: true,
    result,
    listing,
  });
}

/**
 * Create a mock fetch response for evaluation API error
 */
export function createMockEvaluationErrorResponse(error: string | { message: string; code?: string }): Response {
  return createMockFetchResponse(
    {
      success: false,
      error: typeof error === 'string' ? error : error.message,
      ...(typeof error === 'object' && 'code' in error ? { code: error.code } : {}),
    },
    false
  );
}

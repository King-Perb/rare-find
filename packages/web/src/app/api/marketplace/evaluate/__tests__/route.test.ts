/**
 * Tests for Evaluate Listing API Route
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import { container, ServiceKeys } from '@/lib/di/container';
import type {
  IMarketplaceService,
  IListingService,
  IEvaluationService,
  ILogger,
} from '@/lib/services/interfaces';
import type { MarketplaceListing } from '@/lib/marketplace/types';
import type { EvaluationResult } from '@/lib/ai/types';

// Mock middleware - use absolute path to match route.ts import
vi.mock('@/app/api/middleware', () => ({
  withApiHandler: vi.fn((handler) => {
    // Return a function that calls the handler with a context
    return async (req: NextRequest) => {
      const context = {
        userId: undefined, // Public route - no user required
        user: undefined,
      };
      return handler(req, context);
    };
  }),
  requireAuth: vi.fn(),
  parseJsonBody: vi.fn(),
}));

// Mock DI container
vi.mock('@/lib/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
  ServiceKeys: {
    Logger: Symbol('Logger'),
    MarketplaceService: Symbol('MarketplaceService'),
    ListingService: Symbol('ListingService'),
    EvaluationService: Symbol('EvaluationService'),
  },
}));

import { parseJsonBody } from '@/app/api/middleware';

// Helper to create mock EvaluationResult
function createMockEvaluationResult(overrides?: Partial<EvaluationResult>): EvaluationResult {
  return {
    evaluation: {
      estimatedMarketValue: 120,
      undervaluationPercentage: 20,
      confidenceScore: 85,
      reasoning: 'Good deal',
      factors: ['rare condition'],
      isReplicaOrNovelty: false,
    },
    modelVersion: 'gpt-4o',
    promptVersion: '1.0',
    evaluationMode: 'multimodal',
    evaluatedAt: new Date(),
    ...overrides,
  };
}

describe('POST /api/marketplace/evaluate', () => {
  const mockLogger: ILogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  const mockMarketplaceService: IMarketplaceService = {
    fetchListingFromUrl: vi.fn(),
    parseMarketplaceUrl: vi.fn(),
    getListingById: vi.fn(),
    search: vi.fn(),
  };

  const mockListingService: IListingService = {
    normalizeListing: vi.fn((listing) => listing),
    validateListing: vi.fn(),
  };

  const mockEvaluationService: IEvaluationService = {
    evaluateListing: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(container.resolve).mockImplementation((key) => {
      if (key === ServiceKeys.Logger) return mockLogger;
      if (key === ServiceKeys.MarketplaceService) return mockMarketplaceService;
      if (key === ServiceKeys.ListingService) return mockListingService;
      if (key === ServiceKeys.EvaluationService) return mockEvaluationService;
      return null;
    });
  });

  it('should evaluate listing from URL', async () => {
    const mockListing: MarketplaceListing = {
      id: '1',
      marketplace: 'amazon',
      marketplaceId: 'B123',
      title: 'Test Item',
      price: 100,
      currency: 'USD',
      images: ['image1.jpg'],
      listingUrl: 'https://amazon.com/dp/B123',
      available: true,
    };

    const mockResult = createMockEvaluationResult();

    vi.mocked(parseJsonBody).mockResolvedValueOnce({
      listingUrl: 'https://amazon.com/dp/B123',
      mode: 'multimodal',
    });

    vi.mocked(mockMarketplaceService.fetchListingFromUrl).mockResolvedValueOnce(mockListing);
    vi.mocked(mockEvaluationService.evaluateListing).mockResolvedValueOnce(mockResult);

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    // Date objects are serialized to strings in JSON, so compare fields individually
    expect(data.result.evaluation).toEqual(mockResult.evaluation);
    expect(data.result.modelVersion).toBe(mockResult.modelVersion);
    expect(data.result.promptVersion).toBe(mockResult.promptVersion);
    expect(data.result.evaluationMode).toBe(mockResult.evaluationMode);
    expect(new Date(data.result.evaluatedAt)).toEqual(mockResult.evaluatedAt);
    expect(data.listing).toEqual(mockListing);
    expect(mockMarketplaceService.fetchListingFromUrl).toHaveBeenCalledWith('https://amazon.com/dp/B123');
    expect(mockListingService.normalizeListing).toHaveBeenCalledWith(mockListing);
    expect(mockListingService.validateListing).toHaveBeenCalledWith(mockListing);
    expect(mockEvaluationService.evaluateListing).toHaveBeenCalled();
  });

  it('should evaluate listing from provided listing data', async () => {
    const mockListing: MarketplaceListing = {
      id: '1',
      marketplace: 'amazon',
      marketplaceId: 'B123',
      title: 'Test Item',
      price: 100,
      currency: 'USD',
      images: [],
      listingUrl: 'https://amazon.com/dp/B123',
      available: true,
    };

    const mockResult = createMockEvaluationResult({
      evaluation: {
        estimatedMarketValue: 120,
        undervaluationPercentage: 20,
        confidenceScore: 85,
        reasoning: 'Good deal',
        factors: [],
        isReplicaOrNovelty: false,
      },
    });

    vi.mocked(parseJsonBody).mockResolvedValueOnce({
      listing: mockListing,
      mode: 'multimodal',
    });

    vi.mocked(mockEvaluationService.evaluateListing).mockResolvedValueOnce(mockResult);

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockMarketplaceService.fetchListingFromUrl).not.toHaveBeenCalled();
    expect(mockListingService.normalizeListing).toHaveBeenCalledWith(mockListing);
  });

  it('should use default multimodal mode when not specified', async () => {
    const mockListing: MarketplaceListing = {
      id: '1',
      marketplace: 'amazon',
      marketplaceId: 'B123',
      title: 'Test Item',
      price: 100,
      currency: 'USD',
      images: [],
      listingUrl: 'https://amazon.com/dp/B123',
      available: true,
    };

    const mockResult = createMockEvaluationResult({
      evaluation: {
        estimatedMarketValue: 120,
        undervaluationPercentage: 20,
        confidenceScore: 85,
        reasoning: 'Good deal',
        factors: [],
        isReplicaOrNovelty: false,
      },
    });

    vi.mocked(parseJsonBody).mockResolvedValueOnce({
      listingUrl: 'https://amazon.com/dp/B123',
    });

    vi.mocked(mockMarketplaceService.fetchListingFromUrl).mockResolvedValueOnce(mockListing);
    vi.mocked(mockEvaluationService.evaluateListing).mockResolvedValueOnce(mockResult);

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    await POST(req);

    expect(mockEvaluationService.evaluateListing).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'multimodal',
      })
    );
  });

  it('should throw ValidationError when neither listingUrl nor listing provided', async () => {
    vi.mocked(parseJsonBody).mockResolvedValueOnce({});

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    await expect(POST(req)).rejects.toThrow(
      'Either listingUrl or listing must be provided'
    );
  });

  it('should throw ValidationError when listing data is missing', async () => {
    vi.mocked(parseJsonBody).mockResolvedValueOnce({
      listingUrl: 'https://amazon.com/dp/B123',
    });

    vi.mocked(mockMarketplaceService.fetchListingFromUrl).mockRejectedValueOnce(
      new Error('Listing not found')
    );

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    await expect(POST(req)).rejects.toThrow();
  });

  it('should log evaluation with user context', async () => {
    const mockListing: MarketplaceListing = {
      id: '1',
      marketplace: 'amazon',
      marketplaceId: 'B123',
      title: 'Test Item',
      price: 100,
      currency: 'USD',
      images: [],
      listingUrl: 'https://amazon.com/dp/B123',
      available: true,
    };

    const mockResult = createMockEvaluationResult({
      evaluation: {
        estimatedMarketValue: 120,
        undervaluationPercentage: 20,
        confidenceScore: 85,
        reasoning: 'Good deal',
        factors: [],
        isReplicaOrNovelty: false,
      },
    });

    vi.mocked(parseJsonBody).mockResolvedValueOnce({
      listingUrl: 'https://amazon.com/dp/B123',
    });

    vi.mocked(mockMarketplaceService.fetchListingFromUrl).mockResolvedValueOnce(mockListing);
    vi.mocked(mockEvaluationService.evaluateListing).mockResolvedValueOnce(mockResult);

    const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
      method: 'POST',
    });

    await POST(req);

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Evaluating listing',
      expect.objectContaining({
        listingId: 'B123',
        marketplace: 'amazon',
      })
    );
  });
});

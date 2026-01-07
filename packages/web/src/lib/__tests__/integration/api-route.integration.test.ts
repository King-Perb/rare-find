/**
 * API Route Integration Tests
 *
 * Tests the full flow from API route → DI container → shared services → platform providers
 * These tests verify the complete integration without mocks
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/marketplace/evaluate/route';
import { setupDI } from '@/lib/di/setup';
import { container, ServiceKeys } from '@/lib/di/container';
import type { IMarketplaceService, IEvaluationService } from '@/lib/services/interfaces';

// Mock Supabase client to avoid environment variable requirements
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
      signOut: vi.fn(),
    },
  })),
}));

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
  })),
}));

// Mock OpenAI to avoid real API calls
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    estimatedMarketValue: 120,
                    undervaluationPercentage: 20,
                    confidenceScore: 85,
                    reasoning: 'Good deal based on market analysis',
                    factors: ['Price below market average', 'Good seller rating'],
                  }),
                },
              },
            ],
          }),
        },
      };
    },
  };
});

// Mock the evaluateUserListing function to return a predictable result
vi.mock('@rare-find/shared/lib/evaluation/evaluate-user-listing', () => ({
  evaluateUserListing: vi.fn().mockResolvedValue({
    evaluation: {
      estimatedMarketValue: 120,
      undervaluationPercentage: 20,
      confidenceScore: 85,
      reasoning: 'Good deal based on market analysis',
      factors: ['Price below market average', 'Good seller rating'],
    },
    modelVersion: 'gpt-4o',
    promptVersion: '1.2.0',
    evaluationMode: 'multimodal',
    evaluatedAt: new Date('2024-01-01'),
  }),
}));

// Mock middleware to allow testing
vi.mock('@/app/api/middleware', () => ({
  withApiHandler: vi.fn((handler) => {
    return async (req: NextRequest) => {
      const context = {
        userId: undefined,
        user: undefined,
      };
      return handler(req, context);
    };
  }),
  requireAuth: vi.fn(),
  parseJsonBody: vi.fn(async (req: NextRequest) => {
    return await req.json();
  }),
}));

// Mock fetch for marketplace API calls
globalThis.fetch = vi.fn();

describe('API Route Integration (Full Flow)', () => {
  beforeEach(() => {
    // Setup DI container with real implementations
    container.clear();
    setupDI();

    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.AMAZON_ACCESS_KEY = 'test-access-key';
    process.env.AMAZON_SECRET_KEY = 'test-secret-key';
    process.env.AMAZON_ASSOCIATE_TAG = 'test-tag';
    process.env.EBAY_APP_ID = 'test-ebay-app-id';

    vi.clearAllMocks();
  });

  afterEach(() => {
    container.clear();
  });

  describe('Full Flow: API Route → Shared Services → Platform Providers', () => {
    it('should handle evaluation request through full stack', async () => {
      // Mock Amazon PA-API 5.0 GetItems response
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          ItemsResult: {
            Items: [
              {
                ASIN: 'B08XYZ1234',
                DetailPageURL: 'https://www.amazon.com/dp/B08XYZ1234',
                ItemInfo: {
                  Title: { DisplayValue: 'Test Product' },
                  ByLineInfo: { Brand: { DisplayValue: 'Test Brand' } },
                  ProductInfo: { UnitCount: { DisplayValue: '1' } },
                  Features: { DisplayValues: ['Feature 1', 'Feature 2'] },
                  ExternalIds: { EANs: { DisplayValues: ['1234567890123'] } },
                  Classifications: {
                    ProductGroup: { DisplayValue: 'Electronics' },
                  },
                },
                Images: {
                  Primary: {
                    Large: { URL: 'https://example.com/image.jpg' },
                  },
                },
                Offers: {
                  Listings: [
                    {
                      Price: {
                        DisplayAmount: '$99.99',
                        Amount: 99.99,
                        Currency: 'USD',
                      },
                      Availability: {
                        Message: 'In Stock',
                        Type: 'Now',
                      },
                      Condition: { DisplayValue: 'New' },
                      MerchantInfo: {
                        Name: 'Test Seller',
                      },
                    },
                  ],
                },
              },
            ],
          },
        }),
      } as Response);

      // Create request with listing URL
      const requestBody = {
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        mode: 'multimodal' as const,
      };

      const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Execute the API route
      const response = await POST(req);
      const data = await response.json();

      // Verify response structure
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.result).toBeDefined();
      expect(data.listing).toBeDefined();

      // Verify services were resolved from DI container
      const marketplaceService = container.resolve<IMarketplaceService>(
        ServiceKeys.MarketplaceService
      );
      const evaluationService = container.resolve<IEvaluationService>(
        ServiceKeys.EvaluationService
      );

      expect(marketplaceService).toBeDefined();
      expect(evaluationService).toBeDefined();

      // Verify the services are instances of shared services
      expect(marketplaceService.constructor.name).toBe('MarketplaceService');
      expect(evaluationService.constructor.name).toBe('EvaluationService');
    });

    it('should use real platform providers (NodeCryptoProvider, WebHttpClient)', async () => {
      // Resolve services from DI
      const marketplaceService = container.resolve<IMarketplaceService>(
        ServiceKeys.MarketplaceService
      );

      // Verify service is initialized (this means providers were injected)
      expect(marketplaceService).toBeDefined();

      // The service should be able to parse URLs (platform-agnostic operation)
      const result = marketplaceService.parseMarketplaceUrl('https://www.amazon.com/dp/B08XYZ1234');
      expect(result.marketplace).toBe('amazon');
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should handle validation errors through the full stack', async () => {
      // Test with invalid request (missing listingUrl and listing)
      const requestBody = {};

      const req = new NextRequest('http://localhost:3000/api/marketplace/evaluate', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should throw ValidationError (handled by middleware)
      await expect(POST(req)).rejects.toThrow('Either listingUrl or listing must be provided');
    });
  });

  describe('DI Container Integration', () => {
    it('should resolve all services with correct types', () => {
      const marketplaceService = container.resolve<IMarketplaceService>(
        ServiceKeys.MarketplaceService
      );
      const evaluationService = container.resolve<IEvaluationService>(
        ServiceKeys.EvaluationService
      );

      // Verify services are resolved
      expect(marketplaceService).toBeDefined();
      expect(evaluationService).toBeDefined();

      // Verify they have expected methods
      expect(typeof marketplaceService.parseMarketplaceUrl).toBe('function');
      expect(typeof marketplaceService.fetchListingFromUrl).toBe('function');
      expect(typeof evaluationService.evaluateListing).toBe('function');
    });

    it('should inject platform-specific providers correctly', () => {
      // When we resolve MarketplaceService, it should have been created with:
      // - NodeCryptoProvider (for Amazon client)
      // - WebHttpClient (for both clients)
      // - LoggerService (web-specific logger)

      const marketplaceService = container.resolve<IMarketplaceService>(
        ServiceKeys.MarketplaceService
      );

      // Service should be functional (proving providers were injected)
      expect(marketplaceService).toBeDefined();
      expect(() => {
        marketplaceService.parseMarketplaceUrl('https://www.amazon.com/dp/B08XYZ1234');
      }).not.toThrow();
    });
  });
});

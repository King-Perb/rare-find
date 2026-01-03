/**
 * AmazonClient Tests
 *
 * Tests for Amazon Product Advertising API client with mocked crypto and HTTP providers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ICryptoProvider, IHttpClient } from '../../../src/lib/interfaces';
import type { MarketplaceSearchParams } from '../../../src/lib/marketplace/types';
import type { AmazonCredentials } from '../../../src/lib/marketplace/clients/amazon/types';

// Mock the rate limiter
vi.mock('../../../src/lib/marketplace/rate-limiter', () => ({
  waitForRateLimit: vi.fn().mockResolvedValue(undefined),
}));

// Import after mocks
import { AmazonClient } from '../../../src/lib/marketplace/clients/amazon/client';

describe('AmazonClient', () => {
  let mockCryptoProvider: ICryptoProvider;
  let mockHttpClient: IHttpClient;
  let credentials: AmazonCredentials;
  let client: AmazonClient;

  beforeEach(() => {
    // Mock crypto provider
    mockCryptoProvider = {
      sha256: vi.fn((data: string) => {
        // Simple mock - in real tests, this would compute actual SHA256
        return `sha256-${data}`;
      }),
      hmacSha256: vi.fn((key: string | Buffer, data: string) => {
        // Simple mock - in real tests, this would compute actual HMAC-SHA256
        return Buffer.from(`hmac-${data}`);
      }),
    };

    // Mock HTTP client
    mockHttpClient = {
      fetch: vi.fn(),
    };

    credentials = {
      accessKey: 'test-access-key',
      secretKey: 'test-secret-key',
      associateTag: 'test-associate-tag',
      region: 'us-east-1',
    };

    client = new AmazonClient(credentials, mockCryptoProvider, mockHttpClient);
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should search for items successfully', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['vintage', 'watch'],
        category: 'Watches',
        limit: 10,
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          SearchResult: {
            TotalResultCount: 1,
            Items: [
              {
                ASIN: 'B08XYZ1234',
                DetailPageURL: 'https://amazon.com/dp/B08XYZ1234',
                ItemInfo: {
                  Title: {
                    DisplayValue: 'Vintage Watch',
                  },
                  Features: {
                    DisplayValues: ['Feature 1', 'Feature 2'],
                  },
                },
                Offers: {
                  Listings: [
                    {
                      Price: {
                        Amount: 99.99,
                        Currency: 'USD',
                      },
                      Availability: {
                        Type: 'Now',
                      },
                      Condition: {
                        DisplayValue: 'New',
                      },
                    },
                  ],
                },
                Images: {
                  Primary: {
                    Large: {
                      URL: 'https://example.com/image.jpg',
                    },
                  },
                },
              },
            ],
          },
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.search(params);

      expect(mockHttpClient.fetch).toHaveBeenCalled();
      expect(result.listings).toHaveLength(1);
      expect(result.listings[0].marketplaceId).toBe('B08XYZ1234');
      expect(result.listings[0].title).toBe('Vintage Watch');
      expect(result.listings[0].price).toBe(99.99);
      expect(mockCryptoProvider.sha256).toHaveBeenCalled();
      expect(mockCryptoProvider.hmacSha256).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['test'],
      };

      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      await expect(client.search(params)).rejects.toThrow('Amazon API error');
    });

    it('should handle network errors', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['test'],
      };

      vi.mocked(mockHttpClient.fetch).mockRejectedValue(new Error('Network error'));

      await expect(client.search(params)).rejects.toThrow('Failed to search Amazon');
    });

    it('should map search parameters correctly', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['vintage', 'watch'],
        category: 'antique',
        minPrice: 100,
        maxPrice: 500,
        condition: 'used',
        sortBy: 'price',
        limit: 20,
        offset: 10,
      };

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          SearchResult: {
            TotalResultCount: 0,
            Items: [],
          },
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      await client.search(params);

      const fetchCall = vi.mocked(mockHttpClient.fetch).mock.calls[0];
      expect(fetchCall[0]).toContain('webservices.amazon.com');
      expect(fetchCall[1]?.method).toBe('POST');
    });
  });

  describe('getItemById', () => {
    it('should get item by ASIN successfully', async () => {
      const asin = 'B08XYZ1234';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          ItemsResult: {
            Items: [
              {
                ASIN: 'B08XYZ1234',
                DetailPageURL: 'https://amazon.com/dp/B08XYZ1234',
                ItemInfo: {
                  Title: {
                    DisplayValue: 'Test Product',
                  },
                  Features: {
                    DisplayValues: ['Feature 1'],
                  },
                },
                Offers: {
                  Listings: [
                    {
                      Price: {
                        Amount: 149.99,
                        Currency: 'USD',
                      },
                      Availability: {
                        Type: 'Now',
                      },
                      Condition: {
                        DisplayValue: 'New',
                      },
                      MerchantInfo: {
                        Name: 'Test Seller',
                      },
                    },
                  ],
                },
                Images: {
                  Primary: {
                    Large: {
                      URL: 'https://example.com/image.jpg',
                    },
                  },
                },
              },
            ],
          },
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(asin);

      expect(result).not.toBeNull();
      expect(result?.marketplaceId).toBe(asin);
      expect(result?.title).toBe('Test Product');
      expect(result?.price).toBe(149.99);
      expect(mockHttpClient.fetch).toHaveBeenCalled();
    });

    it('should return null for invalid ASIN', async () => {
      const asin = 'INVALID';

      await expect(client.getItemById(asin)).rejects.toThrow('Invalid ASIN format');
    });

    it('should return null when item not found', async () => {
      const asin = 'B08XYZ1234';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          Errors: [
            {
              Code: 'InvalidParameterValue',
              Message: 'Item not found',
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(asin);

      expect(result).toBeNull();
    });

    it('should return null when item not eligible', async () => {
      const asin = 'B08XYZ1234';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          Errors: [
            {
              Code: 'ItemNotEligible',
              Message: 'Item not eligible',
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(asin);

      expect(result).toBeNull();
    });

    it('should throw error for other API errors', async () => {
      const asin = 'B08XYZ1234';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          Errors: [
            {
              Code: 'InternalError',
              Message: 'Internal server error',
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      await expect(client.getItemById(asin)).rejects.toThrow('Amazon API error');
    });

    it('should handle empty items result', async () => {
      const asin = 'B08XYZ1234';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          ItemsResult: {
            Items: [],
          },
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(asin);

      expect(result).toBeNull();
    });
  });
});

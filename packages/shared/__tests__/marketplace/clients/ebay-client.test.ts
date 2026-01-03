/**
 * eBayClient Tests
 *
 * Tests for eBay Finding API client with mocked HTTP provider
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IHttpClient } from '../../../src/lib/interfaces';
import type { MarketplaceSearchParams } from '../../../src/lib/marketplace/types';
import type { eBayCredentials } from '../../../src/lib/marketplace/clients/ebay/types';

// Mock the rate limiter
vi.mock('../../../src/lib/marketplace/rate-limiter', () => ({
  waitForRateLimit: vi.fn().mockResolvedValue(undefined),
}));

// Import after mocks
import { eBayClient } from '../../../src/lib/marketplace/clients/ebay/client';

describe('eBayClient', () => {
  let mockHttpClient: IHttpClient;
  let credentials: eBayCredentials;
  let client: eBayClient;

  beforeEach(() => {
    // Mock HTTP client
    mockHttpClient = {
      fetch: vi.fn(),
    };

    credentials = {
      appId: 'test-app-id',
      authToken: '',
      siteId: 'US',
    };

    client = new eBayClient(credentials, mockHttpClient);
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
          findItemsAdvancedResponse: [
            {
              searchResult: {
                '@count': '1',
                item: [
                  {
                    itemId: ['123456789'],
                    title: ['Vintage Watch'],
                    viewItemURL: ['https://ebay.com/itm/123456789'],
                    sellingStatus: [
                      {
                        currentPrice: [
                          {
                            '@currencyId': 'USD',
                            __value__: '99.99',
                          },
                        ],
                        listingStatus: ['Active'],
                      },
                    ],
                    condition: [
                      {
                        conditionDisplayName: ['Used'],
                      },
                    ],
                    sellerInfo: [
                      {
                        sellerUserName: ['test-seller'],
                        positiveFeedbackPercent: ['98.5'],
                      },
                    ],
                    galleryURL: ['https://example.com/image.jpg'],
                    categoryName: ['Watches'],
                  },
                ],
              },
              paginationOutput: {
                totalPages: ['1'],
                totalEntries: ['1'],
                pageNumber: ['1'],
              },
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.search(params);

      expect(mockHttpClient.fetch).toHaveBeenCalled();
      expect(result.listings).toHaveLength(1);
      expect(result.listings[0].marketplaceId).toBe('123456789');
      expect(result.listings[0].title).toBe('Vintage Watch');
      expect(result.listings[0].price).toBe(99.99);
      expect(result.total).toBe(1);
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

      await expect(client.search(params)).rejects.toThrow('eBay API error');
    });

    it('should handle network errors', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['test'],
      };

      vi.mocked(mockHttpClient.fetch).mockRejectedValue(new Error('Network error'));

      await expect(client.search(params)).rejects.toThrow('Failed to search eBay');
    });

    it('should map search parameters correctly', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['vintage', 'watch'],
        category: '12345',
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
          findItemsAdvancedResponse: [
            {
              searchResult: {
                '@count': '0',
                item: [],
              },
              paginationOutput: {
                totalPages: ['0'],
                totalEntries: ['0'],
                pageNumber: ['1'],
              },
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      await client.search(params);

      const fetchCall = vi.mocked(mockHttpClient.fetch).mock.calls[0];
      expect(fetchCall[0]).toContain('svcs.ebay.com');
      expect(fetchCall[0]).toContain('keywords=vintage+watch');
      expect(fetchCall[0]).toContain('categoryId=12345');
      expect(fetchCall[1]?.method).toBe('GET');
    });
  });

  describe('getItemById', () => {
    it('should get item by ID successfully', async () => {
      const itemId = '123456789';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          findItemsAdvancedResponse: [
            {
              searchResult: {
                '@count': '1',
                item: [
                  {
                    itemId: ['123456789'],
                    title: ['Test Product'],
                    viewItemURL: ['https://ebay.com/itm/123456789'],
                    sellingStatus: [
                      {
                        currentPrice: [
                          {
                            '@currencyId': 'USD',
                            __value__: '149.99',
                          },
                        ],
                        listingStatus: ['Active'],
                      },
                    ],
                    condition: [
                      {
                        conditionDisplayName: ['New'],
                      },
                    ],
                    sellerInfo: [
                      {
                        sellerUserName: ['test-seller'],
                        positiveFeedbackPercent: ['99.0'],
                      },
                    ],
                    galleryURL: ['https://example.com/image.jpg'],
                    categoryName: ['Electronics'],
                  },
                ],
              },
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(itemId);

      expect(result).not.toBeNull();
      expect(result?.marketplaceId).toBe(itemId);
      expect(result?.title).toBe('Test Product');
      expect(result?.price).toBe(149.99);
      expect(mockHttpClient.fetch).toHaveBeenCalled();
    });

    it('should return null for invalid item ID format', async () => {
      const itemId = 'INVALID-ID';

      await expect(client.getItemById(itemId)).rejects.toThrow('Invalid eBay item ID format');
    });

    it('should return null when item not found', async () => {
      const itemId = '123456789';

      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          findItemsAdvancedResponse: [
            {
              searchResult: {
                '@count': '0',
                item: [],
              },
            },
          ],
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      const result = await client.getItemById(itemId);

      expect(result).toBeNull();
    });

    it('should handle API errors', async () => {
      const itemId = '123456789';

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: vi.fn().mockResolvedValue('Server error'),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(mockResponse);

      await expect(client.getItemById(itemId)).rejects.toThrow('eBay API error');
    });

    it('should handle network errors', async () => {
      const itemId = '123456789';

      vi.mocked(mockHttpClient.fetch).mockRejectedValue(new Error('Network error'));

      await expect(client.getItemById(itemId)).rejects.toThrow('Failed to get eBay item');
    });
  });
});

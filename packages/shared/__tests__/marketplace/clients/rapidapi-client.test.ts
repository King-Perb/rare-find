/**
 * RapidAPI Amazon Client Tests
 *
 * Tests for the RapidAPI Real-Time Amazon Data client with mocked HTTP provider
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IHttpClient } from '../../../src/lib/interfaces';
import type { MarketplaceSearchParams } from '../../../src/lib/marketplace/types';
import type {
  RapidAPIConfig,
  RapidAPIResponse,
  RapidAPIProductDetails,
  RapidAPISearchResponse,
} from '../../../src/lib/marketplace/clients/amazon/rapidapi-types';

// Mock the rate limiter
vi.mock('../../../src/lib/marketplace/rate-limiter', () => ({
  waitForRateLimit: vi.fn().mockResolvedValue(undefined),
}));

// Import after mocks
import { RapidAPIAmazonClient } from '../../../src/lib/marketplace/clients/amazon/rapidapi-client';

/**
 * Create a mock RapidAPI product details response
 */
function createMockProductDetails(
  overrides?: Partial<RapidAPIProductDetails>
): RapidAPIResponse<RapidAPIProductDetails> {
  return {
    status: 'OK',
    request_id: 'test-request-123',
    data: {
      asin: 'B08XYZ1234',
      product_title: 'Vintage Collectible Watch',
      product_description: 'A beautiful vintage watch from the 1960s',
      product_price: '$2,499.99',
      product_original_price: '$2,999.99',
      product_photos: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
      product_url: 'https://www.amazon.com/dp/B08XYZ1234',
      product_star_rating: '4.5 out of 5 stars',
      product_num_ratings: 150,
      product_availability: 'In Stock',
      product_category: 'Watches',
      seller_name: 'VintageWatchStore',
      brand: 'Rolex',
      product_details: {
        Material: 'Stainless Steel',
        'Band Color': 'Silver',
      },
      product_information: {
        ASIN: 'B08XYZ1234',
        Manufacturer: 'Rolex',
        'Item Weight': '3.2 ounces',
      },
      ...overrides,
    },
  };
}

/**
 * Create a mock RapidAPI search response
 */
function createMockSearchResponse(
  overrides?: Partial<RapidAPISearchResponse>
): RapidAPIResponse<RapidAPISearchResponse> {
  return {
    status: 'OK',
    request_id: 'test-request-456',
    data: {
      total_products: 100,
      country: 'US',
      domain: 'amazon.com',
      products: [
        {
          asin: 'B08XYZ1234',
          product_title: 'Vintage Watch 1',
          product_price: '$999.99',
          product_original_price: '$1,199.99',
          product_star_rating: '4.5',
          product_num_ratings: 50,
          product_url: 'https://www.amazon.com/dp/B08XYZ1234',
          product_photo: 'https://example.com/image1.jpg',
          is_prime: true,
        },
        {
          asin: 'B08ABC5678',
          product_title: 'Vintage Watch 2',
          product_price: '$799.99',
          product_star_rating: '4.2',
          product_num_ratings: 30,
          product_url: 'https://www.amazon.com/dp/B08ABC5678',
          product_photo: 'https://example.com/image2.jpg',
        },
      ],
      ...overrides,
    },
  };
}

describe('RapidAPIAmazonClient', () => {
  let mockHttpClient: IHttpClient;
  let config: RapidAPIConfig;
  let client: RapidAPIAmazonClient;

  beforeEach(() => {
    // Mock HTTP client
    mockHttpClient = {
      fetch: vi.fn(),
    };

    config = {
      apiKey: 'test-api-key',
      apiHost: 'real-time-amazon-data.p.rapidapi.com',
    };

    client = new RapidAPIAmazonClient(config, mockHttpClient);
    vi.clearAllMocks();
  });

  describe('getItemById', () => {
    it('should fetch product details successfully', async () => {
      const mockResponse = createMockProductDetails();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result).toBeDefined();
      expect(result?.id).toBe('B08XYZ1234');
      expect(result?.marketplace).toBe('amazon');
      expect(result?.marketplaceId).toBe('B08XYZ1234');
      expect(result?.title).toBe('Vintage Collectible Watch');
      expect(result?.price).toBe(2499.99);
      expect(result?.currency).toBe('USD');
      expect(result?.images).toHaveLength(2);
      expect(result?.sellerName).toBe('VintageWatchStore');
      expect(result?.sellerRating).toBe(4.5);
      expect(result?.available).toBe(true);
      expect(result?.listingUrl).toBe('https://www.amazon.com/dp/B08XYZ1234');
    });

    it('should include correct headers in request', async () => {
      const mockResponse = createMockProductDetails();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      await client.getItemById('B08XYZ1234');

      expect(mockHttpClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('product-details'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': 'test-api-key',
            'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
          },
        })
      );
    });

    it('should uppercase ASIN in request', async () => {
      const mockResponse = createMockProductDetails();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      await client.getItemById('b08xyz1234');

      expect(mockHttpClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('asin=B08XYZ1234'),
        expect.anything()
      );
    });

    it('should throw error for invalid ASIN format', async () => {
      await expect(client.getItemById('invalid')).rejects.toThrow(
        'Invalid ASIN format: invalid'
      );
      expect(mockHttpClient.fetch).not.toHaveBeenCalled();
    });

    it('should return null when product not found', async () => {
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          status: 'OK',
          request_id: 'test',
          data: null,
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result).toBeNull();
    });

    it('should return null when status is not OK', async () => {
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          status: 'ERROR',
          request_id: 'test',
          data: null,
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result).toBeNull();
    });

    it('should throw error when API returns error status code', async () => {
      const httpResponse = {
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: vi.fn().mockResolvedValue('Rate limit exceeded'),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      await expect(client.getItemById('B08XYZ1234')).rejects.toThrow(
        'RapidAPI error: 429 Too Many Requests'
      );
    });

    it('should handle network errors', async () => {
      vi.mocked(mockHttpClient.fetch).mockRejectedValue(new Error('Network error'));

      await expect(client.getItemById('B08XYZ1234')).rejects.toThrow(
        'Failed to get Amazon item: Network error'
      );
    });

    it('should fall back to original price if current price is missing', async () => {
      const mockResponse = createMockProductDetails({
        product_price: undefined,
        product_original_price: '$1,500.00',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.price).toBe(1500);
    });

    it('should return 0 price if no price is available', async () => {
      const mockResponse = createMockProductDetails({
        product_price: undefined,
        product_original_price: undefined,
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.price).toBe(0);
    });

    it('should detect refurbished condition from title', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Apple Watch Series 8 (Refurbished)',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('refurbished');
    });

    it('should detect renewed condition as refurbished', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Apple Watch Series 8 (Renewed)',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('refurbished');
    });

    it('should detect used condition from title', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Used Vintage Camera',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('used');
    });

    it('should detect vintage condition from title', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Vintage Collectible Toy',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('vintage');
    });

    it('should detect collectible condition from description', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Rare Coin',
        product_description: 'This is a rare collectible coin from 1920.',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('collectible');
    });

    it('should default to new condition', async () => {
      const mockResponse = createMockProductDetails({
        product_title: 'Brand New Item',
        product_description: 'Factory sealed product.',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.condition).toBe('new');
    });

    it('should detect out of stock availability', async () => {
      const mockResponse = createMockProductDetails({
        product_availability: 'Currently unavailable',
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.available).toBe(false);
    });

    it('should build description from multiple sources', async () => {
      const mockResponse = createMockProductDetails({
        product_description: 'Main description',
        brand: 'TestBrand',
        product_details: {
          Color: 'Red',
          Size: 'Large',
        },
        product_information: {
          Manufacturer: 'Test Mfg',
          ASIN: 'B08XYZ1234', // Should be filtered out
        },
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.description).toContain('Brand: TestBrand');
      expect(result?.description).toContain('Main description');
      expect(result?.description).toContain('Color: Red');
      expect(result?.description).toContain('Size: Large');
      expect(result?.description).toContain('Manufacturer: Test Mfg');
      expect(result?.description).not.toContain('ASIN:');
    });

    it('should handle missing rating gracefully', async () => {
      const mockResponse = createMockProductDetails({
        product_star_rating: undefined,
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.getItemById('B08XYZ1234');

      expect(result?.sellerRating).toBeUndefined();
    });

    it('should parse various rating formats', async () => {
      // Test "4.5 out of 5 stars" format
      let mockResponse = createMockProductDetails({
        product_star_rating: '4.5 out of 5 stars',
      });
      let httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      let result = await client.getItemById('B08XYZ1234');
      expect(result?.sellerRating).toBe(4.5);

      // Test plain number format
      mockResponse = createMockProductDetails({
        product_star_rating: '4.2',
      });
      httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      result = await client.getItemById('B08XYZ1234');
      expect(result?.sellerRating).toBe(4.2);
    });
  });

  describe('search', () => {
    it('should search products successfully', async () => {
      const mockResponse = createMockSearchResponse();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const params: MarketplaceSearchParams = {
        keywords: ['vintage', 'watch'],
      };

      const result = await client.search(params);

      expect(result.listings).toHaveLength(2);
      expect(result.total).toBe(100);
      expect(result.hasMore).toBe(true);
      expect(result.listings[0].id).toBe('B08XYZ1234');
      expect(result.listings[0].title).toBe('Vintage Watch 1');
      expect(result.listings[0].price).toBe(999.99);
    });

    it('should include search parameters in request', async () => {
      const mockResponse = createMockSearchResponse();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const params: MarketplaceSearchParams = {
        keywords: ['vintage', 'watch'],
        minPrice: 100,
        maxPrice: 500,
        sortBy: 'price',
        offset: 20,
        limit: 10,
      };

      await client.search(params);

      const calledUrl = vi.mocked(mockHttpClient.fetch).mock.calls[0][0] as string;
      expect(calledUrl).toContain('query=vintage+watch');
      expect(calledUrl).toContain('min_price=100');
      expect(calledUrl).toContain('max_price=500');
      expect(calledUrl).toContain('sort_by=LOWEST_PRICE');
      expect(calledUrl).toContain('page=3'); // offset 20 / limit 10 + 1 = 3
    });

    it('should return empty results when status is not OK', async () => {
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          status: 'ERROR',
          request_id: 'test',
          data: null,
        }),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.search({ keywords: ['test'] });

      expect(result.listings).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.hasMore).toBe(false);
    });

    it('should throw error when API returns error status code', async () => {
      const httpResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: vi.fn().mockResolvedValue('Server error'),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      await expect(client.search({ keywords: ['test'] })).rejects.toThrow(
        'RapidAPI error: 500 Internal Server Error'
      );
    });

    it('should handle network errors', async () => {
      vi.mocked(mockHttpClient.fetch).mockRejectedValue(new Error('Network timeout'));

      await expect(client.search({ keywords: ['test'] })).rejects.toThrow(
        'Failed to search Amazon: Network timeout'
      );
    });

    it('should map sort parameters correctly', async () => {
      const mockResponse = createMockSearchResponse();
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      // Test relevance
      await client.search({ keywords: ['test'], sortBy: 'relevance' });
      expect((vi.mocked(mockHttpClient.fetch).mock.calls[0][0] as string)).toContain('sort_by=RELEVANCE');

      // Test newest
      await client.search({ keywords: ['test'], sortBy: 'newest' });
      expect((vi.mocked(mockHttpClient.fetch).mock.calls[1][0] as string)).toContain('sort_by=NEWEST');

      // Test price
      await client.search({ keywords: ['test'], sortBy: 'price' });
      expect((vi.mocked(mockHttpClient.fetch).mock.calls[2][0] as string)).toContain('sort_by=LOWEST_PRICE');
    });

    it('should handle products with missing photos', async () => {
      const mockResponse = createMockSearchResponse({
        products: [
          {
            asin: 'B08XYZ1234',
            product_title: 'Test Product',
            product_url: 'https://www.amazon.com/dp/B08XYZ1234',
            product_photo: '', // Empty photo
          },
        ],
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.search({ keywords: ['test'] });

      expect(result.listings[0].images).toEqual([]);
    });

    it('should handle hasMore correctly when fewer results than total', async () => {
      const mockResponse = createMockSearchResponse({
        total_products: 5,
        products: [
          {
            asin: 'B08XYZ1234',
            product_title: 'Test',
            product_url: 'https://www.amazon.com/dp/B08XYZ1234',
            product_photo: 'https://example.com/img.jpg',
          },
        ],
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.search({ keywords: ['test'] });

      expect(result.hasMore).toBe(true);
    });

    it('should handle hasMore correctly when all results returned', async () => {
      const mockResponse = createMockSearchResponse({
        total_products: 1,
        products: [
          {
            asin: 'B08XYZ1234',
            product_title: 'Test',
            product_url: 'https://www.amazon.com/dp/B08XYZ1234',
            product_photo: 'https://example.com/img.jpg',
          },
        ],
      });
      const httpResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response;

      vi.mocked(mockHttpClient.fetch).mockResolvedValue(httpResponse);

      const result = await client.search({ keywords: ['test'] });

      expect(result.hasMore).toBe(false);
    });
  });
});

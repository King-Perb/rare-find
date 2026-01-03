import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketplaceService } from '../../src/lib/marketplace/services/marketplace.service';
import type { ILogger } from '../../src/lib/interfaces';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult, MarketplaceClient } from '../../src/lib/marketplace/types';
import { ValidationError, AppError } from '../../src/lib/errors';

describe('MarketplaceService', () => {
  let mockLogger: ILogger;
  let mockAmazonClient: MarketplaceClient;
  let mockEbayClient: MarketplaceClient;
  let service: MarketplaceService;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    mockAmazonClient = {
      search: vi.fn(),
      getItemById: vi.fn(),
    };

    mockEbayClient = {
      search: vi.fn(),
      getItemById: vi.fn(),
    };

    service = new MarketplaceService(mockLogger, mockAmazonClient, mockEbayClient);
  });

  describe('parseMarketplaceUrl', () => {
    it('should parse Amazon URL with /dp/ pattern', () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);

      expect(result).toEqual({
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
      });
    });

    it('should parse Amazon URL with /gp/product/ pattern', () => {
      const url = 'https://www.amazon.com/gp/product/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);

      expect(result).toEqual({
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
      });
    });

    it('should parse Amazon URL with /product/ pattern', () => {
      const url = 'https://www.amazon.com/product/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);

      expect(result).toEqual({
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
      });
    });

    it('should parse Amazon URL with lowercase ASIN', () => {
      const url = 'https://www.amazon.com/dp/b08xyz1234';
      const result = service.parseMarketplaceUrl(url);

      expect(result).toEqual({
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
      });
    });

    it('should parse eBay URL with /itm/ pattern', () => {
      const url = 'https://www.ebay.com/itm/123456789';
      const result = service.parseMarketplaceUrl(url);

      expect(result).toEqual({
        marketplace: 'ebay',
        marketplaceId: '123456789',
      });
    });

    it('should throw ValidationError for Amazon URL without ASIN', () => {
      const url = 'https://www.amazon.com/';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Could not extract ASIN from Amazon URL');
    });

    it('should throw ValidationError for eBay URL without item ID', () => {
      const url = 'https://www.ebay.com/';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Could not extract item ID from eBay URL');
    });

    it('should throw ValidationError for unsupported marketplace URL', () => {
      const url = 'https://www.example.com/product/123';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Unsupported marketplace URL');
    });

    it('should throw ValidationError for invalid URL', () => {
      const url = 'not-a-valid-url';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
    });
  });

  describe('fetchListingFromUrl', () => {
    it('should fetch listing from Amazon URL', async () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const mockListing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
        listingUrl: url,
        available: true,
      };

      vi.mocked(mockAmazonClient.getItemById).mockResolvedValue(mockListing);

      const result = await service.fetchListingFromUrl(url);

      expect(result).toEqual(mockListing);
      expect(mockAmazonClient.getItemById).toHaveBeenCalledWith('B08XYZ1234');
      expect(mockLogger.info).toHaveBeenCalledWith('Fetching listing from marketplace', {
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        url,
      });
    });

    it('should fetch listing from eBay URL', async () => {
      const url = 'https://www.ebay.com/itm/123456789';
      const mockListing: MarketplaceListing = {
        id: 'listing-2',
        marketplace: 'ebay',
        marketplaceId: '123456789',
        title: 'Test Product',
        price: 49.99,
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
        listingUrl: url,
        available: true,
      };

      vi.mocked(mockEbayClient.getItemById).mockResolvedValue(mockListing);

      const result = await service.fetchListingFromUrl(url);

      expect(result).toEqual(mockListing);
      expect(mockEbayClient.getItemById).toHaveBeenCalledWith('123456789');
    });

    it('should throw AppError when listing is not found', async () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      vi.mocked(mockAmazonClient.getItemById).mockResolvedValue(null);

      await expect(service.fetchListingFromUrl(url)).rejects.toThrow(AppError);
      await expect(service.fetchListingFromUrl(url)).rejects.toThrow('Listing not found: B08XYZ1234');
    });

    it('should throw AppError when client throws error', async () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const error = new Error('Network error');
      vi.mocked(mockAmazonClient.getItemById).mockRejectedValue(error);

      await expect(service.fetchListingFromUrl(url)).rejects.toThrow(AppError);
      await expect(service.fetchListingFromUrl(url)).rejects.toThrow('Failed to get listing: Network error');
    });
  });

  describe('getListingById', () => {
    it('should get Amazon listing by ID', async () => {
      const mockListing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };

      vi.mocked(mockAmazonClient.getItemById).mockResolvedValue(mockListing);

      const result = await service.getListingById('amazon', 'B08XYZ1234');

      expect(result).toEqual(mockListing);
      expect(mockAmazonClient.getItemById).toHaveBeenCalledWith('B08XYZ1234');
    });

    it('should get eBay listing by ID', async () => {
      const mockListing: MarketplaceListing = {
        id: 'listing-2',
        marketplace: 'ebay',
        marketplaceId: '123456789',
        title: 'Test Product',
        price: 49.99,
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
        listingUrl: 'https://www.ebay.com/itm/123456789',
        available: true,
      };

      vi.mocked(mockEbayClient.getItemById).mockResolvedValue(mockListing);

      const result = await service.getListingById('ebay', '123456789');

      expect(result).toEqual(mockListing);
      expect(mockEbayClient.getItemById).toHaveBeenCalledWith('123456789');
    });

    it('should return null when listing is not found', async () => {
      vi.mocked(mockAmazonClient.getItemById).mockResolvedValue(null);

      const result = await service.getListingById('amazon', 'B08XYZ1234');

      expect(result).toBeNull();
    });

    it('should throw ValidationError for unsupported marketplace', async () => {
      await expect(service.getListingById('unsupported' as 'amazon' | 'ebay', '123')).rejects.toThrow(ValidationError);
      await expect(service.getListingById('unsupported' as 'amazon' | 'ebay', '123')).rejects.toThrow('Unsupported marketplace: unsupported');
    });

    it('should throw AppError when client throws error', async () => {
      const error = new Error('Network error');
      vi.mocked(mockAmazonClient.getItemById).mockRejectedValue(error);

      await expect(service.getListingById('amazon', 'B08XYZ1234')).rejects.toThrow(AppError);
      await expect(service.getListingById('amazon', 'B08XYZ1234')).rejects.toThrow('Failed to get listing: Network error');
    });
  });

  describe('search', () => {
    it('should search Amazon marketplace', async () => {
      const params: MarketplaceSearchParams & { marketplace?: 'amazon' | 'ebay' } = {
        marketplace: 'amazon',
        keywords: ['test'],
      };
      const mockResult: MarketplaceSearchResult = {
        listings: [],
        total: 0,
        hasMore: false,
      };

      vi.mocked(mockAmazonClient.search).mockResolvedValue(mockResult);

      const result = await service.search(params);

      expect(result).toEqual(mockResult);
      expect(mockAmazonClient.search).toHaveBeenCalledWith(params);
    });

    it('should search eBay marketplace', async () => {
      const params: MarketplaceSearchParams & { marketplace?: 'amazon' | 'ebay' } = {
        marketplace: 'ebay',
        keywords: ['test'],
      };
      const mockResult: MarketplaceSearchResult = {
        listings: [],
        total: 0,
        hasMore: false,
      };

      vi.mocked(mockEbayClient.search).mockResolvedValue(mockResult);

      const result = await service.search(params);

      expect(result).toEqual(mockResult);
      expect(mockEbayClient.search).toHaveBeenCalledWith(params);
    });

    it('should default to Amazon when marketplace is not specified', async () => {
      const params: MarketplaceSearchParams = {
        keywords: ['test'],
      };
      const mockResult: MarketplaceSearchResult = {
        listings: [],
        total: 0,
        hasMore: false,
      };

      vi.mocked(mockAmazonClient.search).mockResolvedValue(mockResult);

      const result = await service.search(params);

      expect(result).toEqual(mockResult);
      expect(mockAmazonClient.search).toHaveBeenCalledWith(params);
    });
  });
});

/**
 * MarketplaceService Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketplaceService } from '../marketplace.service';
import { ValidationError, AppError } from '../../errors';
import { createMockLogger, createSampleListing } from './test-utils';
import type { ILogger } from '../interfaces';
import type { AmazonClient } from '../../marketplace/amazon/client';
import type { eBayClient } from '../../marketplace/ebay/client';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let mockLogger: ILogger;
  let mockAmazonClient: Partial<AmazonClient>;
  let mockEbayClient: Partial<eBayClient>;

  beforeEach(() => {
    mockLogger = createMockLogger();
    mockAmazonClient = {
      getItemById: vi.fn(),
      search: vi.fn(),
    };
    mockEbayClient = {
      getItemById: vi.fn(),
      search: vi.fn(),
    };
    service = new MarketplaceService(
      mockLogger,
      mockAmazonClient as AmazonClient,
      mockEbayClient as eBayClient
    );
  });

  describe('parseMarketplaceUrl', () => {
    it('should parse Amazon URL with /dp/ path', () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);
      expect(result.marketplace).toBe('amazon');
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should parse Amazon URL with /gp/product/ path', () => {
      const url = 'https://www.amazon.com/gp/product/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);
      expect(result.marketplace).toBe('amazon');
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should parse Amazon URL with /product/ path', () => {
      const url = 'https://www.amazon.com/product/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);
      expect(result.marketplace).toBe('amazon');
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should uppercase Amazon ASIN', () => {
      const url = 'https://www.amazon.com/dp/b08xyz1234';
      const result = service.parseMarketplaceUrl(url);
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should parse eBay URL with /itm/ path', () => {
      const url = 'https://www.ebay.com/itm/123456789';
      const result = service.parseMarketplaceUrl(url);
      expect(result.marketplace).toBe('ebay');
      expect(result.marketplaceId).toBe('123456789');
    });

    it('should throw ValidationError for unsupported marketplace', () => {
      const url = 'https://www.other-marketplace.com/item/123';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Unsupported marketplace URL');
    });

    it('should throw ValidationError for invalid Amazon URL', () => {
      const url = 'https://www.amazon.com/invalid-path';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Could not extract ASIN');
    });

    it('should throw ValidationError for invalid eBay URL', () => {
      const url = 'https://www.ebay.com/invalid-path';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
      expect(() => service.parseMarketplaceUrl(url)).toThrow('Could not extract item ID');
    });

    it('should throw ValidationError for invalid URL format', () => {
      const url = 'not-a-valid-url';
      expect(() => service.parseMarketplaceUrl(url)).toThrow(ValidationError);
    });
  });

  describe('getListingById', () => {
    it('should fetch Amazon listing', async () => {
      const listing = createSampleListing({ marketplace: 'amazon' });
      mockAmazonClient.getItemById = vi.fn().mockResolvedValue(listing);

      const result = await service.getListingById('amazon', 'B08XYZ123');
      expect(result).toEqual(listing);
      expect(mockAmazonClient.getItemById).toHaveBeenCalledWith('B08XYZ123');
    });

    it('should fetch eBay listing', async () => {
      const listing = createSampleListing({ marketplace: 'ebay' });
      mockEbayClient.getItemById = vi.fn().mockResolvedValue(listing);

      const result = await service.getListingById('ebay', '123456789');
      expect(result).toEqual(listing);
      expect(mockEbayClient.getItemById).toHaveBeenCalledWith('123456789');
    });

    it('should return null if listing not found', async () => {
      mockAmazonClient.getItemById = vi.fn().mockResolvedValue(null);
      const result = await service.getListingById('amazon', 'B08XYZ123');
      expect(result).toBeNull();
    });

    it('should throw ValidationError for unsupported marketplace', async () => {
      await expect(
        service.getListingById('invalid' as 'amazon' | 'ebay', '123')
      ).rejects.toThrow(ValidationError);
    });

    it('should throw AppError if client throws error', async () => {
      const error = new Error('Network error');
      mockAmazonClient.getItemById = vi.fn().mockRejectedValue(error);

      await expect(
        service.getListingById('amazon', 'B08XYZ123')
      ).rejects.toThrow(AppError);
    });
  });

  describe('fetchListingFromUrl', () => {
    it('should fetch listing from Amazon URL', async () => {
      const listing = createSampleListing({ marketplace: 'amazon' });
      mockAmazonClient.getItemById = vi.fn().mockResolvedValue(listing);

      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const result = await service.fetchListingFromUrl(url);

      expect(result).toEqual(listing);
      expect(mockAmazonClient.getItemById).toHaveBeenCalledWith('B08XYZ1234');
    });

    it('should fetch listing from eBay URL', async () => {
      const listing = createSampleListing({ marketplace: 'ebay' });
      mockEbayClient.getItemById = vi.fn().mockResolvedValue(listing);

      const url = 'https://www.ebay.com/itm/123456789';
      const result = await service.fetchListingFromUrl(url);

      expect(result).toEqual(listing);
      expect(mockEbayClient.getItemById).toHaveBeenCalledWith('123456789');
    });

    it('should throw AppError if listing not found', async () => {
      mockAmazonClient.getItemById = vi.fn().mockResolvedValue(null);

      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      await expect(service.fetchListingFromUrl(url)).rejects.toThrow(AppError);
      await expect(service.fetchListingFromUrl(url)).rejects.toThrow('Listing not found');
    });

    it('should throw ValidationError for invalid URL', async () => {
      const url = 'https://www.invalid.com/item/123';
      await expect(service.fetchListingFromUrl(url)).rejects.toThrow(ValidationError);
    });

    it('should log fetching operation', async () => {
      const listing = createSampleListing();
      mockAmazonClient.getItemById = vi.fn().mockResolvedValue(listing);

      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      await service.fetchListingFromUrl(url);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Fetching listing from marketplace',
        expect.objectContaining({
          marketplace: 'amazon',
          marketplaceId: 'B08XYZ1234',
        })
      );
    });
  });

  describe('search', () => {
    it('should search Amazon when marketplace is specified', async () => {
      const searchResult = {
        listings: [createSampleListing()],
        total: 1,
        hasMore: false,
      };
      mockAmazonClient.search = vi.fn().mockResolvedValue(searchResult);

      const params = { marketplace: 'amazon' as const, keywords: ['test'] };
      const result = await service.search(params);

      expect(result).toEqual(searchResult);
      expect(mockAmazonClient.search).toHaveBeenCalledWith(params);
    });

    it('should search eBay when marketplace is specified', async () => {
      const searchResult = {
        listings: [createSampleListing({ marketplace: 'ebay' })],
        total: 1,
        hasMore: false,
      };
      mockEbayClient.search = vi.fn().mockResolvedValue(searchResult);

      const params = { marketplace: 'ebay' as const, keywords: ['test'] };
      const result = await service.search(params);

      expect(result).toEqual(searchResult);
      expect(mockEbayClient.search).toHaveBeenCalledWith(params);
    });

    it('should default to Amazon when marketplace not specified', async () => {
      const searchResult = {
        listings: [createSampleListing()],
        total: 1,
        hasMore: false,
      };
      mockAmazonClient.search = vi.fn().mockResolvedValue(searchResult);

      const params = { keywords: ['test'] };
      const result = await service.search(params);

      expect(result).toEqual(searchResult);
      expect(mockAmazonClient.search).toHaveBeenCalledWith(params);
    });
  });
});


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListingService } from '../../src/lib/listing/services/listing.service';
import type { ILogger } from '../../src/lib/interfaces';
import type { MarketplaceListing } from '../../src/lib/marketplace/types';
import { ValidationError } from '../../src/lib/errors';

describe('ListingService', () => {
  let mockLogger: ILogger;
  let service: ListingService;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    service = new ListingService(mockLogger);
  });

  describe('validateListing', () => {
    it('should validate a valid listing', () => {
      const listing: MarketplaceListing = {
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
      expect(() => service.validateListing(listing)).not.toThrow();
    });

    it('should throw ValidationError if title is missing', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: '',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing title is required');
    });

    it('should throw ValidationError if title is only whitespace', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: '   ',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
    });

    it('should throw ValidationError if price is zero', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 0,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing price must be greater than 0');
    });

    it('should throw ValidationError if price is negative', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: -10,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
    });

    it('should throw ValidationError if marketplace is invalid', () => {
      const listing = {
        id: 'listing-1',
        marketplace: 'invalid' as 'amazon' | 'ebay',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Invalid marketplace');
    });

    it('should throw ValidationError if marketplaceId is missing', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: '',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Marketplace ID is required');
    });

    it('should throw ValidationError if listingUrl is missing', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: '',
        available: true,
      };
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing URL is required');
    });

    it('should accept valid amazon marketplace', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      expect(() => service.validateListing(listing)).not.toThrow();
    });

    it('should accept valid ebay marketplace', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'ebay',
        marketplaceId: '123456789',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.ebay.com/itm/123456789',
        available: true,
      };
      expect(() => service.validateListing(listing)).not.toThrow();
    });
  });

  describe('normalizeListing', () => {
    it('should trim title and description', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: '  Test Product  ',
        description: '  Description  ',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.title).toBe('Test Product');
      expect(normalized.description).toBe('Description');
    });

    it('should uppercase marketplaceId', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'b08xyz1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.marketplaceId).toBe('B08XYZ1234');
    });

    it('should trim listingUrl', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: '  https://example.com  ',
        available: true,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.listingUrl).toBe('https://example.com');
    });

    it('should default currency to USD if missing', () => {
      const listing = {
        id: 'listing-1',
        marketplace: 'amazon' as const,
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: undefined as unknown as string,
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.currency).toBe('USD');
    });

    it('should default available to true if missing', () => {
      const listing = {
        id: 'listing-1',
        marketplace: 'amazon' as const,
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: undefined as unknown as boolean,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.available).toBe(true);
    });

    it('should preserve all other fields', () => {
      const listing: MarketplaceListing = {
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
      const normalized = service.normalizeListing(listing);
      expect(normalized.id).toBe(listing.id);
      expect(normalized.marketplace).toBe(listing.marketplace);
      expect(normalized.price).toBe(listing.price);
      expect(normalized.images).toEqual(listing.images);
    });

    it('should handle undefined description', () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        description: undefined,
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const normalized = service.normalizeListing(listing);
      expect(normalized.description).toBeUndefined();
    });
  });
});

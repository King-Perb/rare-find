/**
 * ListingService Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListingService } from '../listing.service';
import { ValidationError } from '../../errors';
import { createMockLogger, createSampleListing } from './test-utils';
import type { ILogger } from '../interfaces';

describe('ListingService', () => {
  let service: ListingService;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    service = new ListingService(mockLogger);
  });

  describe('validateListing', () => {
    it('should validate a valid listing', () => {
      const listing = createSampleListing();
      expect(() => service.validateListing(listing)).not.toThrow();
    });

    it('should throw ValidationError if title is missing', () => {
      const listing = createSampleListing({ title: '' });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing title is required');
    });

    it('should throw ValidationError if title is only whitespace', () => {
      const listing = createSampleListing({ title: '   ' });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
    });

    it('should throw ValidationError if price is zero', () => {
      const listing = createSampleListing({ price: 0 });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing price must be greater than 0');
    });

    it('should throw ValidationError if price is negative', () => {
      const listing = createSampleListing({ price: -10 });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
    });

    it('should throw ValidationError if marketplace is invalid', () => {
      const listing = createSampleListing({ marketplace: 'invalid' as unknown as 'amazon' | 'ebay' });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Invalid marketplace');
    });

    it('should throw ValidationError if marketplaceId is missing', () => {
      const listing = createSampleListing({ marketplaceId: '' });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Marketplace ID is required');
    });

    it('should throw ValidationError if listingUrl is missing', () => {
      const listing = createSampleListing({ listingUrl: '' });
      expect(() => service.validateListing(listing)).toThrow(ValidationError);
      expect(() => service.validateListing(listing)).toThrow('Listing URL is required');
    });

    it('should accept valid amazon marketplace', () => {
      const listing = createSampleListing({ marketplace: 'amazon' });
      expect(() => service.validateListing(listing)).not.toThrow();
    });

    it('should accept valid ebay marketplace', () => {
      const listing = createSampleListing({ marketplace: 'ebay' });
      expect(() => service.validateListing(listing)).not.toThrow();
    });
  });

  describe('normalizeListing', () => {
    it('should trim title and description', () => {
      const listing = createSampleListing({
        title: '  Test Product  ',
        description: '  Description  ',
      });
      const normalized = service.normalizeListing(listing);
      expect(normalized.title).toBe('Test Product');
      expect(normalized.description).toBe('Description');
    });

    it('should uppercase marketplaceId', () => {
      const listing = createSampleListing({ marketplaceId: 'b08xyz123' });
      const normalized = service.normalizeListing(listing);
      expect(normalized.marketplaceId).toBe('B08XYZ123');
    });

    it('should trim listingUrl', () => {
      const listing = createSampleListing({ listingUrl: '  https://example.com  ' });
      const normalized = service.normalizeListing(listing);
      expect(normalized.listingUrl).toBe('https://example.com');
    });

    it('should default currency to USD if missing', () => {
      const listing = createSampleListing({ currency: undefined as unknown as string });
      const normalized = service.normalizeListing(listing);
      expect(normalized.currency).toBe('USD');
    });

    it('should default available to true if missing', () => {
      const listing = createSampleListing({ available: undefined as unknown as boolean });
      const normalized = service.normalizeListing(listing);
      expect(normalized.available).toBe(true);
    });

    it('should preserve all other fields', () => {
      const listing = createSampleListing();
      const normalized = service.normalizeListing(listing);
      expect(normalized.id).toBe(listing.id);
      expect(normalized.marketplace).toBe(listing.marketplace);
      expect(normalized.price).toBe(listing.price);
      expect(normalized.images).toEqual(listing.images);
    });

    it('should handle undefined description', () => {
      const listing = createSampleListing({ description: undefined });
      const normalized = service.normalizeListing(listing);
      expect(normalized.description).toBeUndefined();
    });
  });
});

/**
 * ListingService Integration Tests
 *
 * Tests shared ListingService with web-specific logger
 * These tests verify that the shared business logic works correctly with platform-specific implementations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ListingService } from '@rare-find/shared/lib/listing/services/listing.service';
import { createMockLogger, createSampleListing } from '../../services/__tests__/test-utils';
import type { ILogger } from '@rare-find/shared/lib/interfaces';
import { ValidationError } from '@rare-find/shared/lib/errors';

describe('ListingService Integration (Web)', () => {
  let service: ListingService;
  let logger: ILogger;

  beforeEach(() => {
    logger = createMockLogger();
    service = new ListingService(logger);
  });

  describe('Service Initialization', () => {
    it('should initialize ListingService with web logger', () => {
      expect(service).toBeInstanceOf(ListingService);
    });
  });

  describe('Validation with Web Logger', () => {
    it('should validate listing successfully', () => {
      const listing = createSampleListing();

      // Should not throw
      expect(() => service.validateListing(listing)).not.toThrow();
    });

    it('should throw ValidationError for invalid listing', () => {
      const invalidListing = createSampleListing({ title: '' });

      expect(() => service.validateListing(invalidListing)).toThrow(ValidationError);
    });
  });

  describe('Normalization with Web Logger', () => {
    it('should normalize listing correctly', () => {
      const listing = createSampleListing({
        title: '  Test Product  ',
        marketplaceId: 'b08xyz1234',
      });

      const normalized = service.normalizeListing(listing);

      expect(normalized.title).toBe('Test Product');
      expect(normalized.marketplaceId).toBe('B08XYZ1234');
    });
  });
});

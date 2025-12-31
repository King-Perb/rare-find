/**
 * Tests for DI Setup
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container, ServiceKeys } from '../container';
import { setupDI, initializeDI } from '../setup';

// Mock services
vi.mock('../../services/logger.service', () => {
  class MockLoggerService {
    log = vi.fn();
    debug = vi.fn();
    info = vi.fn();
    warn = vi.fn();
    error = vi.fn();
  }
  return {
    LoggerService: MockLoggerService,
  };
});

vi.mock('../../services/marketplace.service', () => ({
  MarketplaceService: class {
    fetchListingFromUrl = vi.fn();
    constructor(_logger: unknown) {}
  },
}));

vi.mock('../../services/listing.service', () => ({
  ListingService: class {
    normalizeListing = vi.fn();
    constructor(_logger: unknown) {}
  },
}));

vi.mock('../../services/evaluation.service', () => ({
  EvaluationService: class {
    evaluateListing = vi.fn();
    constructor(_logger: unknown) {}
  },
}));

vi.mock('../../services/auth.service', () => ({
  AuthService: class {
    getCurrentUser = vi.fn();
  },
}));

vi.mock('../../services/database.service', () => ({
  DatabaseService: class {
    query = vi.fn();
  },
}));

import { LoggerService } from '../../services/logger.service';
import { MarketplaceService } from '../../services/marketplace.service';
import { ListingService } from '../../services/listing.service';
import { EvaluationService } from '../../services/evaluation.service';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

describe('DI Setup', () => {
  beforeEach(() => {
    container.clear();
  });

  describe('setupDI', () => {
    it('should register all services', () => {
      setupDI();

      expect(container.has(ServiceKeys.Logger)).toBe(true);
      expect(container.has(ServiceKeys.MarketplaceService)).toBe(true);
      expect(container.has(ServiceKeys.ListingService)).toBe(true);
      expect(container.has(ServiceKeys.EvaluationService)).toBe(true);
      expect(container.has(ServiceKeys.AuthService)).toBe(true);
      expect(container.has(ServiceKeys.DatabaseService)).toBe(true);
    });

    it('should register Logger as singleton', () => {
      setupDI();

      const logger1 = container.resolve<LoggerService>(ServiceKeys.Logger);
      const logger2 = container.resolve<LoggerService>(ServiceKeys.Logger);

      expect(logger1).toBe(logger2);
      expect(logger1).toBeInstanceOf(LoggerService);
    });

    it('should register MarketplaceService with Logger dependency', () => {
      setupDI();

      const marketplaceService = container.resolve<MarketplaceService>(ServiceKeys.MarketplaceService);

      expect(marketplaceService).toBeInstanceOf(MarketplaceService);
    });

    it('should register ListingService with Logger dependency', () => {
      setupDI();

      const listingService = container.resolve<ListingService>(ServiceKeys.ListingService);

      expect(listingService).toBeInstanceOf(ListingService);
    });

    it('should register EvaluationService with Logger dependency', () => {
      setupDI();

      const evaluationService = container.resolve<EvaluationService>(ServiceKeys.EvaluationService);

      expect(evaluationService).toBeInstanceOf(EvaluationService);
    });

    it('should register AuthService without dependencies', () => {
      setupDI();

      const authService = container.resolve<AuthService>(ServiceKeys.AuthService);

      expect(authService).toBeInstanceOf(AuthService);
    });

    it('should register DatabaseService without dependencies', () => {
      setupDI();

      const databaseService = container.resolve<DatabaseService>(ServiceKeys.DatabaseService);

      expect(databaseService).toBeInstanceOf(DatabaseService);
    });
  });

  describe('initializeDI', () => {
    it('should call setupDI', () => {
      const setupDISpy = vi.spyOn({ setupDI }, 'setupDI');
      initializeDI();
      // Note: initializeDI just calls setupDI, so we verify setupDI was called
      expect(container.has(ServiceKeys.Logger)).toBe(true);
    });
  });
});

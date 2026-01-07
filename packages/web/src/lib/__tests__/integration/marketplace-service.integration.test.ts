/**
 * MarketplaceService Integration Tests
 *
 * Tests shared MarketplaceService with web-specific providers (NodeCryptoProvider, WebHttpClient)
 * These tests verify that the shared business logic works correctly with platform-specific implementations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
import { AmazonClient, eBayClient } from '@rare-find/shared/lib/marketplace/clients';
import { NodeCryptoProvider } from '../../crypto/node-crypto-provider';
import { WebHttpClient } from '../../http/web-http-client';
import { createMockLogger } from '../../services/__tests__/test-utils';
import type { ILogger } from '@rare-find/shared/lib/interfaces';
import type { AmazonCredentials } from '@rare-find/shared/lib/marketplace/clients/amazon/types';
import type { eBayCredentials } from '@rare-find/shared/lib/marketplace/clients/ebay/types';

// Mock environment variables
const mockEnv = {
  AMAZON_ACCESS_KEY: 'test-access-key',
  AMAZON_SECRET_KEY: 'test-secret-key',
  AMAZON_ASSOCIATE_TAG: 'test-tag',
  EBAY_APP_ID: 'test-ebay-app-id',
};

describe('MarketplaceService Integration (Web)', () => {
  let service: MarketplaceService;
  let logger: ILogger;
  let cryptoProvider: NodeCryptoProvider;
  let httpClient: WebHttpClient;
  let amazonClient: AmazonClient;
  let ebayClient: eBayClient;

  beforeEach(() => {
    // Setup web-specific providers
    logger = createMockLogger();
    cryptoProvider = new NodeCryptoProvider();
    httpClient = new WebHttpClient();

    // Create clients with web providers
    const amazonCredentials: AmazonCredentials = {
      accessKey: mockEnv.AMAZON_ACCESS_KEY,
      secretKey: mockEnv.AMAZON_SECRET_KEY,
      associateTag: mockEnv.AMAZON_ASSOCIATE_TAG,
      region: 'us-east-1',
    };

    const ebayCredentials: eBayCredentials = {
      appId: mockEnv.EBAY_APP_ID,
      authToken: '',
      siteId: 'EBAY-US',
    };

    amazonClient = new AmazonClient(amazonCredentials, cryptoProvider, httpClient);
    ebayClient = new eBayClient(ebayCredentials, httpClient);

    // Create service with real clients
    service = new MarketplaceService(logger, amazonClient, ebayClient);
  });

  describe('Service Initialization', () => {
    it('should initialize MarketplaceService with web providers', () => {
      expect(service).toBeInstanceOf(MarketplaceService);
      expect(logger.info).toHaveBeenCalledWith('MarketplaceService initialized');
    });

    it('should use NodeCryptoProvider for Amazon client', () => {
      // Verify crypto provider is used (AmazonClient requires it for signing)
      expect(cryptoProvider).toBeInstanceOf(NodeCryptoProvider);
      expect(amazonClient).toBeInstanceOf(AmazonClient);
    });

    it('should use WebHttpClient for both clients', () => {
      expect(httpClient).toBeInstanceOf(WebHttpClient);
      expect(amazonClient).toBeInstanceOf(AmazonClient);
      expect(ebayClient).toBeInstanceOf(eBayClient);
    });
  });

  describe('URL Parsing (Platform-Agnostic)', () => {
    it('should parse Amazon URL correctly', () => {
      const url = 'https://www.amazon.com/dp/B08XYZ1234';
      const result = service.parseMarketplaceUrl(url);

      expect(result.marketplace).toBe('amazon');
      expect(result.marketplaceId).toBe('B08XYZ1234');
    });

    it('should parse eBay URL correctly', () => {
      const url = 'https://www.ebay.com/itm/123456789';
      const result = service.parseMarketplaceUrl(url);

      expect(result.marketplace).toBe('ebay');
      expect(result.marketplaceId).toBe('123456789');
    });
  });

  describe('Integration with Web Providers', () => {
    it('should handle HTTP requests through WebHttpClient', async () => {
      // Mock fetch to verify WebHttpClient is used
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'Not found',
        json: async () => ({}),
      });

      globalThis.fetch = mockFetch;

      // Try to fetch a listing (will fail, but verifies WebHttpClient is used)
      await expect(
        service.getListingById('amazon', 'B08XYZ1234')
      ).rejects.toThrow();

      // Verify fetch was called (through WebHttpClient)
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should use NodeCryptoProvider for Amazon signature generation', () => {
      // Verify crypto provider methods exist and are callable
      expect(typeof cryptoProvider.sha256).toBe('function');
      expect(typeof cryptoProvider.hmacSha256).toBe('function');

      // Test that crypto operations work
      const hash = cryptoProvider.sha256('test-data');
      expect(hash).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
  });
});

/**
 * Verify Imports
 *
 * This file verifies that all shared services can be imported and used in the mobile package
 * Run this to ensure Phase 11 integration is complete
 */

// Verify shared services can be imported
import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
import { ListingService } from '@rare-find/shared/lib/listing/services/listing.service';
import { EvaluationService } from '@rare-find/shared/lib/evaluation/services/evaluation.service';

// Verify shared clients can be imported
import { AmazonClient, eBayClient, RapidAPIAmazonClient } from '@rare-find/shared/lib/marketplace/clients';

// Verify shared types can be imported
import type {
  MarketplaceListing,
  MarketplaceSearchParams,
  MarketplaceSearchResult,
} from '@rare-find/shared/lib/marketplace/types';
import type {
  EvaluationInput,
  EvaluationResult,
  EvaluationMode,
} from '@rare-find/shared/lib/evaluation/types';
import type { AmazonCredentials } from '@rare-find/shared/lib/marketplace/clients/amazon/types';
import type { eBayCredentials } from '@rare-find/shared/lib/marketplace/clients/ebay/types';

// Verify shared interfaces can be imported
import type {
  ILogger,
  ICryptoProvider,
  IHttpClient,
  IMarketplaceService,
  IListingService,
  IEvaluationService,
} from '@rare-find/shared/lib/interfaces';

// Verify shared errors can be imported
import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
} from '@rare-find/shared/lib/errors';

// Verify shared utilities can be imported
import { waitForRateLimit } from '@rare-find/shared/lib/marketplace/rate-limiter';
import { getEvaluationPrompt, PROMPT_VERSION } from '@rare-find/shared/lib/evaluation/prompts';

// Verify platform-specific providers can be imported
import { createExpoCryptoProvider } from '../crypto/expo-crypto-provider';
import { createMobileHttpClient } from '../http/mobile-http-client';
import { createMobileLogger } from '../logger/mobile-logger';

/**
 * Verify all imports are working
 * This function will fail at compile time if any imports are broken
 */
export function verifyImports(): void {
  // This function exists only to verify imports compile correctly
  // If this file compiles, all imports are working

  // Verify types are available
  const listing: MarketplaceListing = {
    id: 'test',
    marketplace: 'amazon',
    marketplaceId: 'B08XYZ1234',
    title: 'Test',
    price: 100,
    currency: 'USD',
    images: [],
    listingUrl: 'https://example.com',
    available: true,
  };

  const searchParams: MarketplaceSearchParams = {
    keywords: ['test'],
    sortBy: 'price',
  };

  const evaluationInput: EvaluationInput = {
    listing,
    mode: 'text-only' as EvaluationMode,
  };

  // Verify error classes can be instantiated
  const appError = new AppError('Test');
  const validationError = new ValidationError('Test');
  const notFoundError = new NotFoundError('Resource');
  const unauthorizedError = new UnauthorizedError();
  const rateLimitError = new RateLimitError();

  // Verify platform providers can be created
  const logger = createMobileLogger();
  const cryptoProvider = createExpoCryptoProvider();
  const httpClient = createMobileHttpClient();

  // Verify shared services can be instantiated (with mocks)
  // Note: In real usage, you'd provide real credentials
  const mockAmazonCredentials: AmazonCredentials = {
    accessKey: 'test',
    secretKey: 'test',
    associateTag: 'test',
    region: 'us-east-1',
  };

  const mockEbayCredentials: eBayCredentials = {
    appId: 'test',
    authToken: '',
    siteId: 'EBAY-US',
  };

  const amazonClient = new AmazonClient(mockAmazonCredentials, cryptoProvider, httpClient);
  const ebayClient = new eBayClient(mockEbayCredentials, httpClient);
  const marketplaceService = new MarketplaceService(logger, amazonClient, ebayClient);
  const listingService = new ListingService(logger);

  // Verify utilities can be called
  const prompt = getEvaluationPrompt('multimodal');
  const promptVersion = PROMPT_VERSION;

  console.log('✅ All imports verified successfully!');
  console.log('✅ Types:', { listing, searchParams, evaluationInput });
  console.log('✅ Errors:', { appError, validationError, notFoundError, unauthorizedError, rateLimitError });
  console.log('✅ Providers:', { logger, cryptoProvider, httpClient });
  console.log('✅ Services:', { marketplaceService, listingService });
  console.log('✅ Utilities:', { prompt, promptVersion });
}

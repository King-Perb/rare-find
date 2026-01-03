/**
 * Services Index
 *
 * Central export point for all services
 * Re-exports shared services for backward compatibility
 */

// Re-export interfaces from shared package
export type {
  ILogger,
  IMarketplaceService,
  IListingService,
  IEvaluationService,
} from '@rare-find/shared/lib/interfaces';

// Re-export shared services
export { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
export { ListingService } from '@rare-find/shared/lib/listing/services/listing.service';
export { EvaluationService } from '@rare-find/shared/lib/evaluation/services/evaluation.service';

// Export web-specific services
export * from './logger.service';
export * from './auth.service';
export * from './database.service';

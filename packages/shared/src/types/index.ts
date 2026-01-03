/**
 * Shared TypeScript Types
 *
 * Centralized export point for all shared types used across web and mobile apps
 * This provides a single import location for common types
 */

// Export marketplace types
export type {
  Marketplace,
  MarketplaceListing,
  MarketplaceSearchParams,
  MarketplaceSearchResult,
  MarketplaceClient,
} from '../lib/marketplace/types';

// Export evaluation types
export type {
  EvaluationMode,
  EvaluationInput,
  EvaluationResult,
  AIEvaluationResponse,
  WebSearchCitation,
} from '../lib/evaluation/types';

// Export rate limiter types
export type { RateLimitSource } from '../lib/marketplace/rate-limiter';

// Export Amazon client types
export type {
  AmazonCredentials,
  AmazonItem,
  AmazonSearchRequest,
  AmazonSearchResponse,
  AmazonGetItemsRequest,
  AmazonGetItemsResponse,
} from '../lib/marketplace/clients/amazon/types';

// Export RapidAPI Amazon client types
export type {
  RapidAPIConfig,
  RapidAPIResponse,
  RapidAPIProductDetails,
  RapidAPIProductVariation,
  RapidAPISearchResult,
  RapidAPISearchResponse,
  RapidAPIReviewsResponse,
  RapidAPIReview,
  RapidAPISellerDetails,
  RapidAPIProductDetailsRequest,
  RapidAPISearchRequest,
} from '../lib/marketplace/clients/amazon/rapidapi-types';

// Export eBay client types
export type {
  eBayCredentials,
  eBayItem,
  eBaySearchRequest,
  eBaySearchResponse,
} from '../lib/marketplace/clients/ebay/types';

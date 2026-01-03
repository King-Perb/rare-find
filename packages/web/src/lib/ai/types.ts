/**
 * AI Evaluation Types
 *
 * Re-exports evaluation types from shared package
 * Adds web-specific API types for Next.js routes
 */

// Re-export shared evaluation types
export type {
  EvaluationMode,
  EvaluationInput,
  EvaluationResult,
  AIEvaluationResponse,
  WebSearchCitation,
} from '@rare-find/shared';

// Import types for web-specific API types
import type { MarketplaceListing, EvaluationMode, EvaluationResult } from '@rare-find/shared';

/**
 * Evaluation request for API endpoint
 */
export interface EvaluateListingRequest {
  /** Listing URL to evaluate (will be fetched and parsed) */
  listingUrl?: string;
  /** Or provide listing data directly */
  listing?: MarketplaceListing;
  /** Evaluation mode - defaults to "multimodal" for user-provided listings */
  mode?: EvaluationMode;
}

/**
 * Evaluation response from API endpoint
 */
export interface EvaluateListingResponse {
  /** Evaluation result */
  result: EvaluationResult;
  /** Listing data that was evaluated */
  listing: MarketplaceListing;
  /** Success indicator */
  success: true;
}

/**
 * Evaluation error response
 */
export interface EvaluateListingError {
  /** Error message */
  error: string;
  /** Error code if available */
  code?: string;
  /** Success indicator */
  success: false;
}

/**
 * Union type for API response
 */
export type EvaluateListingApiResponse = EvaluateListingResponse | EvaluateListingError;

/**
 * Service Interfaces
 *
 * Define contracts for all services to enable dependency injection and testing
 * Platform-agnostic interfaces for shared business logic
 */

import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from './marketplace/types';
import type { EvaluationInput, EvaluationResult } from './evaluation/types';

/**
 * Logger service interface
 */
export interface ILogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

/**
 * Crypto provider interface for platform-agnostic cryptographic operations
 */
export interface ICryptoProvider {
  /**
   * Calculate SHA256 hash
   */
  sha256(data: string): string;

  /**
   * Calculate HMAC-SHA256
   */
  hmacSha256(key: string | Buffer, data: string): Buffer;
}

/**
 * HTTP client interface for platform-agnostic HTTP requests
 */
export interface IHttpClient {
  /**
   * Make HTTP request
   */
  fetch(url: string, options?: RequestInit): Promise<Response>;
}

/**
 * Marketplace service interface
 */
export interface IMarketplaceService {
  /**
   * Parse marketplace URL and extract marketplace ID
   */
  parseMarketplaceUrl(url: string): {
    marketplace: 'amazon' | 'ebay';
    marketplaceId: string;
  };

  /**
   * Fetch listing from marketplace using URL
   */
  fetchListingFromUrl(listingUrl: string): Promise<MarketplaceListing>;

  /**
   * Get listing by marketplace ID
   */
  getListingById(marketplace: 'amazon' | 'ebay', marketplaceId: string): Promise<MarketplaceListing | null>;

  /**
   * Search listings
   */
  search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult>;
}

/**
 * Listing service interface
 */
export interface IListingService {
  /**
   * Validate listing data
   */
  validateListing(listing: MarketplaceListing): void;

  /**
   * Normalize listing data
   */
  normalizeListing(listing: MarketplaceListing): MarketplaceListing;
}

/**
 * Evaluation service interface
 */
export interface IEvaluationService {
  /**
   * Evaluate a listing using AI
   */
  evaluateListing(input: EvaluationInput): Promise<EvaluationResult>;
}

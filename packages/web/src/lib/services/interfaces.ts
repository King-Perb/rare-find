/**
 * Service Interfaces
 * 
 * Define contracts for all services to enable dependency injection and testing
 */

import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from '../marketplace/types';
import type { EvaluationInput, EvaluationResult } from '../ai/types';

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

/**
 * Database service interface
 */
export interface IDatabaseService {
  // User operations
  getUserById(userId: string): Promise<unknown | null>;
  createUser(userData: unknown): Promise<unknown>;
  updateUser(userId: string, userData: unknown): Promise<unknown>;

  // Listing operations
  getListingById(listingId: string): Promise<unknown | null>;
  createListing(listingData: unknown): Promise<unknown>;
  updateListing(listingId: string, listingData: unknown): Promise<unknown>;
  findListingByMarketplace(marketplace: string, marketplaceId: string): Promise<unknown | null>;

  // Evaluation operations
  createAIEvaluation(evaluationData: unknown): Promise<unknown>;
  getEvaluationByListingId(listingId: string): Promise<unknown | null>;

  // Recommendation operations
  createRecommendation(recommendationData: unknown): Promise<unknown>;
  getRecommendationsByUserId(userId: string, options?: unknown): Promise<unknown[]>;
  getRecommendationById(recommendationId: string): Promise<unknown | null>;
  updateRecommendation(recommendationId: string, recommendationData: unknown): Promise<unknown>;

  // Notification operations
  createNotification(notificationData: unknown): Promise<unknown>;
  getUnreadNotifications(userId: string, options?: unknown): Promise<unknown[]>;
  markNotificationAsRead(notificationId: string): Promise<unknown>;

  // Search preference operations
  createPreference(preferenceData: unknown): Promise<unknown>;
  getPreferencesByUserId(userId: string, options?: unknown): Promise<unknown[]>;
  getActivePreferences(userId: string): Promise<unknown[]>;
  updatePreference(preferenceId: string, preferenceData: unknown): Promise<unknown>;
  deletePreference(preferenceId: string): Promise<void>;
}

/**
 * Auth service interface
 */
export interface IAuthService {
  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<{ id: string; email?: string } | null>;

  /**
   * Get current session
   */
  getSession(): Promise<unknown | null>;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;
}


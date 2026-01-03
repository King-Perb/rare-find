/**
 * Service Interfaces
 *
 * Define contracts for all services to enable dependency injection and testing
 * Re-exports shared interfaces and adds web-specific interfaces
 */

// Re-export shared interfaces
export type {
  ILogger,
  IMarketplaceService,
  IListingService,
  IEvaluationService,
} from '@rare-find/shared/lib/interfaces';

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

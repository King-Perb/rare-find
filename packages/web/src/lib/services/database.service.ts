/**
 * Database Service
 *
 * Wraps database query functions for dependency injection
 */

import type { IDatabaseService } from './interfaces';
import * as dbQueries from '../db/queries';

export class DatabaseService implements IDatabaseService {
  // User operations
  async getUserById(userId: string) {
    return dbQueries.getUserById(userId);
  }

  async createUser(userData: unknown) {
    return dbQueries.createUser(userData as Parameters<typeof dbQueries.createUser>[0]);
  }

  async updateUser(userId: string, userData: unknown) {
    return dbQueries.updateUser(userId, userData as Parameters<typeof dbQueries.updateUser>[1]);
  }

  // Listing operations
  async getListingById(listingId: string) {
    return dbQueries.getListingById(listingId);
  }

  async createListing(listingData: unknown) {
    return dbQueries.createListing(listingData as Parameters<typeof dbQueries.createListing>[0]);
  }

  async updateListing(listingId: string, listingData: unknown) {
    return dbQueries.updateListing(listingId, listingData as Parameters<typeof dbQueries.updateListing>[1]);
  }

  async findListingByMarketplace(marketplace: string, marketplaceId: string) {
    return dbQueries.findListingByMarketplace(marketplace, marketplaceId);
  }

  // Evaluation operations
  async createAIEvaluation(evaluationData: unknown) {
    return dbQueries.createAIEvaluation(evaluationData as Parameters<typeof dbQueries.createAIEvaluation>[0]);
  }

  async getEvaluationByListingId(listingId: string) {
    return dbQueries.getEvaluationByListingId(listingId);
  }

  // Recommendation operations
  async createRecommendation(recommendationData: unknown) {
    return dbQueries.createRecommendation(recommendationData as Parameters<typeof dbQueries.createRecommendation>[0]);
  }

  async getRecommendationsByUserId(userId: string, options?: unknown) {
    return dbQueries.getRecommendationsByUserId(userId, options as Parameters<typeof dbQueries.getRecommendationsByUserId>[1]);
  }

  async getRecommendationById(recommendationId: string) {
    return dbQueries.getRecommendationById(recommendationId);
  }

  async updateRecommendation(recommendationId: string, recommendationData: unknown) {
    return dbQueries.updateRecommendation(recommendationId, recommendationData as Parameters<typeof dbQueries.updateRecommendation>[1]);
  }

  // Notification operations
  async createNotification(notificationData: unknown) {
    return dbQueries.createNotification(notificationData as Parameters<typeof dbQueries.createNotification>[0]);
  }

  async getUnreadNotifications(userId: string, options?: unknown) {
    return dbQueries.getUnreadNotifications(userId, options as Parameters<typeof dbQueries.getUnreadNotifications>[1]);
  }

  async markNotificationAsRead(notificationId: string) {
    return dbQueries.markNotificationAsRead(notificationId);
  }

  // Search preference operations
  async createPreference(preferenceData: unknown) {
    return dbQueries.createPreference(preferenceData as Parameters<typeof dbQueries.createPreference>[0]);
  }

  async getPreferencesByUserId(userId: string, options?: unknown) {
    return dbQueries.getPreferencesByUserId(userId, options as Parameters<typeof dbQueries.getPreferencesByUserId>[1]);
  }

  async getActivePreferences(userId: string) {
    return dbQueries.getActivePreferences(userId);
  }

  async updatePreference(preferenceId: string, preferenceData: unknown) {
    return dbQueries.updatePreference(preferenceId, preferenceData as Parameters<typeof dbQueries.updatePreference>[1]);
  }

  async deletePreference(preferenceId: string) {
    return dbQueries.deletePreference(preferenceId);
  }
}

/**
 * DatabaseService Tests
 * 
 * Tests for database service wrapper
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseService } from '../database.service';

// Mock database query functions
vi.mock('../../db/queries', () => ({
  getUserById: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  getListingById: vi.fn(),
  createListing: vi.fn(),
  updateListing: vi.fn(),
  findListingByMarketplace: vi.fn(),
  createAIEvaluation: vi.fn(),
  getEvaluationByListingId: vi.fn(),
  createRecommendation: vi.fn(),
  getRecommendationsByUserId: vi.fn(),
  getRecommendationById: vi.fn(),
  updateRecommendation: vi.fn(),
  createNotification: vi.fn(),
  getUnreadNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
  createPreference: vi.fn(),
  getPreferencesByUserId: vi.fn(),
  getActivePreferences: vi.fn(),
  updatePreference: vi.fn(),
  deletePreference: vi.fn(),
}));

import * as dbQueries from '../../db/queries';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(() => {
    service = new DatabaseService();
    vi.clearAllMocks();
  });

  describe('User operations', () => {
    it('should get user by ID', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      vi.mocked(dbQueries.getUserById).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof dbQueries.getUserById>>
      );

      const result = await service.getUserById('user-123');

      expect(result).toEqual(mockUser);
      expect(dbQueries.getUserById).toHaveBeenCalledWith('user-123');
    });

    it('should create user', async () => {
      const userData = { email: 'test@example.com' };
      const mockUser = { id: 'user-123', ...userData };
      vi.mocked(dbQueries.createUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof dbQueries.createUser>>
      );

      const result = await service.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(dbQueries.createUser).toHaveBeenCalledWith(userData);
    });

    it('should update user', async () => {
      const updateData = { email: 'new@example.com' };
      const mockUser = { id: 'user-123', ...updateData };
      vi.mocked(dbQueries.updateUser).mockResolvedValue(
        mockUser as unknown as Awaited<ReturnType<typeof dbQueries.updateUser>>
      );

      const result = await service.updateUser('user-123', updateData);

      expect(result).toEqual(mockUser);
      expect(dbQueries.updateUser).toHaveBeenCalledWith('user-123', updateData);
    });
  });

  describe('Listing operations', () => {
    it('should get listing by ID', async () => {
      const mockListing = { id: 'listing-123', title: 'Test Listing' };
      vi.mocked(dbQueries.getListingById).mockResolvedValue(
        mockListing as unknown as Awaited<ReturnType<typeof dbQueries.getListingById>>
      );

      const result = await service.getListingById('listing-123');

      expect(result).toEqual(mockListing);
      expect(dbQueries.getListingById).toHaveBeenCalledWith('listing-123');
    });

    it('should create listing', async () => {
      const listingData = { title: 'Test Listing', price: 99.99 };
      const mockListing = { id: 'listing-123', ...listingData };
      vi.mocked(dbQueries.createListing).mockResolvedValue(
        mockListing as unknown as Awaited<ReturnType<typeof dbQueries.createListing>>
      );

      const result = await service.createListing(listingData);

      expect(result).toEqual(mockListing);
      expect(dbQueries.createListing).toHaveBeenCalledWith(listingData);
    });

    it('should find listing by marketplace', async () => {
      const mockListing = { id: 'listing-123', marketplace: 'amazon', marketplaceId: 'B08XYZ123' };
      vi.mocked(dbQueries.findListingByMarketplace).mockResolvedValue(
        mockListing as unknown as Awaited<ReturnType<typeof dbQueries.findListingByMarketplace>>
      );

      const result = await service.findListingByMarketplace('amazon', 'B08XYZ123');

      expect(result).toEqual(mockListing);
      expect(dbQueries.findListingByMarketplace).toHaveBeenCalledWith('amazon', 'B08XYZ123');
    });
  });

  describe('Evaluation operations', () => {
    it('should create AI evaluation', async () => {
      const evaluationData = { listingId: 'listing-123', confidenceScore: 85 };
      const mockEvaluation = { id: 'eval-123', ...evaluationData };
      vi.mocked(dbQueries.createAIEvaluation).mockResolvedValue(
        mockEvaluation as unknown as Awaited<ReturnType<typeof dbQueries.createAIEvaluation>>
      );

      const result = await service.createAIEvaluation(evaluationData);

      expect(result).toEqual(mockEvaluation);
      expect(dbQueries.createAIEvaluation).toHaveBeenCalledWith(evaluationData);
    });

    it('should get evaluation by listing ID', async () => {
      const mockEvaluation = { id: 'eval-123', listingId: 'listing-123' };
      vi.mocked(dbQueries.getEvaluationByListingId).mockResolvedValue(
        mockEvaluation as unknown as Awaited<ReturnType<typeof dbQueries.getEvaluationByListingId>>
      );

      const result = await service.getEvaluationByListingId('listing-123');

      expect(result).toEqual(mockEvaluation);
      expect(dbQueries.getEvaluationByListingId).toHaveBeenCalledWith('listing-123');
    });
  });

  describe('Recommendation operations', () => {
    it('should get recommendations by user ID', async () => {
      const mockRecommendations = [
        { id: 'rec-1', userId: 'user-123' },
        { id: 'rec-2', userId: 'user-123' },
      ];
      vi.mocked(dbQueries.getRecommendationsByUserId).mockResolvedValue(
        mockRecommendations as unknown as Awaited<ReturnType<typeof dbQueries.getRecommendationsByUserId>>
      );

      const result = await service.getRecommendationsByUserId('user-123');

      expect(result).toEqual(mockRecommendations);
      expect(dbQueries.getRecommendationsByUserId).toHaveBeenCalledWith('user-123', undefined);
    });

    it('should get recommendations with options', async () => {
      const options = { status: 'active', limit: 10 };
      const mockRecommendations = [{ id: 'rec-1' }];
      vi.mocked(dbQueries.getRecommendationsByUserId).mockResolvedValue(
        mockRecommendations as unknown as Awaited<ReturnType<typeof dbQueries.getRecommendationsByUserId>>
      );

      const result = await service.getRecommendationsByUserId('user-123', options);

      expect(result).toEqual(mockRecommendations);
      expect(dbQueries.getRecommendationsByUserId).toHaveBeenCalledWith('user-123', options);
    });
  });

  describe('Notification operations', () => {
    it('should get unread notifications', async () => {
      const mockNotifications = [
        { id: 'notif-1', read: false },
        { id: 'notif-2', read: false },
      ];
      vi.mocked(dbQueries.getUnreadNotifications).mockResolvedValue(
        mockNotifications as unknown as Awaited<ReturnType<typeof dbQueries.getUnreadNotifications>>
      );

      const result = await service.getUnreadNotifications('user-123');

      expect(result).toEqual(mockNotifications);
      expect(dbQueries.getUnreadNotifications).toHaveBeenCalledWith('user-123', undefined);
    });

    it('should mark notification as read', async () => {
      const mockNotification = { id: 'notif-1', read: true };
      vi.mocked(dbQueries.markNotificationAsRead).mockResolvedValue(
        mockNotification as unknown as Awaited<ReturnType<typeof dbQueries.markNotificationAsRead>>
      );

      const result = await service.markNotificationAsRead('notif-1');

      expect(result).toEqual(mockNotification);
      expect(dbQueries.markNotificationAsRead).toHaveBeenCalledWith('notif-1');
    });
  });

  describe('Preference operations', () => {
    it('should get active preferences', async () => {
      const mockPreferences = [
        { id: 'pref-1', isActive: true },
        { id: 'pref-2', isActive: true },
      ];
      vi.mocked(dbQueries.getActivePreferences).mockResolvedValue(
        mockPreferences as unknown as Awaited<ReturnType<typeof dbQueries.getActivePreferences>>
      );

      const result = await service.getActivePreferences('user-123');

      expect(result).toEqual(mockPreferences);
      expect(dbQueries.getActivePreferences).toHaveBeenCalledWith('user-123');
    });

    it('should delete preference', async () => {
      vi.mocked(dbQueries.deletePreference).mockResolvedValue(undefined);

      await service.deletePreference('pref-1');

      expect(dbQueries.deletePreference).toHaveBeenCalledWith('pref-1');
    });
  });
});

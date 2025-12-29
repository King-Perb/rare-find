/**
 * EvaluationService Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EvaluationService } from '../evaluation.service';
import { AppError } from '../../errors';
import { createMockLogger, createSampleListing, createSampleEvaluationResult } from './test-utils';
import type { ILogger } from '../interfaces';
import type { EvaluationInput } from '../../ai/types';

// Mock the AI evaluation function
vi.mock('../../ai/evaluate-user-listing', () => ({
  evaluateUserListing: vi.fn(),
}));

import { evaluateUserListing as evaluateUserListingImpl } from '../../ai/evaluate-user-listing';

describe('EvaluationService', () => {
  let service: EvaluationService;
  let mockLogger: ILogger;

  beforeEach(() => {
    mockLogger = createMockLogger();
    service = new EvaluationService(mockLogger);
    vi.clearAllMocks();
  });

  describe('evaluateListing', () => {
    it('should evaluate listing successfully', async () => {
      const listing = createSampleListing();
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
        category: listing.category,
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(input);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting listing evaluation',
        expect.objectContaining({
          listingId: listing.marketplaceId,
          marketplace: listing.marketplace,
          mode: 'multimodal',
        })
      );
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Evaluation completed successfully',
        expect.objectContaining({
          listingId: listing.marketplaceId,
          confidenceScore: evaluationResult.evaluation.confidenceScore,
        })
      );
    });

    it('should handle text-only mode', async () => {
      const listing = createSampleListing();
      const evaluationResult = createSampleEvaluationResult({
        evaluationMode: 'text-only',
      });
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
        category: listing.category,
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(input);
    });

    it('should log evaluation start with correct parameters', async () => {
      const listing = createSampleListing({ images: ['img1.jpg', 'img2.jpg'] });
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
        category: listing.category,
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      await service.evaluateListing(input);

      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting listing evaluation',
        expect.objectContaining({
          hasImages: true,
        })
      );
    });

    it('should throw AppError if evaluation fails', async () => {
      const listing = createSampleListing();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
        category: listing.category,
      };

      const error = new Error('AI service unavailable');
      vi.mocked(evaluateUserListingImpl).mockRejectedValue(error);

      await expect(service.evaluateListing(input)).rejects.toThrow(AppError);
      await expect(service.evaluateListing(input)).rejects.toThrow('Failed to evaluate listing with AI');

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to evaluate listing',
        expect.objectContaining({
          listingId: listing.marketplaceId,
        })
      );
    });

    it('should re-throw AppError if evaluation throws AppError', async () => {
      const listing = createSampleListing();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
        category: listing.category,
      };

      const appError = new AppError('Invalid listing format', 400, 'INVALID_FORMAT');
      vi.mocked(evaluateUserListingImpl).mockRejectedValue(appError);

      await expect(service.evaluateListing(input)).rejects.toThrow(AppError);
      await expect(service.evaluateListing(input)).rejects.toThrow('Invalid listing format');
    });

    it('should handle evaluation with no images', async () => {
      const listing = createSampleListing({ images: [] });
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
        category: listing.category,
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting listing evaluation',
        expect.objectContaining({
          hasImages: false,
        })
      );
    });
  });
});

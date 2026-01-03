import { describe, it, expect, vi, beforeEach } from 'vitest';
import type OpenAI from 'openai';
import { EvaluationService } from '../../src/lib/evaluation/services/evaluation.service';
import type { ILogger } from '../../src/lib/interfaces';
import type { EvaluationInput, EvaluationResult } from '../../src/lib/evaluation/types';
import type { MarketplaceListing } from '../../src/lib/marketplace/types';
import { AppError } from '../../src/lib/errors';

// Mock the evaluateUserListing function
vi.mock('../../src/lib/evaluation/evaluate-user-listing', () => ({
  evaluateUserListing: vi.fn(),
}));

import { evaluateUserListing as evaluateUserListingImpl } from '../../src/lib/evaluation/evaluate-user-listing';

describe('EvaluationService', () => {
  let mockLogger: ILogger;
  let mockOpenAIClient: OpenAI;
  let service: EvaluationService;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    mockOpenAIClient = {
      responses: {
        create: vi.fn(),
      },
    } as unknown as OpenAI;
    service = new EvaluationService(mockLogger, mockOpenAIClient);
    vi.clearAllMocks();
  });

  describe('evaluateListing', () => {
    it('should evaluate listing successfully', async () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: ['https://example.com/image.jpg'],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const evaluationResult: EvaluationResult = {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 33.3,
          confidenceScore: 85,
          reasoning: 'Good deal based on market analysis',
          factors: ['Below market average', 'Good condition'],
          isReplicaOrNovelty: false,
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.2.0',
        evaluationMode: 'multimodal',
        evaluatedAt: new Date(),
      };
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(input, mockOpenAIClient, mockLogger, undefined);
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
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const evaluationResult: EvaluationResult = {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 33.3,
          confidenceScore: 70,
          reasoning: 'Good deal based on text analysis',
          factors: ['Below market average'],
          isReplicaOrNovelty: false,
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.2.0',
        evaluationMode: 'text-only',
        evaluatedAt: new Date(),
      };
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(input, mockOpenAIClient, mockLogger, undefined);
    });

    it('should log evaluation start with correct parameters', async () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: ['img1.jpg', 'img2.jpg'],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const evaluationResult: EvaluationResult = {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 33.3,
          confidenceScore: 85,
          reasoning: 'Good deal',
          factors: [],
          isReplicaOrNovelty: false,
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.2.0',
        evaluationMode: 'multimodal',
        evaluatedAt: new Date(),
      };
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
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
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
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
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
      };

      const appError = new AppError('Invalid listing format', 400, 'INVALID_FORMAT');
      vi.mocked(evaluateUserListingImpl).mockRejectedValue(appError);

      await expect(service.evaluateListing(input)).rejects.toThrow(AppError);
      await expect(service.evaluateListing(input)).rejects.toThrow('Invalid listing format');
    });

    it('should handle evaluation with no images', async () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const evaluationResult: EvaluationResult = {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 33.3,
          confidenceScore: 70,
          reasoning: 'Good deal',
          factors: [],
          isReplicaOrNovelty: false,
        },
        modelVersion: 'gpt-4o',
        promptVersion: '1.2.0',
        evaluationMode: 'text-only',
        evaluatedAt: new Date(),
      };
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
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

    it('should pass model to evaluateUserListing when provided', async () => {
      const listing: MarketplaceListing = {
        id: 'listing-1',
        marketplace: 'amazon',
        marketplaceId: 'B08XYZ1234',
        title: 'Test Product',
        price: 99.99,
        currency: 'USD',
        images: [],
        listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
        available: true,
      };
      const evaluationResult: EvaluationResult = {
        evaluation: {
          estimatedMarketValue: 150,
          undervaluationPercentage: 33.3,
          confidenceScore: 70,
          reasoning: 'Good deal',
          factors: [],
          isReplicaOrNovelty: false,
        },
        modelVersion: 'gpt-4o-mini',
        promptVersion: '1.2.0',
        evaluationMode: 'text-only',
        evaluatedAt: new Date(),
      };
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
      };

      const serviceWithModel = new EvaluationService(mockLogger, mockOpenAIClient, 'gpt-4o-mini');
      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      await serviceWithModel.evaluateListing(input);

      expect(evaluateUserListingImpl).toHaveBeenCalledWith(input, mockOpenAIClient, mockLogger, 'gpt-4o-mini');
    });
  });
});

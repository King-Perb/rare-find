/**
 * EvaluationService Integration Tests
 *
 * Tests shared EvaluationService with web-specific OpenAI client and logger
 * These tests verify that the shared business logic works correctly with platform-specific implementations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EvaluationService } from '@rare-find/shared/lib/evaluation/services/evaluation.service';
import { createMockLogger, createSampleListing, createSampleEvaluationResult } from '../../services/__tests__/test-utils';
import type { ILogger } from '@rare-find/shared/lib/interfaces';
import type { EvaluationInput } from '@rare-find/shared';
import OpenAI from 'openai';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = {
        completions: {
          create: vi.fn(),
        },
      };
    },
  };
});

// Mock the evaluateUserListing function
vi.mock('@rare-find/shared/lib/evaluation/evaluate-user-listing', () => ({
  evaluateUserListing: vi.fn(),
}));

import { evaluateUserListing as evaluateUserListingImpl } from '@rare-find/shared/lib/evaluation/evaluate-user-listing';

describe('EvaluationService Integration (Web)', () => {
  let service: EvaluationService;
  let logger: ILogger;
  let openaiClient: OpenAI;

  beforeEach(() => {
    logger = createMockLogger();
    openaiClient = new OpenAI({ apiKey: 'test-key' });
    service = new EvaluationService(logger, openaiClient);
    vi.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should initialize EvaluationService with web OpenAI client and logger', () => {
      expect(service).toBeInstanceOf(EvaluationService);
    });

    it('should accept optional model parameter', () => {
      const serviceWithModel = new EvaluationService(logger, openaiClient, 'gpt-4o');
      expect(serviceWithModel).toBeInstanceOf(EvaluationService);
    });
  });

  describe('Evaluation with Web Providers', () => {
    it('should evaluate listing using web OpenAI client', async () => {
      const listing = createSampleListing();
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      const result = await service.evaluateListing(input);

      expect(result).toEqual(evaluationResult);
      // Verify web OpenAI client is passed to evaluation function
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(
        input,
        openaiClient,
        logger,
        undefined
      );
    });

    it('should use custom model when provided', async () => {
      const serviceWithModel = new EvaluationService(logger, openaiClient, 'gpt-4-turbo');
      const listing = createSampleListing();
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'text-only',
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      await serviceWithModel.evaluateListing(input);

      // Verify custom model is passed
      expect(evaluateUserListingImpl).toHaveBeenCalledWith(
        input,
        openaiClient,
        logger,
        'gpt-4-turbo'
      );
    });

    it('should log evaluation operations', async () => {
      const listing = createSampleListing();
      const evaluationResult = createSampleEvaluationResult();
      const input: EvaluationInput = {
        listing,
        mode: 'multimodal',
      };

      vi.mocked(evaluateUserListingImpl).mockResolvedValue(evaluationResult);

      await service.evaluateListing(input);

      expect(logger.info).toHaveBeenCalledWith(
        'Starting listing evaluation',
        expect.objectContaining({
          listingId: listing.marketplaceId,
        })
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Evaluation completed successfully',
        expect.any(Object)
      );
    });
  });
});

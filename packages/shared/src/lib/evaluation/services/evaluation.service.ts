/**
 * Evaluation Service
 *
 * Handles AI evaluation of marketplace listings
 * Platform-agnostic implementation that accepts logger and OpenAI client via dependency injection
 */

import type OpenAI from 'openai';
import type { IEvaluationService, ILogger } from '../../interfaces';
import type { EvaluationInput, EvaluationResult } from '../types';
import { evaluateUserListing as evaluateUserListingImpl } from '../evaluate-user-listing';
import { AppError } from '../../errors';

export class EvaluationService implements IEvaluationService {
  constructor(
    private readonly logger: ILogger,
    private readonly openaiClient: OpenAI,
    private readonly model?: string
  ) {}

  async evaluateListing(input: EvaluationInput): Promise<EvaluationResult> {
    const { listing, mode } = input;

    this.logger.info('Starting listing evaluation', {
      listingId: listing.marketplaceId,
      marketplace: listing.marketplace,
      mode,
      hasImages: listing.images?.length > 0,
    });

    try {
      const result = await evaluateUserListingImpl(input, this.openaiClient, this.logger, this.model);

      this.logger.info('Evaluation completed successfully', {
        listingId: listing.marketplaceId,
        confidenceScore: result.evaluation.confidenceScore,
        undervaluationPercentage: result.evaluation.undervaluationPercentage,
        mode: result.evaluationMode,
      });

      return result;
    } catch (error) {
      this.logger.error('Failed to evaluate listing', {
        error: error instanceof Error ? error.message : String(error),
        listingId: listing.marketplaceId,
        mode,
      });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to evaluate listing with AI',
        500,
        'EVALUATION_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }
}

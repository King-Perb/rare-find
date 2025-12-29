/**
 * Evaluation Service
 *
 * Handles AI evaluation of marketplace listings
 */

import type { IEvaluationService, ILogger } from './interfaces';
import type { EvaluationInput, EvaluationResult } from '../ai/types';
import { evaluateUserListing as evaluateUserListingImpl } from '../ai/evaluate-user-listing';
import { AppError } from '../errors';

export class EvaluationService implements IEvaluationService {
  constructor(private readonly logger: ILogger) {}

  async evaluateListing(input: EvaluationInput): Promise<EvaluationResult> {
    const { listing, mode } = input;

    this.logger.info('Starting listing evaluation', {
      listingId: listing.marketplaceId,
      marketplace: listing.marketplace,
      mode,
      hasImages: listing.images?.length > 0,
    });

    try {
      const result = await evaluateUserListingImpl(input);

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

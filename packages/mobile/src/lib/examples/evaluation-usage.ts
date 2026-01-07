/**
 * Evaluation Service Usage Example
 *
 * Example demonstrating how to use EvaluationService in the mobile app
 * with platform-specific providers (MobileLogger, OpenAI client)
 *
 * ⚠️ SECURITY WARNING: This example uses EXPO_PUBLIC_OPENAI_API_KEY which
 * exposes your API key in the app bundle. This is ONLY safe for development/testing.
 * For production, use a backend API proxy instead (see doc/ENV_SETUP.md and doc/SECURITY_WARNING.md)
 */

import { EvaluationService } from '@rare-find/shared/lib/evaluation/services/evaluation.service';
import { createMobileLogger } from '../logger/mobile-logger';
import OpenAI from 'openai';
import type {
  EvaluationInput,
  EvaluationResult,
  MarketplaceListing,
} from '@rare-find/shared';

/**
 * Example: Initialize EvaluationService with mobile providers
 */
export function createEvaluationService(): EvaluationService {
  // Create platform-specific logger
  const logger = createMobileLogger();

  // Initialize OpenAI client
  // ⚠️ SECURITY WARNING: Using EXPO_PUBLIC_OPENAI_API_KEY exposes your API key in the app bundle!
  // For production, use a backend API proxy instead (see doc/ENV_SETUP.md)
  // This is only safe for development/testing
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'EXPO_PUBLIC_OPENAI_API_KEY environment variable is not set. ' +
      '⚠️ WARNING: In production, use a backend API proxy instead of exposing API keys in the app bundle.'
    );
  }

  const openaiClient = new OpenAI({
    apiKey,
    // Note: OpenAI SDK works in React Native, but you may need to configure
    // the base URL if using a proxy or custom endpoint
  });

  // Optional: Override model (defaults to 'gpt-4o' from shared package)
  const model = process.env.EXPO_PUBLIC_OPENAI_MODEL;

  // Create and return EvaluationService
  return new EvaluationService(logger, openaiClient, model);
}

/**
 * Example: Evaluate a listing
 */
export async function exampleEvaluateListing(
  listing: MarketplaceListing
): Promise<EvaluationResult> {
  const service = createEvaluationService();

  const input: EvaluationInput = {
    listing,
    mode: listing.images && listing.images.length > 0 ? 'multimodal' : 'text-only',
    category: listing.category,
  };

  try {
    const result = await service.evaluateListing(input);
    console.log('Evaluation completed');
    console.log('Confidence Score:', result.evaluation.confidenceScore);
    console.log('Estimated Market Value:', result.evaluation.estimatedMarketValue);
    console.log('Undervaluation Percentage:', result.evaluation.undervaluationPercentage);
    return result;
  } catch (error) {
    console.error('Failed to evaluate listing:', error);
    throw error;
  }
}

/**
 * Example: Evaluate listing from URL
 * Combines MarketplaceService and EvaluationService
 */
export async function exampleEvaluateListingFromUrl(
  listingUrl: string
): Promise<EvaluationResult> {
  // Import MarketplaceService (from marketplace-usage example)
  const { createMarketplaceService } = await import('./marketplace-usage');
  const marketplaceService = createMarketplaceService();
  const evaluationService = createEvaluationService();

  try {
    // Step 1: Fetch listing from marketplace
    console.log('Fetching listing from URL...');
    const listing = await marketplaceService.fetchListingFromUrl(listingUrl);

    // Step 2: Evaluate the listing
    console.log('Evaluating listing...');
    const input: EvaluationInput = {
      listing,
      mode: listing.images && listing.images.length > 0 ? 'multimodal' : 'text-only',
      category: listing.category,
    };

    const result = await evaluationService.evaluateListing(input);

    console.log('Evaluation complete!');
    console.log('Listing:', listing.title);
    console.log('Confidence:', result.evaluation.confidenceScore);
    console.log('Market Value:', result.evaluation.estimatedMarketValue);
    console.log('Undervaluation:', result.evaluation.undervaluationPercentage, '%');

    return result;
  } catch (error) {
    console.error('Failed to evaluate listing from URL:', error);
    throw error;
  }
}

/**
 * Example: Batch evaluate multiple listings
 */
export async function exampleBatchEvaluate(
  listingUrls: string[]
): Promise<EvaluationResult[]> {
  const { createMarketplaceService } = await import('./marketplace-usage');
  const marketplaceService = createMarketplaceService();
  const evaluationService = createEvaluationService();

  const results: EvaluationResult[] = [];

  for (const url of listingUrls) {
    try {
      const listing = await marketplaceService.fetchListingFromUrl(url);
      const input: EvaluationInput = {
        listing,
        mode: listing.images && listing.images.length > 0 ? 'multimodal' : 'text-only',
        category: listing.category,
      };

      const result = await evaluationService.evaluateListing(input);
      results.push(result);
    } catch (error) {
      console.error(`Failed to evaluate listing ${url}:`, error);
      // Continue with next listing
    }
  }

  return results;
}

/**
 * POST /api/marketplace/evaluate
 * 
 * Evaluate a marketplace listing using AI (GPT-4o multimodal)
 * 
 * Supports both workflows:
 * - User-provided listings: Full multimodal evaluation with image analysis
 * - Automated scanning: Text-only evaluation (optimized)
 * 
 * Request body:
 * {
 *   listingUrl?: string,        // URL to fetch listing from
 *   listing?: MarketplaceListing, // Or provide listing data directly
 *   mode?: 'multimodal' | 'text-only' // Defaults to 'multimodal' for user-provided
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   result: EvaluationResult,
 *   listing: MarketplaceListing
 * }
 */

import { NextResponse } from 'next/server';
import { withApiHandler, requireAuth, parseJsonBody } from '../../middleware';
import type {
  EvaluateListingRequest,
  EvaluateListingApiResponse,
  EvaluationInput,
} from '@/lib/ai/types';
import { ValidationError } from '@/lib/errors';
import { container, ServiceKeys } from '@/lib/di/container';
import type {
  IMarketplaceService,
  IListingService,
  IEvaluationService,
  ILogger,
} from '@/lib/services/interfaces';
import type { MarketplaceListing } from '@/lib/marketplace/types';

export const POST = withApiHandler<EvaluateListingApiResponse>(
  async (req, context) => {
    // Authentication is optional - allow public evaluation for home page
    // Logged-in users will have context.userId set for tracking
    // Public users can still evaluate listings

    // Resolve services from DI container
    const logger = container.resolve<ILogger>(ServiceKeys.Logger);
    const marketplaceService = container.resolve<IMarketplaceService>(ServiceKeys.MarketplaceService);
    const listingService = container.resolve<IListingService>(ServiceKeys.ListingService);
    const evaluationService = container.resolve<IEvaluationService>(ServiceKeys.EvaluationService);

    // Parse request body
    const body = await parseJsonBody<EvaluateListingRequest>(req);

    // Validate request
    if (!body.listingUrl && !body.listing) {
      throw new ValidationError('Either listingUrl or listing must be provided');
    }

    // Determine evaluation mode (default to multimodal for user-provided listings)
    const mode = body.mode || 'multimodal';

    // Get listing data
    let listing: MarketplaceListing;
    if (body.listingUrl) {
      listing = await marketplaceService.fetchListingFromUrl(body.listingUrl);
    } else if (body.listing) {
      listing = body.listing;
    } else {
      throw new ValidationError('Listing data is required');
    }

    // Normalize and validate listing
    listing = listingService.normalizeListing(listing);
    listingService.validateListing(listing);

    logger.info('Evaluating listing', {
      listingId: listing.marketplaceId,
      marketplace: listing.marketplace,
      mode,
      userId: context.userId,
    });

    // Evaluate listing
    const evaluationInput: EvaluationInput = {
      listing,
      mode,
      category: listing.category,
    };

    const result = await evaluationService.evaluateListing(evaluationInput);

    // Return success response
    return NextResponse.json({
      success: true,
      result,
      listing,
    } satisfies EvaluateListingApiResponse);
  }
);


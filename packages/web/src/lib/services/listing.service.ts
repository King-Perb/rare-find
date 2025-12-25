/**
 * Listing Service
 * 
 * Handles listing validation and business logic
 */

import type { IListingService } from './interfaces';
import type { ILogger } from './interfaces';
import type { MarketplaceListing } from '../marketplace/types';
import { ValidationError } from '../errors';

export class ListingService implements IListingService {
  constructor(private readonly logger: ILogger) {}

  validateListing(listing: MarketplaceListing): void {
    if (!listing.title || listing.title.trim().length === 0) {
      throw new ValidationError('Listing title is required');
    }

    if (!listing.price || listing.price <= 0) {
      throw new ValidationError('Listing price must be greater than 0');
    }

    if (!listing.marketplace || !['amazon', 'ebay'].includes(listing.marketplace)) {
      throw new ValidationError('Invalid marketplace');
    }

    if (!listing.marketplaceId || listing.marketplaceId.trim().length === 0) {
      throw new ValidationError('Marketplace ID is required');
    }

    if (!listing.listingUrl || listing.listingUrl.trim().length === 0) {
      throw new ValidationError('Listing URL is required');
    }
  }

  normalizeListing(listing: MarketplaceListing): MarketplaceListing {
    // Normalize listing data (trim strings, ensure consistent format, etc.)
    return {
      ...listing,
      title: listing.title.trim(),
      description: listing.description?.trim(),
      marketplaceId: listing.marketplaceId.trim().toUpperCase(),
      listingUrl: listing.listingUrl.trim(),
      currency: listing.currency || 'USD',
      available: listing.available ?? true,
    };
  }
}


/**
 * Marketplace Service
 * 
 * Handles marketplace URL parsing, fetching listings, and marketplace client management
 */

import type { IMarketplaceService, ILogger } from './interfaces';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from '../marketplace/types';
import { ValidationError, AppError } from '../errors';
import { createAmazonClient, type AmazonClient } from '../marketplace/amazon/client';
import { createEbayClient, type eBayClient } from '../marketplace/ebay/client';

export class MarketplaceService implements IMarketplaceService {
  private readonly amazonClient: AmazonClient;
  private readonly ebayClient: eBayClient;

  constructor(
    private readonly logger: ILogger,
    amazonClient?: AmazonClient,
    ebayClient?: eBayClient
  ) {
    // Allow injection of clients for testing, or create new instances
    this.amazonClient = amazonClient || createAmazonClient();
    this.ebayClient = ebayClient || createEbayClient();
  }

  parseMarketplaceUrl(url: string): {
    marketplace: 'amazon' | 'ebay';
    marketplaceId: string;
  } {
    try {
      const urlObj = new URL(url);

      // Amazon URL patterns
      if (urlObj.hostname.includes('amazon.')) {
        // Extract ASIN from URL (e.g., /dp/B08XYZ123 or /gp/product/B08XYZ123)
        const asinRegex = /\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i;
        const asinMatch = asinRegex.exec(url);
        if (asinMatch?.[1]) {
          return {
            marketplace: 'amazon',
            marketplaceId: asinMatch[1].toUpperCase(),
          };
        }
        throw new ValidationError('Could not extract ASIN from Amazon URL');
      }

      // eBay URL patterns
      if (urlObj.hostname.includes('ebay.')) {
        // Extract item ID from URL (e.g., /itm/123456789)
        const itemIdRegex = /\/itm\/(\d+)/;
        const itemIdMatch = itemIdRegex.exec(url);
        if (itemIdMatch?.[1]) {
          return {
            marketplace: 'ebay',
            marketplaceId: itemIdMatch[1],
          };
        }
        throw new ValidationError('Could not extract item ID from eBay URL');
      }

      throw new ValidationError('Unsupported marketplace URL');
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Invalid URL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async fetchListingFromUrl(listingUrl: string): Promise<MarketplaceListing> {
    const { marketplace, marketplaceId } = this.parseMarketplaceUrl(listingUrl);

    this.logger.info('Fetching listing from marketplace', {
      marketplace,
      marketplaceId,
      url: listingUrl,
    });

    try {
      const listing = await this.getListingById(marketplace, marketplaceId);
      
      if (!listing) {
        throw new AppError(
          `Listing not found: ${marketplaceId}`,
          404,
          'LISTING_NOT_FOUND'
        );
      }

      return listing;
    } catch (error) {
      if (error instanceof AppError || error instanceof ValidationError) {
        throw error;
      }
      throw new AppError(
        `Failed to fetch listing: ${error instanceof Error ? error.message : String(error)}`,
        500,
        'FETCH_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  async getListingById(marketplace: 'amazon' | 'ebay', marketplaceId: string): Promise<MarketplaceListing | null> {
    try {
      if (marketplace === 'amazon') {
        return await this.amazonClient.getItemById(marketplaceId);
      }

      if (marketplace === 'ebay') {
        return await this.ebayClient.getItemById(marketplaceId);
      }

      throw new ValidationError(`Unsupported marketplace: ${marketplace}`);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new AppError(
        `Failed to get listing: ${error instanceof Error ? error.message : String(error)}`,
        500,
        'FETCH_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  async search(params: MarketplaceSearchParams & { marketplace?: 'amazon' | 'ebay' }): Promise<MarketplaceSearchResult> {
    // Determine which marketplace to search
    // For now, we'll search both or allow marketplace to be specified in params
    // This is a simplified implementation - you may want to enhance this
    
    if (params.marketplace === 'amazon') {
      return await this.amazonClient.search(params);
    }
    
    if (params.marketplace === 'ebay') {
      return await this.ebayClient.search(params);
    }

    // Default to Amazon if no marketplace specified
    return await this.amazonClient.search(params);
  }
}


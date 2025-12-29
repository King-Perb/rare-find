/**
 * Marketplace Service
 * 
 * Handles marketplace URL parsing, fetching listings, and marketplace client management
 * 
 * Supports multiple Amazon API sources:
 * - PA-API 5.0 (official Amazon Product Advertising API)
 * - RapidAPI Real-Time Amazon Data (alternative, easier setup)
 * 
 * Set AMAZON_API_SOURCE environment variable to choose:
 * - 'pa-api' (default) - Use Amazon PA-API 5.0
 * - 'rapidapi' - Use RapidAPI Real-Time Amazon Data
 */

import type { IMarketplaceService, ILogger } from './interfaces';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult, MarketplaceClient } from '../marketplace/types';
import { ValidationError, AppError } from '../errors';
import { createAmazonClient, type AmazonClient } from '../marketplace/amazon/client';
import { createRapidAPIAmazonClient, isRapidAPIConfigured, type RapidAPIAmazonClient } from '../marketplace/amazon/rapidapi-client';
import { createEbayClient, type eBayClient } from '../marketplace/ebay/client';

/**
 * Amazon API source type
 */
export type AmazonAPISource = 'pa-api' | 'rapidapi';

/**
 * Get the configured Amazon API source
 */
function getAmazonAPISource(): AmazonAPISource {
  const source = process.env.AMAZON_API_SOURCE?.toLowerCase();
  if (source === 'rapidapi') {
    return 'rapidapi';
  }
  return 'pa-api';
}

/**
 * Create the appropriate Amazon client based on configuration
 */
function createConfiguredAmazonClient(logger: ILogger): MarketplaceClient {
  const source = getAmazonAPISource();
  
  if (source === 'rapidapi') {
    if (!isRapidAPIConfigured()) {
      logger.warn('RapidAPI selected but not configured, falling back to PA-API');
      return createAmazonClient();
    }
    logger.info('Using RapidAPI Real-Time Amazon Data client');
    return createRapidAPIAmazonClient();
  }
  
  logger.info('Using Amazon PA-API 5.0 client');
  return createAmazonClient();
}

export class MarketplaceService implements IMarketplaceService {
  private readonly amazonClient: MarketplaceClient;
  private ebayClient: eBayClient | null = null;
  private readonly amazonAPISource: AmazonAPISource;

  constructor(
    private readonly logger: ILogger,
    amazonClient?: MarketplaceClient,
    ebayClient?: eBayClient
  ) {
    // Allow injection of clients for testing, or create new instances
    this.amazonClient = amazonClient || createConfiguredAmazonClient(logger);
    // eBay client is lazy-loaded - only create when needed
    if (ebayClient) {
      this.ebayClient = ebayClient;
    }
    this.amazonAPISource = getAmazonAPISource();
    
    this.logger.info('MarketplaceService initialized', {
      amazonAPISource: this.amazonAPISource,
    });
  }

  /**
   * Get eBay client (lazy initialization)
   * Only creates the client when actually needed
   */
  private getEbayClient(): eBayClient {
    if (!this.ebayClient) {
      try {
        this.ebayClient = createEbayClient();
      } catch (error) {
        throw new AppError(
          'eBay API is not configured. Set EBAY_APP_ID environment variable to enable eBay support.',
          500,
          'EBAY_NOT_CONFIGURED',
          error instanceof Error ? error : undefined
        );
      }
    }
    return this.ebayClient;
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
        return await this.getEbayClient().getItemById(marketplaceId);
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
      return await this.getEbayClient().search(params);
    }

    // Default to Amazon if no marketplace specified
    return await this.amazonClient.search(params);
  }
}


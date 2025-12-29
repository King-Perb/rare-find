/**
 * eBay Finding API client
 *
 * Implements eBay Finding API
 * Note: Finding API only requires App ID (SECURITY-APPNAME), not OAuth
 * OAuth 2.0 is required for other APIs like Trading API
 * Rate limit: ~5000 requests per day (~0.058 requests per second)
 */

import type { eBayCredentials, eBayItem, eBaySearchResponse } from './types';
import { waitForRateLimit } from '../rate-limiter';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from '../types';

export class eBayClient {
  private readonly credentials: eBayCredentials;
  private readonly endpoint: string;
  private readonly siteId: string;

  constructor(credentials: eBayCredentials) {
    this.credentials = credentials;
    this.siteId = credentials.siteId || 'EBAY-US';
    this.endpoint = 'https://svcs.ebay.com/services/search/FindingService/v1';
  }

  /**
   * Build query string for eBay API
   */
  private buildQueryString(params: MarketplaceSearchParams): string {
    const queryParams = new URLSearchParams();

    // Required: OPERATION-NAME
    queryParams.append('OPERATION-NAME', 'findItemsAdvanced');

    // Required: SERVICE-VERSION
    queryParams.append('SERVICE-VERSION', '1.0.0');

    // Required: SECURITY-APPNAME
    queryParams.append('SECURITY-APPNAME', this.credentials.appId);

    // Required: RESPONSE-DATA-FORMAT
    queryParams.append('RESPONSE-DATA-FORMAT', 'JSON');

    // Optional: GLOBAL-ID (site ID)
    queryParams.append('GLOBAL-ID', `EBAY-${this.siteId}`);

    // Keywords
    if (params.keywords && params.keywords.length > 0) {
      queryParams.append('keywords', params.keywords.join(' '));
    }

    // Category
    if (params.category) {
      queryParams.append('categoryId', params.category);
    }

    // Price range
    if (params.minPrice !== undefined) {
      queryParams.append('itemFilter(0).name', 'MinPrice');
      queryParams.append('itemFilter(0).value', params.minPrice.toString());
    }

    if (params.maxPrice !== undefined) {
      const filterIndex = params.minPrice === undefined ? 0 : 1;
      queryParams.append(`itemFilter(${filterIndex}).name`, 'MaxPrice');
      queryParams.append(`itemFilter(${filterIndex}).value`, params.maxPrice.toString());
    }

    // Condition
    if (params.condition) {
      const minPriceFilter = params.minPrice === undefined ? 0 : 1;
      const maxPriceFilter = params.maxPrice === undefined ? 0 : 1;
      const priceFilterCount = minPriceFilter + maxPriceFilter;
      queryParams.append(`itemFilter(${priceFilterCount}).name`, 'Condition');
      queryParams.append(`itemFilter(${priceFilterCount}).value`, this.mapCondition(params.condition));
    }

    // Sort order
    if (params.sortBy) {
      queryParams.append('sortOrder', this.mapSortOrder(params.sortBy));
    }

    // Pagination
    if (params.limit) {
      queryParams.append('paginationInput.entriesPerPage', params.limit.toString());
    }
    if (params.offset) {
      const pageNumber = Math.floor(params.offset / (params.limit || 10)) + 1;
      queryParams.append('paginationInput.pageNumber', pageNumber.toString());
    }

    return queryParams.toString();
  }

  /**
   * Search for items on eBay
   */
  async search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult> {
    // Wait for rate limit
    await waitForRateLimit('ebay');

    try {
      const queryString = this.buildQueryString(params);
      const url = `${this.endpoint}?${queryString}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`eBay API error: ${response.status} ${response.statusText}`);
      }

      const data: eBaySearchResponse = await response.json();
      return this.transformResponse(data);
    } catch (error) {
      console.error('eBay search error:', error);
      throw new Error(`Failed to search eBay: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get item by marketplace ID (eBay item ID)
   *
   * Uses findItemsAdvanced with ItemId filter since Finding API doesn't have GetSingleItem
   */
  async getItemById(marketplaceId: string): Promise<MarketplaceListing | null> {
    await waitForRateLimit('ebay');

    // Validate item ID format (numeric)
    if (!/^\d+$/.test(marketplaceId)) {
      throw new Error(`Invalid eBay item ID format: ${marketplaceId}`);
    }

    try {
      const queryParams = new URLSearchParams();

      // Required parameters
      queryParams.append('OPERATION-NAME', 'findItemsAdvanced');
      queryParams.append('SERVICE-VERSION', '1.0.0');
      queryParams.append('SECURITY-APPNAME', this.credentials.appId);
      queryParams.append('RESPONSE-DATA-FORMAT', 'JSON');
      queryParams.append('GLOBAL-ID', `EBAY-${this.siteId}`);

      // Filter by specific item ID
      queryParams.append('itemFilter(0).name', 'ItemId');
      queryParams.append('itemFilter(0).value', marketplaceId);

      // Request only 1 result
      queryParams.append('paginationInput.entriesPerPage', '1');
      queryParams.append('paginationInput.pageNumber', '1');

      const url = `${this.endpoint}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`eBay API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: eBaySearchResponse = await response.json();

      // Check for errors in response
      const searchResult = data.findItemsAdvancedResponse?.[0]?.searchResult;
      const items = searchResult?.item || [];

      if (items.length === 0) {
        // Item not found
        return null;
      }

      // Transform single item to MarketplaceListing
      const item = items[0];
      return this.transformItemToListing(item);
    } catch (error) {
      console.error('eBay getItemById error:', error);
      throw new Error(`Failed to get eBay item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform a single eBay item to MarketplaceListing
   */
  private transformItemToListing(item: eBayItem): MarketplaceListing {
    return {
      id: item.itemId[0],
      marketplace: 'ebay',
      marketplaceId: item.itemId[0],
      title: item.title[0],
      description: undefined, // Description not available in Finding API
      price: this.extractPrice(item),
      currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
      images: this.extractImages(item),
      category: item.categoryName?.[0],
      condition: item.condition?.[0]?.conditionDisplayName?.[0]?.toLowerCase(),
      sellerName: item.sellerInfo?.[0]?.sellerUserName?.[0],
      sellerRating: this.extractSellerRating(item),
      listingUrl: item.viewItemURL[0],
      available: item.sellingStatus?.[0]?.listingStatus?.[0] !== 'Ended',
    };
  }

  /**
   * Transform eBay API response to common MarketplaceListing format
   */
  private transformResponse(response: eBaySearchResponse): MarketplaceSearchResult {
    const searchResult = response.findItemsAdvancedResponse?.[0]?.searchResult;
    const items = searchResult?.item || [];
    const pagination = response.findItemsAdvancedResponse?.[0]?.paginationOutput;

    const listings: MarketplaceListing[] = items.map((item) => ({
      id: item.itemId[0],
      marketplace: 'ebay',
      marketplaceId: item.itemId[0],
      title: item.title[0],
      description: undefined, // Description not in Finding API - would need GetSingleItem
      price: this.extractPrice(item),
      currency: item.sellingStatus?.[0]?.currentPrice?.[0]?.['@currencyId'] || 'USD',
      images: this.extractImages(item),
      category: item.categoryName?.[0],
      condition: item.condition?.[0]?.conditionDisplayName?.[0]?.toLowerCase(),
      sellerName: item.sellerInfo?.[0]?.sellerUserName?.[0],
      sellerRating: this.extractSellerRating(item),
      listingUrl: item.viewItemURL[0],
      available: item.sellingStatus?.[0]?.listingStatus?.[0] !== 'Ended',
    }));

    const totalEntries = pagination?.totalEntries?.[0]
      ? Number.parseInt(pagination.totalEntries[0], 10)
      : listings.length;
    const totalPages = pagination?.totalPages?.[0]
      ? Number.parseInt(pagination.totalPages[0], 10)
      : 1;
    const currentPage = pagination?.pageNumber?.[0]
      ? Number.parseInt(pagination.pageNumber[0], 10)
      : 1;

    return {
      listings,
      total: totalEntries,
      hasMore: currentPage < totalPages,
    };
  }

  private extractPrice(item: eBayItem): number {
    const price = item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__;
    if (price) {
      return Number.parseFloat(price);
    }
    return 0;
  }

  private extractImages(item: eBayItem): string[] {
    const images: string[] = [];
    if (item.galleryURL?.[0]) {
      images.push(item.galleryURL[0]);
    }
    if (item.pictureURLLarge?.[0]) {
      images.push(item.pictureURLLarge[0]);
    }
    if (item.pictureURLSuperSize?.[0]) {
      images.push(item.pictureURLSuperSize[0]);
    }
    return images;
  }

  private extractSellerRating(item: eBayItem): number | undefined {
    const feedbackPercent = item.sellerInfo?.[0]?.positiveFeedbackPercent?.[0];
    if (feedbackPercent) {
      return Number.parseFloat(feedbackPercent);
    }
    return undefined;
  }

  private mapCondition(condition?: string): string {
    // Map our condition format to eBay condition IDs
    const conditionMap: Record<string, string> = {
      new: '1000', // New
      used: '3000', // Used
      vintage: '175673', // Vintage
      collectible: '2000', // Collectible
      refurbished: '2000', // Refurbished (map to used)
    };
    return conditionMap[condition || ''] || '1000';
  }

  private mapSortOrder(sortBy?: 'price' | 'relevance' | 'newest'): string {
    const sortMap: Record<string, string> = {
      price: 'PricePlusShippingLowest',
      relevance: 'BestMatch',
      newest: 'StartTimeNewest',
    };
    return sortMap[sortBy || ''] || 'BestMatch';
  }
}

/**
 * Create eBay client instance
 */
export function createEbayClient(): eBayClient {
  const appId = process.env.EBAY_APP_ID;

  if (!appId) {
    throw new Error('eBay API credentials are missing. Set EBAY_APP_ID environment variable.');
  }

  // Note: Finding API only requires App ID
  // OAuth token is optional and only needed for certain operations
  // DEV_ID and CERT_ID are for older Trading API, not needed for Finding API
  return new eBayClient({
    appId,
    devId: process.env.EBAY_DEV_ID, // Optional - not used by Finding API
    certId: process.env.EBAY_CERT_ID, // Optional - not used by Finding API
    authToken: process.env.EBAY_AUTH_TOKEN || '', // Optional - not required for Finding API
    siteId: process.env.EBAY_SITE_ID || 'US',
  });
}

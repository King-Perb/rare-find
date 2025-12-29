/**
 * Amazon Product Advertising API client
 *
 * Implements PA-API 5.0 with signature v4 authentication
 * Rate limit: 1 request per second
 */

import { createHash, createHmac } from 'node:crypto';
import type { AmazonCredentials, AmazonItem, AmazonSearchRequest, AmazonSearchResponse, AmazonGetItemsRequest, AmazonGetItemsResponse } from './types';
import { waitForRateLimit } from '../rate-limiter';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from '../types';

export class AmazonClient {
  private readonly credentials: AmazonCredentials;
  private readonly endpoint: string;
  private readonly region: string;
  private readonly getItemsEndpoint: string;

  constructor(credentials: AmazonCredentials) {
    this.credentials = credentials;
    this.region = credentials.region || 'us-east-1';
    const domain = this.getDomainForRegion();
    // PA-API 5.0 uses regional endpoints
    // Format: https://webservices.amazon.{domain}/paapi5/{operation}
    this.endpoint = `https://webservices.amazon.${domain}/paapi5/searchitems`;
    this.getItemsEndpoint = `https://webservices.amazon.${domain}/paapi5/getitems`;
  }

  private getDomainForRegion(): string {
    // Map AWS region to Amazon domain
    // Note: This is a simplified mapping - actual domains depend on marketplace
    const regionMap: Record<string, string> = {
      'us-east-1': 'com',      // US marketplace
      'us-west-1': 'com',       // US marketplace
      'us-west-2': 'com',       // US marketplace
      'eu-west-1': 'co.uk',     // UK marketplace
      'eu-central-1': 'de',     // Germany marketplace
      'ap-southeast-1': 'com.au', // Australia marketplace
      'ap-northeast-1': 'co.jp',  // Japan marketplace
    };
    return regionMap[this.region] || 'com';
  }

  /**
   * Create AWS Signature v4 for PA-API 5.0
   * Implements the full AWS Signature Version 4 signing process
   */
  private createSignature(
    method: string,
    uri: string,
    payload: string,
    operation: string = 'SearchItems'
  ): Record<string, string> {
    const timestamp = new Date().toISOString().replaceAll(/[:-]|\.\d{3}/g, '');
    const dateStamp = timestamp.substring(0, 8);
    const url = new URL(uri);
    const host = url.hostname;

    // Step 1: Create canonical request
    const canonicalUri = url.pathname;
    const canonicalQueryString = '';
    const canonicalHeaders = [
      `host:${host}`,
      `x-amz-date:${timestamp}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
    ].join('\n') + '\n';

    const signedHeaders = 'host;x-amz-date;x-amz-target';
    const payloadHash = this.sha256(payload);

    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join('\n');

    // Step 2: Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      algorithm,
      timestamp,
      credentialScope,
      this.sha256(canonicalRequest),
    ].join('\n');

    // Step 3: Calculate signature
    const kDate = this.hmacSha256(`AWS4${this.credentials.secretKey}`, dateStamp);
    const kRegion = this.hmacSha256(kDate, this.region);
    const kService = this.hmacSha256(kRegion, 'ProductAdvertisingAPI');
    const kSigning = this.hmacSha256(kService, 'aws4_request');
    const signature = this.hmacSha256(kSigning, stringToSign);

    // Step 4: Build authorization header
    const authorization = `${algorithm} Credential=${this.credentials.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'X-Amz-Date': timestamp,
      'X-Amz-Target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': authorization,
    };
  }

  /**
   * Calculate SHA256 hash
   */
  private sha256(data: string): string {
    return createHash('sha256').update(data, 'utf8').digest('hex');
  }

  /**
   * Calculate HMAC-SHA256
   */
  private hmacSha256(key: string | Buffer, data: string): Buffer {
    return createHmac('sha256', key).update(data).digest();
  }

  /**
   * Search for items on Amazon
   */
  async search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult> {
    // Wait for rate limit
    await waitForRateLimit('amazon');

    // Convert marketplace params to Amazon API format
    const amazonParams: AmazonSearchRequest = {
      Keywords: params.keywords?.join(' '),
      SearchIndex: this.mapCategoryToSearchIndex(params.category),
      ItemCount: params.limit || 10,
      ItemPage: params.offset ? Math.floor(params.offset / (params.limit || 10)) + 1 : 1,
      MinPrice: params.minPrice,
      MaxPrice: params.maxPrice,
      Condition: this.mapCondition(params.condition),
      SortBy: this.mapSortBy(params.sortBy),
    };

    try {
      const payload = JSON.stringify(amazonParams);
      const headers = this.createSignature('POST', this.endpoint, payload, 'SearchItems');

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`Amazon API error: ${response.status} ${response.statusText}`);
      }

      const data: AmazonSearchResponse = await response.json();
      return this.transformResponse(data);
    } catch (error) {
      console.error('Amazon search error:', error);
      throw new Error(`Failed to search Amazon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get item by marketplace ID (ASIN)
   */
  async getItemById(marketplaceId: string): Promise<MarketplaceListing | null> {
    await waitForRateLimit('amazon');

    // Validate ASIN format (10 characters, alphanumeric)
    if (!/^[A-Z0-9]{10}$/i.test(marketplaceId)) {
      throw new Error(`Invalid ASIN format: ${marketplaceId}`);
    }

    const getItemsRequest: AmazonGetItemsRequest = {
      ItemIds: [marketplaceId.toUpperCase()],
      Resources: [
        'Images.Primary.Large',
        'Images.Variants',
        'ItemInfo.Title',
        'ItemInfo.Features',
        'ItemInfo.Classifications',
        'ItemInfo.ByLineInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability',
        'Offers.Listings.Condition',
        'Offers.Listings.MerchantInfo',
      ],
      Condition: 'All',
      CurrencyOfPreference: 'USD',
      LanguagesOfPreference: ['en_US'],
      Merchant: 'All',
      OfferCount: 1,
    };

    try {
      const payload = JSON.stringify(getItemsRequest);
      const headers = this.createSignature('POST', this.getItemsEndpoint, payload, 'GetItems');

      const response = await fetch(this.getItemsEndpoint, {
        method: 'POST',
        headers,
        body: payload,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Amazon API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: AmazonGetItemsResponse = await response.json();

      // Check for API errors
      if (data.Errors && data.Errors.length > 0) {
        const error = data.Errors[0];
        if (error.Code === 'InvalidParameterValue' || error.Code === 'ItemNotEligible') {
          // Item not found or not eligible
          return null;
        }
        throw new Error(`Amazon API error: ${error.Code} - ${error.Message || 'Unknown error'}`);
      }

      // Extract item from response
      const items = data.ItemsResult?.Items;
      if (!items || items.length === 0) {
        return null;
      }

      const item = items[0];
      return this.transformItemToListing(item);
    } catch (error) {
      console.error('Amazon getItemById error:', error);
      throw new Error(`Failed to get Amazon item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform a single Amazon item to MarketplaceListing
   */
  private transformItemToListing(item: AmazonItem): MarketplaceListing {
    return {
      id: item.ASIN,
      marketplace: 'amazon',
      marketplaceId: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Title',
      description: item.ItemInfo?.Features?.DisplayValues?.join('\n') || undefined,
      price: this.extractPrice(item),
      currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'USD',
      images: this.extractImages(item),
      category: item.ItemInfo?.Classifications?.ProductGroup?.DisplayValue,
      condition: item.Offers?.Listings?.[0]?.Condition?.DisplayValue?.toLowerCase(),
      sellerName: item.Offers?.Listings?.[0]?.MerchantInfo?.Name,
      sellerRating: undefined, // Not available in PA-API 5.0
      listingUrl: item.DetailPageURL,
      available: item.Offers?.Listings?.[0]?.Availability?.Type === 'Now',
    };
  }

  /**
   * Transform Amazon API response to common MarketplaceListing format
   */
  private transformResponse(response: AmazonSearchResponse): MarketplaceSearchResult {
    const items = response.SearchResult?.Items || [];
    const listings: MarketplaceListing[] = items.map((item) => ({
      id: item.ASIN,
      marketplace: 'amazon',
      marketplaceId: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || 'Unknown Title',
      description: item.ItemInfo?.Features?.DisplayValues?.join(' ') || undefined,
      price: this.extractPrice(item),
      currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'USD',
      images: this.extractImages(item),
      category: item.ItemInfo?.Classifications?.ProductGroup?.DisplayValue,
      condition: item.Offers?.Listings?.[0]?.Condition?.DisplayValue?.toLowerCase(),
      sellerName: item.Offers?.Listings?.[0]?.MerchantInfo?.Name,
      sellerRating: undefined, // Not available in PA-API 5.0
      listingUrl: item.DetailPageURL,
      available: item.Offers?.Listings?.[0]?.Availability?.Type === 'Now',
    }));

    return {
      listings,
      total: response.SearchResult?.TotalResultCount || listings.length,
      hasMore: (response.SearchResult?.TotalResultCount || 0) > listings.length,
    };
  }

  private extractPrice(item: AmazonItem): number {
    const listing = item.Offers?.Listings?.[0];
    if (listing?.Price?.Amount) {
      return listing.Price.Amount;
    }
    if (listing?.Price?.DisplayAmount) {
      // Parse display amount like "$12.99"
      const priceRegex = /[\d.]+/;
      const match = priceRegex.exec(listing.Price.DisplayAmount);
      return match ? Number.parseFloat(match[0]) : 0;
    }
    return 0;
  }

  private extractImages(item: AmazonItem): string[] {
    const images: string[] = [];
    if (item.Images?.Primary?.Large?.URL) {
      images.push(item.Images.Primary.Large.URL);
    }
    if (item.Images?.Variants) {
      item.Images.Variants.forEach((variant: { Large?: { URL?: string } }) => {
        if (variant.Large?.URL) {
          images.push(variant.Large.URL);
        }
      });
    }
    return images;
  }

  private mapCategoryToSearchIndex(category?: string): string {
    // Map our categories to Amazon search indices
    const categoryMap: Record<string, string> = {
      antique: 'Collectibles',
      collectible: 'Collectibles',
      vintage: 'Collectibles',
    };
    return categoryMap[category || ''] || 'All';
  }

  private mapCondition(condition?: string): 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'All' {
    const conditionMap: Record<string, 'New' | 'Used' | 'Collectible' | 'Refurbished' | 'All'> = {
      new: 'New',
      used: 'Used',
      vintage: 'Collectible',
      collectible: 'Collectible',
      refurbished: 'Refurbished',
    };
    return conditionMap[condition || ''] || 'All';
  }

  private mapSortBy(sortBy?: 'price' | 'relevance' | 'newest'): 'Relevance' | 'Price:LowToHigh' | 'Price:HighToLow' | 'NewestArrivals' {
    const sortMap: Record<string, 'Relevance' | 'Price:LowToHigh' | 'Price:HighToLow' | 'NewestArrivals'> = {
      price: 'Price:LowToHigh',
      relevance: 'Relevance',
      newest: 'NewestArrivals',
    };
    return sortMap[sortBy || ''] || 'Relevance';
  }
}

/**
 * Create Amazon client instance
 */
export function createAmazonClient(): AmazonClient {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG;

  if (!accessKey || !secretKey || !associateTag) {
    throw new Error('Amazon API credentials are missing. Set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_ASSOCIATE_TAG environment variables.');
  }

  return new AmazonClient({
    accessKey,
    secretKey,
    associateTag,
    region: process.env.AMAZON_REGION || 'us-east-1',
  });
}

/**
 * RapidAPI Real-Time Amazon Data Client
 * 
 * Alternative Amazon client using the Real-Time Amazon Data API from RapidAPI
 * API: https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data
 * 
 * Advantages over PA-API:
 * - Simple API key authentication (no AWS Signature v4)
 * - No Amazon Associates account required
 * - Richer data (reviews, seller details, etc.)
 * 
 * Use when:
 * - You don't have Amazon PA-API access
 * - You need simpler setup for development/testing
 * - You need review or seller data
 */

import type {
  RapidAPIConfig,
  RapidAPIResponse,
  RapidAPIProductDetails,
  RapidAPISearchResponse,
} from './rapidapi-types';
import type { MarketplaceListing, MarketplaceSearchParams, MarketplaceSearchResult } from '../types';
import { waitForRateLimit } from '../rate-limiter';

const API_HOST = 'real-time-amazon-data.p.rapidapi.com';
const BASE_URL = `https://${API_HOST}`;

export class RapidAPIAmazonClient {
  private readonly config: RapidAPIConfig;

  constructor(config: RapidAPIConfig) {
    this.config = config;
  }

  /**
   * Get common headers for API requests
   */
  private getHeaders(): HeadersInit {
    return {
      'X-RapidAPI-Key': this.config.apiKey,
      'X-RapidAPI-Host': this.config.apiHost,
    };
  }

  /**
   * Get product details by ASIN
   */
  async getItemById(marketplaceId: string): Promise<MarketplaceListing | null> {
    await waitForRateLimit('amazon-rapidapi');

    // Validate ASIN format
    if (!/^[A-Z0-9]{10}$/i.test(marketplaceId)) {
      throw new Error(`Invalid ASIN format: ${marketplaceId}`);
    }

    const params = new URLSearchParams({
      asin: marketplaceId.toUpperCase(),
      country: 'US',
    });

    try {
      const response = await fetch(`${BASE_URL}/product-details?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RapidAPI error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: RapidAPIResponse<RapidAPIProductDetails> = await response.json();

      if (data.status !== 'OK' || !data.data) {
        return null;
      }

      return this.transformProductToListing(data.data);
    } catch (error) {
      console.error('RapidAPI Amazon getItemById error:', error);
      throw new Error(`Failed to get Amazon item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for products
   */
  async search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult> {
    await waitForRateLimit('amazon-rapidapi');

    const searchParams = new URLSearchParams({
      query: params.keywords?.join(' ') || '',
      page: String(params.offset ? Math.floor(params.offset / (params.limit || 10)) + 1 : 1),
      country: 'US',
    });

    if (params.minPrice) {
      searchParams.set('min_price', String(params.minPrice));
    }
    if (params.maxPrice) {
      searchParams.set('max_price', String(params.maxPrice));
    }
    if (params.sortBy) {
      searchParams.set('sort_by', this.mapSortBy(params.sortBy));
    }

    try {
      const response = await fetch(`${BASE_URL}/search?${searchParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RapidAPI error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: RapidAPIResponse<RapidAPISearchResponse> = await response.json();

      if (data.status !== 'OK' || !data.data) {
        return { listings: [], total: 0, hasMore: false };
      }

      return this.transformSearchResponse(data.data);
    } catch (error) {
      console.error('RapidAPI Amazon search error:', error);
      throw new Error(`Failed to search Amazon: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Transform RapidAPI product details to MarketplaceListing
   */
  private transformProductToListing(product: RapidAPIProductDetails): MarketplaceListing {
    // Try to get price from multiple possible fields
    const price = this.extractPrice(product);
    
    return {
      id: product.asin,
      marketplace: 'amazon',
      marketplaceId: product.asin,
      title: product.product_title,
      description: this.buildDescription(product),
      price,
      currency: 'USD',
      images: product.product_photos || [],
      category: product.product_category,
      condition: this.inferCondition(product),
      sellerName: product.seller_name,
      sellerRating: this.parseRating(product.product_star_rating),
      listingUrl: product.product_url,
      available: this.isAvailable(product.product_availability),
    };
  }

  /**
   * Build description from available product info
   */
  private buildDescription(product: RapidAPIProductDetails): string {
    const parts: string[] = [];

    if (product.product_description) {
      parts.push(product.product_description);
    }

    // Add product details as bullet points
    if (product.product_details) {
      const details = Object.entries(product.product_details)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join('\n');
      if (details) {
        parts.push(details);
      }
    }

    // Add product information
    if (product.product_information) {
      const info = Object.entries(product.product_information)
        .filter(([key]) => !['ASIN', 'Customer Reviews', 'Best Sellers Rank'].includes(key))
        .map(([key, value]) => `• ${key}: ${value}`)
        .join('\n');
      if (info) {
        parts.push(info);
      }
    }

    // Add brand if available
    if (product.brand) {
      parts.unshift(`Brand: ${product.brand}`);
    }

    return parts.join('\n\n');
  }

  /**
   * Extract price from product, trying multiple fields
   */
  private extractPrice(product: RapidAPIProductDetails): number {
    // Try product_price first (current/sale price)
    if (product.product_price) {
      const price = this.parsePrice(product.product_price);
      if (price > 0) return price;
    }
    
    // Fall back to original_price if current price is missing
    if (product.product_original_price) {
      const price = this.parsePrice(product.product_original_price);
      if (price > 0) return price;
    }
    
    // If no price found, return 0 (will be caught by validation)
    return 0;
  }

  /**
   * Parse price string to number
   * Handles various formats: "$12.99", "12.99", "$1,234.56", etc.
   */
  private parsePrice(priceStr?: string): number {
    if (!priceStr) return 0;
    
    // Remove currency symbols, commas, and whitespace, then parse
    const cleaned = priceStr.replace(/[$,\s]/g, '');
    const price = parseFloat(cleaned);
    return isNaN(price) ? 0 : price;
  }

  /**
   * Parse star rating string to number
   */
  private parseRating(ratingStr?: string): number | undefined {
    if (!ratingStr) return undefined;
    
    // Extract number from "4.5 out of 5 stars" or "4.5"
    const match = ratingStr.match(/(\d+\.?\d*)/);
    if (match) {
      const rating = parseFloat(match[1]);
      return isNaN(rating) ? undefined : rating;
    }
    return undefined;
  }

  /**
   * Infer condition from product data
   * Note: Most Amazon listings are "new" unless specified
   */
  private inferCondition(product: RapidAPIProductDetails): string {
    const title = product.product_title.toLowerCase();
    const description = (product.product_description || '').toLowerCase();

    if (title.includes('refurbished') || description.includes('refurbished')) {
      return 'refurbished';
    }
    if (title.includes('renewed') || description.includes('renewed')) {
      return 'refurbished';
    }
    if (title.includes('used') || description.includes('used')) {
      return 'used';
    }
    if (title.includes('vintage') || description.includes('vintage')) {
      return 'vintage';
    }
    if (title.includes('collectible') || description.includes('collectible')) {
      return 'collectible';
    }

    return 'new';
  }

  /**
   * Check if product is available
   */
  private isAvailable(availability?: string): boolean {
    if (!availability) return true;
    
    const lower = availability.toLowerCase();
    return !lower.includes('out of stock') && 
           !lower.includes('unavailable') &&
           !lower.includes('currently unavailable');
  }

  /**
   * Transform search response to MarketplaceSearchResult
   */
  private transformSearchResponse(response: RapidAPISearchResponse): MarketplaceSearchResult {
    const listings: MarketplaceListing[] = response.products.map((product) => ({
      id: product.asin,
      marketplace: 'amazon',
      marketplaceId: product.asin,
      title: product.product_title,
      description: undefined, // Search results don't include full description
      price: this.parsePrice(product.product_price),
      currency: 'USD',
      images: product.product_photo ? [product.product_photo] : [],
      category: undefined,
      condition: 'new', // Default for search results
      sellerName: undefined,
      sellerRating: this.parseRating(product.product_star_rating),
      listingUrl: product.product_url,
      available: true,
    }));

    return {
      listings,
      total: response.total_products,
      hasMore: listings.length < response.total_products,
    };
  }

  /**
   * Map sort parameter to RapidAPI format
   */
  private mapSortBy(sortBy?: 'price' | 'relevance' | 'newest'): string {
    const sortMap: Record<string, string> = {
      price: 'LOWEST_PRICE',
      relevance: 'RELEVANCE',
      newest: 'NEWEST',
    };
    return sortMap[sortBy || ''] || 'RELEVANCE';
  }
}

/**
 * Create RapidAPI Amazon client instance
 */
export function createRapidAPIAmazonClient(): RapidAPIAmazonClient {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY environment variable is not set. Get your API key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data');
  }

  return new RapidAPIAmazonClient({
    apiKey,
    apiHost: API_HOST,
  });
}

/**
 * Check if RapidAPI credentials are configured
 */
export function isRapidAPIConfigured(): boolean {
  return !!process.env.RAPIDAPI_KEY;
}


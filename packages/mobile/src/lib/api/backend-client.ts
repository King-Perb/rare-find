/**
 * Backend API Client
 *
 * Client for calling the web package's Next.js API routes from the mobile app
 * This is the secure way to use shared services - API keys stay on the server
 *
 * Usage:
 *   const client = new BackendClient('https://your-api.com');
 *   const result = await client.evaluateListing('https://amazon.com/dp/...');
 */

import type { EvaluationResult, MarketplaceListing } from '@rare-find/shared';

/**
 * Configuration for backend API client
 */
export interface BackendClientConfig {
  /** Base URL of your deployed Next.js API (e.g., 'https://api.rarefind.com') */
  baseUrl: string;
  /** Optional authentication token for protected endpoints */
  authToken?: string;
}

/**
 * Request to evaluate a listing
 */
export interface EvaluateListingRequest {
  /** Listing URL to fetch and evaluate */
  listingUrl?: string;
  /** Or provide listing data directly */
  listing?: MarketplaceListing;
  /** Evaluation mode - defaults to 'multimodal' */
  mode?: 'multimodal' | 'text-only';
}

/**
 * Response from evaluate endpoint
 */
export interface EvaluateListingResponse {
  success: boolean;
  result: EvaluationResult;
  listing: MarketplaceListing;
}

/**
 * Backend API client for mobile app
 *
 * Calls your Next.js API routes which proxy requests to external APIs
 * API keys are stored securely on the server, never exposed to the mobile app
 */
export class BackendClient {
  private readonly baseUrl: string;
  private readonly authToken?: string;

  constructor(config: BackendClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.authToken = config.authToken;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Evaluate a marketplace listing
   *
   * This calls your Next.js API which:
   * 1. Fetches the listing from marketplace (Amazon/eBay)
   * 2. Evaluates it using OpenAI
   * 3. Returns the evaluation result
   *
   * All API keys (OpenAI, Amazon, eBay) stay on the server
   */
  async evaluateListing(request: EvaluateListingRequest): Promise<EvaluateListingResponse> {
    const response = await fetch(`${this.baseUrl}/api/marketplace/evaluate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`API request failed: ${response.status} ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data as EvaluateListingResponse;
  }

  /**
   * Search marketplace listings
   *
   * Note: This endpoint may not exist yet - you may need to create it
   * or use evaluateListing with listingUrl instead
   */
  async searchListings(params: {
    marketplace: 'amazon' | 'ebay';
    keywords?: string[];
    category?: string;
    sortBy?: 'price' | 'relevance' | 'newest';
    limit?: number;
    offset?: number;
  }): Promise<{ listings: MarketplaceListing[]; total: number; hasMore: boolean }> {
    // TODO: Create /api/marketplace/search endpoint in web package if needed
    const response = await fetch(`${this.baseUrl}/api/marketplace/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`API request failed: ${response.status} ${error.message || response.statusText}`);
    }

    return await response.json();
  }
}

/**
 * Create a backend client instance
 *
 * @param baseUrl - Your deployed Next.js API URL (e.g., 'https://api.rarefind.com')
 * @param authToken - Optional authentication token
 */
export function createBackendClient(
  baseUrl: string,
  authToken?: string
): BackendClient {
  return new BackendClient({ baseUrl, authToken });
}

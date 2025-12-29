/**
 * Rate limiter for marketplace APIs
 *
 * Implements token bucket algorithm to respect API rate limits:
 * - Amazon PA-API: 1 request per second (86400/day)
 * - Amazon RapidAPI: 5 requests per second (depends on plan)
 * - eBay: ~0.058 requests per second (5000/day)
 */

import type { Marketplace } from './types';

/**
 * Rate limit source - extends Marketplace with API-specific sources
 */
export type RateLimitSource = Marketplace | 'amazon-rapidapi';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per second
}

class MarketplaceRateLimiter {
  private buckets: Map<RateLimitSource, TokenBucket> = new Map();

  constructor() {
    // Initialize token buckets for each marketplace/API source
    this.buckets.set('amazon', {
      tokens: 1, // Start with 1 token (can make immediate request)
      lastRefill: Date.now(),
      capacity: 1,
      refillRate: 1, // 1 token per second (PA-API limit)
    });

    // RapidAPI has more generous limits (depends on subscription tier)
    // Free tier: ~500 requests/month, Pro: 10,000+/month
    // Setting to 5 req/sec as a reasonable default
    this.buckets.set('amazon-rapidapi', {
      tokens: 5,
      lastRefill: Date.now(),
      capacity: 5,
      refillRate: 5, // 5 tokens per second
    });

    this.buckets.set('ebay', {
      tokens: 0.058, // Start with small amount
      lastRefill: Date.now(),
      capacity: 0.058,
      refillRate: 0.058, // ~0.058 tokens per second (5000/day)
    });
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(source: RateLimitSource): void {
    const bucket = this.buckets.get(source);
    if (!bucket) return;

    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000; // Convert to seconds
    const tokensToAdd = elapsed * bucket.refillRate;

    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  /**
   * Check if a request can be made immediately
   */
  canMakeRequest(source: RateLimitSource): boolean {
    this.refillTokens(source);
    const bucket = this.buckets.get(source);
    return bucket ? bucket.tokens >= 1 : false;
  }

  /**
   * Consume a token (make a request)
   */
  consumeToken(source: RateLimitSource): void {
    this.refillTokens(source);
    const bucket = this.buckets.get(source);
    if (bucket && bucket.tokens >= 1) {
      bucket.tokens -= 1;
    }
  }

  /**
   * Get the time to wait before next request can be made (in milliseconds)
   */
  getWaitTime(source: RateLimitSource): number {
    this.refillTokens(source);
    const bucket = this.buckets.get(source);
    if (!bucket) return 0;

    if (bucket.tokens >= 1) {
      return 0; // Can make request immediately
    }

    // Calculate time needed to get 1 token
    const tokensNeeded = 1 - bucket.tokens;
    const secondsToWait = tokensNeeded / bucket.refillRate;
    return Math.ceil(secondsToWait * 1000); // Convert to milliseconds
  }

  /**
   * Wait until a token is available, then consume it
   */
  async waitAndConsume(source: RateLimitSource): Promise<void> {
    const waitTime = this.getWaitTime(source);
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.consumeToken(source);
  }
}

// Singleton instance
let rateLimiterInstance: MarketplaceRateLimiter | null = null;

/**
 * Get the rate limiter instance
 */
export function getRateLimiter(): MarketplaceRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new MarketplaceRateLimiter();
  }
  return rateLimiterInstance;
}

/**
 * Wait for rate limit and make request
 * Use this before making marketplace API calls
 */
export async function waitForRateLimit(source: RateLimitSource): Promise<void> {
  const limiter = getRateLimiter();
  await limiter.waitAndConsume(source);
}

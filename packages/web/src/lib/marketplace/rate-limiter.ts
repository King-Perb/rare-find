/**
 * Rate limiter for marketplace APIs
 * 
 * Implements token bucket algorithm to respect API rate limits:
 * - Amazon: 1 request per second (86400/day)
 * - eBay: ~0.058 requests per second (5000/day)
 */

import type { Marketplace } from './types';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number; // tokens per second
}

class MarketplaceRateLimiter {
  private buckets: Map<Marketplace, TokenBucket> = new Map();

  constructor() {
    // Initialize token buckets for each marketplace
    this.buckets.set('amazon', {
      tokens: 1, // Start with 1 token (can make immediate request)
      lastRefill: Date.now(),
      capacity: 1,
      refillRate: 1, // 1 token per second
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
  private refillTokens(marketplace: Marketplace): void {
    const bucket = this.buckets.get(marketplace);
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
  canMakeRequest(marketplace: Marketplace): boolean {
    this.refillTokens(marketplace);
    const bucket = this.buckets.get(marketplace);
    return bucket ? bucket.tokens >= 1 : false;
  }

  /**
   * Consume a token (make a request)
   */
  consumeToken(marketplace: Marketplace): void {
    this.refillTokens(marketplace);
    const bucket = this.buckets.get(marketplace);
    if (bucket && bucket.tokens >= 1) {
      bucket.tokens -= 1;
    }
  }

  /**
   * Get the time to wait before next request can be made (in milliseconds)
   */
  getWaitTime(marketplace: Marketplace): number {
    this.refillTokens(marketplace);
    const bucket = this.buckets.get(marketplace);
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
  async waitAndConsume(marketplace: Marketplace): Promise<void> {
    const waitTime = this.getWaitTime(marketplace);
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.consumeToken(marketplace);
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
export async function waitForRateLimit(marketplace: Marketplace): Promise<void> {
  const limiter = getRateLimiter();
  await limiter.waitAndConsume(marketplace);
}


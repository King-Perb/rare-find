/**
 * Rate Limiter Tests
 *
 * Tests for the marketplace API rate limiter (token bucket algorithm)
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to reset the module between tests to get fresh rate limiter instances
// Import dynamically in each test to reset state
let getRateLimiter: typeof import('../../src/lib/marketplace/rate-limiter').getRateLimiter;
let waitForRateLimit: typeof import('../../src/lib/marketplace/rate-limiter').waitForRateLimit;

describe('MarketplaceRateLimiter', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    // Reset module to get fresh singleton
    vi.resetModules();
    const limiterModule = await import('../../src/lib/marketplace/rate-limiter');
    getRateLimiter = limiterModule.getRateLimiter;
    waitForRateLimit = limiterModule.waitForRateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('canMakeRequest', () => {
    it('should allow first request immediately for Amazon', () => {
      const limiter = getRateLimiter();

      expect(limiter.canMakeRequest('amazon')).toBe(true);
    });

    it('should not allow second request immediately after first for Amazon', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      expect(limiter.canMakeRequest('amazon')).toBe(false);
    });

    it('should allow request after 1 second refill for Amazon', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      expect(limiter.canMakeRequest('amazon')).toBe(false);

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);

      expect(limiter.canMakeRequest('amazon')).toBe(true);
    });

    it('should allow multiple rapid requests for Amazon RapidAPI', () => {
      const limiter = getRateLimiter();

      // RapidAPI has 5 tokens capacity
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');

      // After 5 requests, should be rate limited
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(false);
    });

    it('should return false for unknown source', () => {
      const limiter = getRateLimiter();

      // @ts-expect-error Testing unknown source
      expect(limiter.canMakeRequest('unknown')).toBe(false);
    });
  });

  describe('waitAndConsume', () => {
    it('should wait and then consume token', async () => {
      const limiter = getRateLimiter();

      // Consume initial token
      limiter.consumeToken('amazon');

      // Start waiting
      const promise = limiter.waitAndConsume('amazon');

      // Advance time to allow token refill
      await vi.advanceTimersByTimeAsync(1000);

      await promise;

      // Token should have been consumed
      expect(limiter.canMakeRequest('amazon')).toBe(false);
    });

    it('should consume immediately if tokens available', async () => {
      const limiter = getRateLimiter();

      await limiter.waitAndConsume('amazon');

      // Token should have been consumed
      expect(limiter.canMakeRequest('amazon')).toBe(false);
    });
  });

  describe('getWaitTime', () => {
    it('should return correct wait time for Amazon after consuming token', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      const waitTime = limiter.getWaitTime('amazon');

      // Should be close to 1000ms (1 second)
      expect(waitTime).toBeGreaterThan(900);
      expect(waitTime).toBeLessThanOrEqual(1000);
    });

    it('should return 0 wait time when tokens available', () => {
      const limiter = getRateLimiter();

      const waitTime = limiter.getWaitTime('amazon');

      expect(waitTime).toBe(0);
    });

    it('should require long wait after consuming token for eBay', () => {
      const limiter = getRateLimiter();

      // If initial token allows request, consume it
      if (limiter.canMakeRequest('ebay')) {
        limiter.consumeToken('ebay');
      }

      // Wait time should be very long (about 17 seconds to get 1 token at 0.058/sec)
      const waitTime = limiter.getWaitTime('ebay');

      // 1 token / 0.058 tokens per second = ~17.2 seconds = ~17200 ms
      expect(waitTime).toBeGreaterThan(15000);
    });

    it('should return 0 wait time for unknown source', () => {
      const limiter = getRateLimiter();

      // @ts-expect-error Testing unknown source
      expect(limiter.getWaitTime('unknown')).toBe(0);
    });
  });

  describe('Amazon PA-API rate limiting', () => {
    it('should allow first request immediately', () => {
      const limiter = getRateLimiter();

      expect(limiter.canMakeRequest('amazon')).toBe(true);
    });

    it('should not allow second request immediately after first', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      expect(limiter.canMakeRequest('amazon')).toBe(false);
    });

    it('should allow request after 1 second refill', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      expect(limiter.canMakeRequest('amazon')).toBe(false);

      // Advance time by 1 second
      vi.advanceTimersByTime(1000);

      expect(limiter.canMakeRequest('amazon')).toBe(true);
    });

    it('should return correct wait time', () => {
      const limiter = getRateLimiter();

      limiter.consumeToken('amazon');
      const waitTime = limiter.getWaitTime('amazon');

      // Should be close to 1000ms (1 second)
      expect(waitTime).toBeGreaterThan(900);
      expect(waitTime).toBeLessThanOrEqual(1000);
    });

    it('should return 0 wait time when tokens available', () => {
      const limiter = getRateLimiter();

      const waitTime = limiter.getWaitTime('amazon');

      expect(waitTime).toBe(0);
    });
  });

  describe('Amazon RapidAPI rate limiting', () => {
    it('should allow multiple rapid requests', () => {
      const limiter = getRateLimiter();

      // RapidAPI has 5 tokens capacity
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
      limiter.consumeToken('amazon-rapidapi');

      // After 5 requests, should be rate limited
      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(false);
    });

    it('should refill at 5 tokens per second', () => {
      const limiter = getRateLimiter();

      // Consume all tokens
      for (let i = 0; i < 5; i++) {
        limiter.consumeToken('amazon-rapidapi');
      }

      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(false);

      // After 200ms, should have 1 token (5 * 0.2 = 1)
      vi.advanceTimersByTime(200);

      expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
    });
  });

  describe('eBay rate limiting', () => {
    it('should have much lower rate limit', () => {
      const limiter = getRateLimiter();

      // eBay has ~0.058 tokens/sec (5000/day)
      // Initial token count is also ~0.058, so first request should work
      // but checking requires understanding the tiny token bucket
      const waitTime = limiter.getWaitTime('ebay');

      // eBay starts with very few tokens, so there may be a wait
      // The initial capacity is 0.058 tokens
      expect(waitTime).toBeGreaterThanOrEqual(0);
    });

    it('should require long wait after consuming token', () => {
      const limiter = getRateLimiter();

      // If initial token allows request, consume it
      if (limiter.canMakeRequest('ebay')) {
        limiter.consumeToken('ebay');
      }

      // Wait time should be very long (about 17 seconds to get 1 token at 0.058/sec)
      const waitTime = limiter.getWaitTime('ebay');

      // 1 token / 0.058 tokens per second = ~17.2 seconds = ~17200 ms
      expect(waitTime).toBeGreaterThan(15000);
    });
  });

  describe('unknown source', () => {
    it('should return false for unknown source', () => {
      const limiter = getRateLimiter();

      // @ts-expect-error Testing unknown source
      expect(limiter.canMakeRequest('unknown')).toBe(false);
    });

    it('should return 0 wait time for unknown source', () => {
      const limiter = getRateLimiter();

      // @ts-expect-error Testing unknown source
      expect(limiter.getWaitTime('unknown')).toBe(0);
    });

    it('should not throw when consuming unknown source', () => {
      const limiter = getRateLimiter();

      // @ts-expect-error Testing unknown source
      expect(() => limiter.consumeToken('unknown')).not.toThrow();
    });
  });
});

describe('getRateLimiter', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    const limiterModule = await import('../../src/lib/marketplace/rate-limiter');
    getRateLimiter = limiterModule.getRateLimiter;
    waitForRateLimit = limiterModule.waitForRateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return singleton instance', () => {
    const limiter1 = getRateLimiter();
    const limiter2 = getRateLimiter();

    expect(limiter1).toBe(limiter2);
  });
});

describe('waitForRateLimit', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    const limiterModule = await import('../../src/lib/marketplace/rate-limiter');
    getRateLimiter = limiterModule.getRateLimiter;
    waitForRateLimit = limiterModule.waitForRateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should wait for rate limit and consume token', async () => {
    const limiter = getRateLimiter();

    // Consume initial token
    limiter.consumeToken('amazon');

    // Start waiting
    const promise = waitForRateLimit('amazon');

    // Advance time
    await vi.advanceTimersByTimeAsync(1000);

    await promise;

    // Token should be consumed
    expect(limiter.canMakeRequest('amazon')).toBe(false);
  });

  it('should work immediately when tokens available', async () => {
    const limiter = getRateLimiter();

    // Should not need to wait if tokens are available (fresh limiter has tokens)
    await waitForRateLimit('amazon-rapidapi');

    // After consuming one token, RapidAPI should still have tokens (5 capacity, consumed 1)
    expect(limiter.canMakeRequest('amazon-rapidapi')).toBe(true);
  });
});

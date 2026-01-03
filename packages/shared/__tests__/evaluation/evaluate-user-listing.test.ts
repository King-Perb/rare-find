import { describe, it, expect, vi, beforeEach } from 'vitest';
import type OpenAI from 'openai';
import { evaluateUserListing } from '../../src/lib/evaluation/evaluate-user-listing';
import type { ILogger } from '../../src/lib/interfaces';
import type { EvaluationInput } from '../../src/lib/evaluation/types';
import type { MarketplaceListing } from '../../src/lib/marketplace/types';
import { AppError } from '../../src/lib/errors';

describe('evaluateUserListing', () => {
  let mockLogger: ILogger;
  let mockOpenAIClient: OpenAI;

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
    mockOpenAIClient = {
      responses: {
        create: vi.fn(),
      },
    } as unknown as OpenAI;
    vi.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof evaluateUserListing).toBe('function');
  });

  it('should throw AppError for invalid evaluation mode', async () => {
    const listing: MarketplaceListing = {
      id: 'listing-1',
      marketplace: 'amazon',
      marketplaceId: 'B08XYZ1234',
      title: 'Test Product',
      price: 99.99,
      currency: 'USD',
      images: [],
      listingUrl: 'https://www.amazon.com/dp/B08XYZ1234',
      available: true,
    };
    const input = {
      listing,
      mode: 'invalid-mode',
    } as unknown as EvaluationInput;

    await expect(
      evaluateUserListing(input, mockOpenAIClient, mockLogger)
    ).rejects.toThrow(AppError);
    await expect(
      evaluateUserListing(input, mockOpenAIClient, mockLogger)
    ).rejects.toThrow('Invalid evaluation mode: invalid-mode');
  });
});

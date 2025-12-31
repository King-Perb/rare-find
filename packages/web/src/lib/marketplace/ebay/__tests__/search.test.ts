/**
 * Tests for eBay Search
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchEBay } from '../search';
import type { MarketplaceSearchParams, MarketplaceSearchResult } from '../../types';
import type { SearchPreference } from '../../../db/types';

// Mock the eBay client
vi.mock('../client', () => ({
  createEbayClient: vi.fn(() => ({
    search: vi.fn(),
  })),
}));

import { createEbayClient } from '../client';

describe('searchEBay', () => {
  const mockClient = {
    search: vi.fn<() => Promise<MarketplaceSearchResult>>(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createEbayClient).mockReturnValue(mockClient as never);
  });

  it('should call client.search with params when no preferences', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage', 'watch'],
      category: 'Watches',
      minPrice: 100,
      maxPrice: 500,
    };

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    const result = await searchEBay(params);

    expect(createEbayClient).toHaveBeenCalled();
    expect(mockClient.search).toHaveBeenCalledWith(params);
    expect(result).toEqual(expectedResult);
  });

  it('should return params unchanged when preferences are empty', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage'],
    };

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, []);

    expect(mockClient.search).toHaveBeenCalledWith(params);
  });

  it('should return params unchanged when preferences are undefined', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage'],
    };

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, undefined);

    expect(mockClient.search).toHaveBeenCalledWith(params);
  });

  it('should apply preference filters when preferences are provided', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage'],
    };

    const preferences: SearchPreference[] = [
      {
        id: '1',
        userId: 'user1',
        keywords: ['antique', 'collectible'],
        categories: ['Antiques'],
        minPrice: 50,
        maxPrice: 1000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, preferences);

    expect(mockClient.search).toHaveBeenCalledWith({
      keywords: ['vintage'], // params.keywords takes precedence
      category: 'Antiques', // from preference
      minPrice: 50, // from preference
      maxPrice: 1000, // from preference
    });
  });

  it('should ignore inactive preferences', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage'],
    };

    const preferences: SearchPreference[] = [
      {
        id: '1',
        userId: 'user1',
        keywords: ['antique'],
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, preferences);

    expect(mockClient.search).toHaveBeenCalledWith(params);
  });

  it('should use first active preference when multiple preferences exist', async () => {
    const params: MarketplaceSearchParams = {};

    const preferences: SearchPreference[] = [
      {
        id: '1',
        userId: 'user1',
        keywords: ['first'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user1',
        keywords: ['second'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, preferences);

    expect(mockClient.search).toHaveBeenCalledWith({
      keywords: ['first'], // from first active preference
    });
  });

  it('should merge params with preference filters correctly', async () => {
    const params: MarketplaceSearchParams = {
      keywords: ['vintage'],
      category: 'Watches',
      minPrice: 200,
    };

    const preferences: SearchPreference[] = [
      {
        id: '1',
        userId: 'user1',
        keywords: ['antique'],
        categories: ['Antiques'],
        minPrice: 50,
        maxPrice: 1000,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const expectedResult: MarketplaceSearchResult = {
      listings: [],
      total: 0,
      hasMore: false,
    };

    mockClient.search.mockResolvedValueOnce(expectedResult);

    await searchEBay(params, preferences);

    // Params take precedence over preferences
    expect(mockClient.search).toHaveBeenCalledWith({
      keywords: ['vintage'], // from params
      category: 'Watches', // from params
      minPrice: 200, // from params
      maxPrice: 1000, // from preference (params doesn't have it)
    });
  });
});

/**
 * Test Utilities for Marketplace Clients
 *
 * Shared test utilities for marketplace client tests
 */

import { vi } from 'vitest';

/**
 * Create a mock eBay API response for search/getItemById
 */
export function createMockEbayApiResponse(item: {
  itemId: string;
  title: string;
  price: number;
  currency?: string;
  viewItemURL?: string;
  condition?: string;
  sellerName?: string;
  sellerRating?: string;
  galleryURL?: string;
  categoryName?: string;
  listingStatus?: string;
}): unknown {
  return {
    findItemsAdvancedResponse: [
      {
        searchResult: {
          '@count': '1',
          item: [
            {
              itemId: [item.itemId],
              title: [item.title],
              viewItemURL: [item.viewItemURL || `https://ebay.com/itm/${item.itemId}`],
              sellingStatus: [
                {
                  currentPrice: [
                    {
                      '@currencyId': item.currency || 'USD',
                      __value__: String(item.price),
                    },
                  ],
                  listingStatus: [item.listingStatus || 'Active'],
                },
              ],
              condition: item.condition
                ? [
                    {
                      conditionDisplayName: [item.condition],
                    },
                  ]
                : [],
              sellerInfo: item.sellerName
                ? [
                    {
                      sellerUserName: [item.sellerName],
                      positiveFeedbackPercent: [item.sellerRating || '98.5'],
                    },
                  ]
                : [],
              galleryURL: item.galleryURL ? [item.galleryURL] : [],
              categoryName: item.categoryName ? [item.categoryName] : [],
            },
          ],
        },
        paginationOutput: {
          totalPages: ['1'],
          totalEntries: ['1'],
          pageNumber: ['1'],
        },
      },
    ],
  };
}

/**
 * Create a mock eBay API response for empty search results
 */
export function createMockEbayEmptyResponse(): unknown {
  return {
    findItemsAdvancedResponse: [
      {
        searchResult: {
          '@count': '0',
          item: [],
        },
        paginationOutput: {
          totalPages: ['0'],
          totalEntries: ['0'],
          pageNumber: ['1'],
        },
      },
    ],
  };
}

/**
 * Create a mock HTTP response for eBay API calls
 */
export function createMockEbayHttpResponse(
  data: unknown,
  ok: boolean = true,
  status: number = ok ? 200 : 400
): Response {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'Bad Request',
    json: vi.fn().mockResolvedValue(data),
    text: vi.fn().mockResolvedValue(typeof data === 'string' ? data : JSON.stringify(data)),
  } as unknown as Response;
}

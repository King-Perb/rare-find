/**
 * Amazon marketplace search functionality
 *
 * Wraps Amazon client with preference filtering
 */

import { createAmazonClient } from '../clients';
import type { MarketplaceSearchParams, MarketplaceSearchResult } from '../types';
import type { SearchPreference } from '../../db/types';

/**
 * Search Amazon with preference filtering
 */
export async function searchAmazon(
  params: MarketplaceSearchParams,
  preferences?: SearchPreference[]
): Promise<MarketplaceSearchResult> {
  const client = createAmazonClient();

  // Apply preference filters if provided
  const filteredParams = applyPreferenceFilters(params, preferences);

  return client.search(filteredParams);
}

/**
 * Apply search preference filters to search parameters
 */
function applyPreferenceFilters(
  params: MarketplaceSearchParams,
  preferences?: SearchPreference[]
): MarketplaceSearchParams {
  if (!preferences || preferences.length === 0) {
    return params;
  }

  // Find active preferences that match the search
  const activePreferences = preferences.filter((p) => p.isActive);

  if (activePreferences.length === 0) {
    return params;
  }

  // Merge preferences (use first active preference for now)
  // In a more sophisticated implementation, we could merge multiple preferences
  const preference = activePreferences[0];

  return {
    ...params,
    keywords: params.keywords || preference.keywords || undefined,
    category: params.category || preference.categories?.[0] || undefined,
    minPrice: params.minPrice ?? preference.minPrice ?? undefined,
    maxPrice: params.maxPrice ?? preference.maxPrice ?? undefined,
  };
}

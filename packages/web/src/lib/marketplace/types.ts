/**
 * Common marketplace types
 * 
 * Shared types and interfaces for marketplace integrations (Amazon, eBay)
 */

export type Marketplace = 'amazon' | 'ebay';

export interface MarketplaceListing {
  id: string;
  marketplace: Marketplace;
  marketplaceId: string;
  title: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  category?: string;
  condition?: string;
  sellerName?: string;
  sellerRating?: number;
  listingUrl: string;
  available: boolean;
}

export interface MarketplaceSearchParams {
  keywords?: string[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sortBy?: 'price' | 'relevance' | 'newest';
  limit?: number;
  offset?: number;
}

export interface MarketplaceSearchResult {
  listings: MarketplaceListing[];
  total: number;
  hasMore: boolean;
}

export interface MarketplaceClient {
  search(params: MarketplaceSearchParams): Promise<MarketplaceSearchResult>;
  getItemById(marketplaceId: string): Promise<MarketplaceListing | null>;
}


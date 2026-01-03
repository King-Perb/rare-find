/**
 * Marketplace Service Usage Example
 *
 * Example demonstrating how to use MarketplaceService in the mobile app
 * with platform-specific providers (ExpoCryptoProvider, MobileHttpClient)
 *
 * ⚠️ SECURITY WARNING: This example uses EXPO_PUBLIC_ environment variables
 * which expose API keys in the app bundle. This is ONLY safe for development/testing.
 * For production, use a backend API proxy instead (see doc/ENV_SETUP.md and doc/SECURITY_WARNING.md)
 */

import { MarketplaceService } from '@rare-find/shared/lib/marketplace/services/marketplace.service';
import { AmazonClient, eBayClient } from '@rare-find/shared/lib/marketplace/clients';
import type { AmazonCredentials } from '@rare-find/shared/lib/marketplace/clients/amazon/types';
import type { eBayCredentials } from '@rare-find/shared/lib/marketplace/clients/ebay/types';
import { createExpoCryptoProvider } from '../crypto/expo-crypto-provider';
import { createMobileHttpClient } from '../http/mobile-http-client';
import { createMobileLogger } from '../logger/mobile-logger';

/**
 * Example: Initialize MarketplaceService with mobile providers
 */
export function createMarketplaceService(): MarketplaceService {
  // Create platform-specific providers
  const logger = createMobileLogger();
  const cryptoProvider = createExpoCryptoProvider();
  const httpClient = createMobileHttpClient();

  // Get credentials from environment variables
  // ⚠️ SECURITY WARNING: Using EXPO_PUBLIC_ for secret keys exposes them in the app bundle!
  // - Amazon Secret Key: NEVER use EXPO_PUBLIC_ in production (use backend API proxy)
  // - Amazon Access Key: Should use backend API proxy in production
  // - Associate Tag: Safe to use EXPO_PUBLIC_ (public identifier)
  // For production, use a backend API proxy instead (see doc/ENV_SETUP.md)
  // This is only safe for development/testing
  const amazonCredentials: AmazonCredentials = {
    accessKey: process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY || '',
    secretKey: process.env.EXPO_PUBLIC_AMAZON_SECRET_KEY || '', // ⚠️ SECURITY RISK in production!
    associateTag: process.env.EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG || '',
    region: process.env.EXPO_PUBLIC_AMAZON_REGION || 'us-east-1',
  };

  const ebayCredentials: eBayCredentials = {
    appId: process.env.EXPO_PUBLIC_EBAY_APP_ID || '',
    authToken: process.env.EXPO_PUBLIC_EBAY_AUTH_TOKEN || '',
    siteId: process.env.EXPO_PUBLIC_EBAY_SITE_ID || 'EBAY-US',
  };

  // Create marketplace clients with mobile providers
  const amazonClient = new AmazonClient(amazonCredentials, cryptoProvider, httpClient);
  const ebayClient = new eBayClient(ebayCredentials, httpClient);

  // Create and return MarketplaceService
  return new MarketplaceService(logger, amazonClient, ebayClient);
}

/**
 * Example: Parse marketplace URL
 */
export async function exampleParseUrl(): Promise<void> {
  const service = createMarketplaceService();

  try {
    const result = service.parseMarketplaceUrl('https://www.amazon.com/dp/B08XYZ1234');
    console.log('Parsed marketplace:', result.marketplace);
    console.log('Marketplace ID:', result.marketplaceId);
  } catch (error) {
    console.error('Failed to parse URL:', error);
  }
}

/**
 * Example: Fetch listing from URL
 */
export async function exampleFetchListing(): Promise<void> {
  const service = createMarketplaceService();

  try {
    const listing = await service.fetchListingFromUrl(
      'https://www.amazon.com/dp/B08XYZ1234'
    );
    console.log('Fetched listing:', listing.title);
    console.log('Price:', listing.price);
  } catch (error) {
    console.error('Failed to fetch listing:', error);
  }
}

/**
 * Example: Search listings
 */
export async function exampleSearchListings(): Promise<void> {
  const service = createMarketplaceService();

  try {
    const results = await service.search({
      marketplace: 'amazon',
      keywords: ['laptop'],
      category: 'Electronics',
      sortBy: 'price',
      limit: 10,
      offset: 0,
    });

    console.log(`Found ${results.listings.length} listings`);
    results.listings.forEach((listing) => {
      console.log(`- ${listing.title}: $${listing.price}`);
    });
  } catch (error) {
    console.error('Failed to search listings:', error);
  }
}

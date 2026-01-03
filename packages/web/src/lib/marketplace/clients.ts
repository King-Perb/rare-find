/**
 * Marketplace Client Factories
 *
 * Factory functions to create marketplace clients with platform-specific providers
 * These wrap the shared package clients with Node.js/web-specific implementations
 */

import type { MarketplaceClient, AmazonCredentials, eBayCredentials, RapidAPIConfig } from '@rare-find/shared';
import { AmazonClient } from '@rare-find/shared/lib/marketplace/clients/amazon/client';
import { RapidAPIAmazonClient } from '@rare-find/shared/lib/marketplace/clients/amazon/rapidapi-client';
import { eBayClient } from '@rare-find/shared/lib/marketplace/clients/ebay/client';
import { createNodeCryptoProvider } from '../crypto/node-crypto-provider';
import { createWebHttpClient } from '../http/web-http-client';

/**
 * Amazon API source type
 */
export type AmazonAPISource = 'pa-api' | 'rapidapi';

/**
 * Get the configured Amazon API source
 */
function getAmazonAPISource(): AmazonAPISource {
  const source = process.env.AMAZON_API_SOURCE?.toLowerCase();
  if (source === 'rapidapi') {
    return 'rapidapi';
  }
  return 'pa-api';
}

/**
 * Check if RapidAPI is configured
 */
function isRapidAPIConfigured(): boolean {
  return !!process.env.RAPIDAPI_KEY;
}

/**
 * Create Amazon PA-API client with platform-specific providers
 */
export function createAmazonClient(): MarketplaceClient {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG;

  if (!accessKey || !secretKey || !associateTag) {
    throw new Error('Amazon API credentials are missing. Set AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, and AMAZON_ASSOCIATE_TAG environment variables.');
  }

  const credentials: AmazonCredentials = {
    accessKey,
    secretKey,
    associateTag,
    region: process.env.AMAZON_REGION || 'us-east-1',
  };

  const cryptoProvider = createNodeCryptoProvider();
  const httpClient = createWebHttpClient();

  return new AmazonClient(credentials, cryptoProvider, httpClient);
}

/**
 * Create RapidAPI Amazon client with platform-specific providers
 */
export function createRapidAPIAmazonClient(): MarketplaceClient {
  const apiKey = process.env.RAPIDAPI_KEY;

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY environment variable is not set. Get your API key from https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data');
  }

  const config: RapidAPIConfig = {
    apiKey,
    apiHost: 'real-time-amazon-data.p.rapidapi.com',
  };

  const httpClient = createWebHttpClient();

  return new RapidAPIAmazonClient(config, httpClient);
}

/**
 * Create eBay client with platform-specific providers
 */
export function createEbayClient(): MarketplaceClient {
  const appId = process.env.EBAY_APP_ID;
  const authToken = process.env.EBAY_AUTH_TOKEN || ''; // Optional for Finding API

  if (!appId) {
    throw new Error('EBAY_APP_ID environment variable is not set');
  }

  const credentials: eBayCredentials = {
    appId,
    authToken, // Required by interface, but optional for Finding API
    siteId: process.env.EBAY_SITE_ID || 'EBAY-US',
  };

  const httpClient = createWebHttpClient();

  return new eBayClient(credentials, httpClient);
}

/**
 * Create the appropriate Amazon client based on configuration
 */
export function createConfiguredAmazonClient(): MarketplaceClient {
  const source = getAmazonAPISource();

  if (source === 'rapidapi') {
    if (!isRapidAPIConfigured()) {
      console.warn('RapidAPI selected but not configured, falling back to PA-API');
      return createAmazonClient();
    }
    console.info('Using RapidAPI Real-Time Amazon Data client');
    return createRapidAPIAmazonClient();
  }

  console.info('Using Amazon PA-API 5.0 client');
  return createAmazonClient();
}

/**
 * Mobile HTTP Client
 *
 * Platform-specific implementation of IHttpClient for React Native/Expo environments
 * Wrapper around the global fetch API (available in React Native)
 */

import type { IHttpClient } from '@rare-find/shared';

/**
 * Mobile implementation of IHttpClient using fetch
 * React Native provides fetch API globally, similar to web
 */
export class MobileHttpClient implements IHttpClient {
  /**
   * Make HTTP request using fetch
   */
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}

/**
 * Create a mobile HTTP client instance
 */
export function createMobileHttpClient(): MobileHttpClient {
  return new MobileHttpClient();
}

/**
 * Web HTTP Client
 *
 * Platform-specific implementation of IHttpClient for web/Node.js environments
 * Wrapper around the global fetch API
 */

import type { IHttpClient } from '@rare-find/shared';

/**
 * Web implementation of IHttpClient using fetch
 */
export class WebHttpClient implements IHttpClient {
  /**
   * Make HTTP request using fetch
   */
  async fetch(url: string, options?: RequestInit): Promise<Response> {
    return fetch(url, options);
  }
}

/**
 * Create a web HTTP client instance
 */
export function createWebHttpClient(): WebHttpClient {
  return new WebHttpClient();
}

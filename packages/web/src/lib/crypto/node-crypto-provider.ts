/**
 * Node.js Crypto Provider
 *
 * Platform-specific implementation of ICryptoProvider for Node.js/web environments
 * Uses Node.js built-in crypto module
 */

import { createHash, createHmac } from 'node:crypto';
import type { ICryptoProvider } from '@rare-find/shared';

/**
 * Node.js implementation of ICryptoProvider
 */
export class NodeCryptoProvider implements ICryptoProvider {
  /**
   * Calculate SHA256 hash
   */
  sha256(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Calculate HMAC-SHA256
   */
  hmacSha256(key: string | Buffer, data: string): Buffer {
    return createHmac('sha256', key).update(data).digest();
  }
}

/**
 * Create a Node.js crypto provider instance
 */
export function createNodeCryptoProvider(): NodeCryptoProvider {
  return new NodeCryptoProvider();
}

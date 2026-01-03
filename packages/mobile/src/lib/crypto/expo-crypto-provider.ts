/**
 * Expo Crypto Provider
 *
 * Platform-specific implementation of ICryptoProvider for React Native/Expo environments
 * Uses crypto-js for synchronous cryptographic operations (required for AWS Signature v4)
 */

import CryptoJS from 'crypto-js';
import type { ICryptoProvider } from '@rare-find/shared';

/**
 * Expo implementation of ICryptoProvider using crypto-js
 * Note: We use crypto-js instead of expo-crypto because:
 * 1. AWS Signature v4 requires synchronous crypto operations
 * 2. crypto-js provides synchronous SHA256 and HMAC-SHA256
 * 3. crypto-js works well in React Native environments
 */
export class ExpoCryptoProvider implements ICryptoProvider {
  /**
   * Calculate SHA256 hash
   */
  sha256(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }

  /**
   * Calculate HMAC-SHA256
   */
  hmacSha256(key: string | Buffer, data: string): Buffer {
    // Convert Buffer to string if needed
    const keyString = typeof key === 'string' ? key : key.toString('utf8');

    // Calculate HMAC-SHA256
    const hmac = CryptoJS.HmacSHA256(data, keyString);

    // Convert WordArray to Buffer
    const hexString = hmac.toString(CryptoJS.enc.Hex);
    return Buffer.from(hexString, 'hex');
  }
}

/**
 * Create an Expo crypto provider instance
 */
export function createExpoCryptoProvider(): ExpoCryptoProvider {
  return new ExpoCryptoProvider();
}

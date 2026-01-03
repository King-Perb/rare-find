/**
 * Backend API Usage Example (Recommended for Production)
 *
 * This example shows how to use the secure backend API approach
 * where API keys stay on the server and are never exposed to the mobile app
 *
 * ✅ SECURE: API keys never leave your server
 * ✅ RECOMMENDED: Industry standard approach
 * ✅ REUSES: Your existing Next.js API routes
 */

import { createBackendClient } from '../api/backend-client';

/**
 * Example: Evaluate listing using backend API
 *
 * This is the secure way - API keys (OpenAI, Amazon, eBay) stay on your server
 */
export async function exampleEvaluateListingSecure(listingUrl: string): Promise<void> {
  // Initialize backend client
  // Replace with your actual deployed API URL
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.rarefind.com';

  // Optional: Get auth token from SecureStore if user is logged in
  // const authToken = await SecureStore.getItemAsync('auth_token');

  const client = createBackendClient(apiUrl /*, authToken */);

  try {
    // Call your Next.js API endpoint
    // The API will:
    // 1. Fetch listing from Amazon/eBay (using server-side API keys)
    // 2. Evaluate using OpenAI (using server-side API key)
    // 3. Return the result
    const response = await client.evaluateListing({
      listingUrl,
      mode: 'multimodal',
    });

    console.log('✅ Evaluation complete!');
    console.log('Listing:', response.listing.title);
    console.log('Confidence:', response.result.evaluation.confidenceScore);
    console.log('Market Value:', response.result.evaluation.estimatedMarketValue);
    console.log('Undervaluation:', response.result.evaluation.undervaluationPercentage, '%');
  } catch (error) {
    console.error('❌ Failed to evaluate listing:', error);
    throw error;
  }
}

/**
 * Example: Evaluate multiple listings
 */
export async function exampleBatchEvaluate(listingUrls: string[]): Promise<void> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.rarefind.com';
  const client = createBackendClient(apiUrl);

  const results = [];

  for (const url of listingUrls) {
    try {
      const response = await client.evaluateListing({ listingUrl: url });
      results.push(response);
      console.log(`✅ Evaluated: ${response.listing.title}`);
    } catch (error) {
      console.error(`❌ Failed to evaluate ${url}:`, error);
      // Continue with next listing
    }
  }

  console.log(`Completed ${results.length}/${listingUrls.length} evaluations`);
}

/**
 * Example: Handle errors gracefully
 */
export async function exampleEvaluateWithErrorHandling(listingUrl: string): Promise<void> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.rarefind.com';
  const client = createBackendClient(apiUrl);

  try {
    const response = await client.evaluateListing({ listingUrl });

    // Check if evaluation was successful
    if (response.success) {
      // Handle successful evaluation
      const { result, listing } = response;

      if (result.evaluation.confidenceScore > 80) {
        console.log('High confidence evaluation:', result);
      } else {
        console.log('Low confidence - may need review:', result);
      }
    }
  } catch (error) {
    // Handle different error types
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        console.error('Listing not found');
      } else if (error.message.includes('401')) {
        console.error('Authentication required');
      } else if (error.message.includes('429')) {
        console.error('Rate limit exceeded - please try again later');
      } else {
        console.error('Evaluation failed:', error.message);
      }
    } else {
      console.error('Unknown error:', error);
    }
  }
}

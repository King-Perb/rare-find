/**
 * use-evaluation hook
 *
 * Custom hook for handling listing evaluation via API
 * Manages loading states, error handling, and evaluation results
 */

import { useState, useCallback } from 'react';
import type {
  EvaluateListingRequest,
  EvaluateListingResponse,
  EvaluateListingError,
  EvaluationResult,
} from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';
import { getErrorMessage } from '@/lib/errors';

export interface UseEvaluationState {
  /** Whether an evaluation is currently in progress */
  isLoading: boolean;
  /** Error message if evaluation failed */
  error: string | null;
  /** Evaluation result if successful */
  result: EvaluationResult | null;
  /** Listing data that was evaluated */
  listing: MarketplaceListing | null;
}

export interface UseEvaluationReturn extends UseEvaluationState {
  /** Evaluate a listing by URL */
  evaluateListing: (url: string) => Promise<void>;
  /** Set mock evaluation data (for testing/demo purposes) */
  setMockData: (result: EvaluationResult, listing: MarketplaceListing) => void;
  /** Reset evaluation state (clear results and errors) */
  reset: () => void;
}

/**
 * Custom hook for evaluating marketplace listings
 *
 * @example
 * ```tsx
 * const { isLoading, error, result, listing, evaluateListing, reset } = useEvaluation();
 *
 * const handleSubmit = async (url: string) => {
 *   await evaluateListing(url);
 * };
 * ```
 */
export function useEvaluation(): UseEvaluationReturn {
  const [state, setState] = useState<UseEvaluationState>({
    isLoading: false,
    error: null,
    result: null,
    listing: null,
  });

  const evaluateListing = useCallback(async (url: string) => {
    // Validate URL format
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Please provide a valid URL',
        result: null,
        listing: null,
      }));
      return;
    }

    // Check if URL is from a supported marketplace
    const trimmedUrl = url.trim();
    const isAmazon = trimmedUrl.includes('amazon.');
    const isEbay = trimmedUrl.includes('ebay.');

    if (!isAmazon && !isEbay) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Please provide an Amazon or eBay listing URL',
        result: null,
        listing: null,
      }));
      return;
    }

    // Set loading state
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
      listing: null,
    }));

    try {
      // Prepare request
      const request: EvaluateListingRequest = {
        listingUrl: trimmedUrl,
        mode: 'multimodal', // Use multimodal for user-provided listings
      };

      // Call API
      const response = await fetch('/api/marketplace/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      // Parse response - handle JSON parsing errors
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If JSON parsing fails, throw a more descriptive error
        throw new Error(`Failed to parse API response: ${response.statusText || 'Unknown error'}`);
      }

      // Check if response is an error (from middleware formatErrorResponse)
      if (!response.ok) {
        // Handle middleware error format: { error: { message: string, code?: string, ... } }
        if (data && typeof data === 'object' && 'error' in data) {
          const errorObj = data.error;
          if (typeof errorObj === 'object' && errorObj !== null && 'message' in errorObj) {
            throw new Error(String(errorObj.message));
          }
          if (typeof errorObj === 'string') {
            throw new Error(errorObj);
          }
        }
        // Handle EvaluateListingError format: { success: false, error: string }
        if (data && typeof data === 'object' && 'success' in data && data.success === false) {
          const errorData = data as EvaluateListingError;
          throw new Error(errorData.error || `Evaluation failed: ${response.statusText}`);
        }
        // Fallback
        throw new Error(`Evaluation failed: ${response.statusText}`);
      }

      // Check for success response
      if (!data.success) {
        const errorData = data as EvaluateListingError;
        throw new Error(errorData.error || 'Evaluation failed');
      }

      // Success - update state with results
      const successData = data as EvaluateListingResponse;
      setState({
        isLoading: false,
        error: null,
        result: successData.result,
        listing: successData.listing,
      });
    } catch (error: unknown) {
      // Handle errors - use getErrorMessage for consistent error extraction
      // Debug: Log the error to see what we're receiving
      if (process.env.NODE_ENV === 'development') {
        console.log('[use-evaluation] Caught error:', error);
        console.log('[use-evaluation] Error type:', typeof error);
        console.log('[use-evaluation] Error is Error instance:', error instanceof Error);
        if (error instanceof Error) {
          console.log('[use-evaluation] Error message:', error.message);
        }
      }

      // Type assertion for getErrorMessage - it handles unknown types
      const errorMessage = getErrorMessage(error as string | null | Error | Record<string, unknown>) || 'An unexpected error occurred during evaluation';

      // Debug: Verify errorMessage is a string
      if (process.env.NODE_ENV === 'development') {
        console.log('[use-evaluation] Extracted error message:', errorMessage);
        console.log('[use-evaluation] Error message type:', typeof errorMessage);
        if (typeof errorMessage !== 'string') {
          console.error('[use-evaluation] ERROR: errorMessage is not a string!', errorMessage);
        }
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        result: null,
        listing: null,
      }));
    }
  }, []);

  const setMockData = useCallback((result: EvaluationResult, listing: MarketplaceListing) => {
    setState({
      isLoading: false,
      error: null,
      result,
      listing,
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      listing: null,
    });
  }, []);

  return {
    ...state,
    evaluateListing,
    setMockData,
    reset,
  };
}

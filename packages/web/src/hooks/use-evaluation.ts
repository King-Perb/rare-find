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

  // Helper function to validate URL
  const validateUrl = useCallback((url: string): { valid: boolean; error: string | null } => {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return { valid: false, error: 'Please provide a valid URL' };
    }

    const trimmedUrl = url.trim();
    const isAmazon = trimmedUrl.includes('amazon.');
    const isEbay = trimmedUrl.includes('ebay.');

    if (!isAmazon && !isEbay) {
      return { valid: false, error: 'Please provide an Amazon or eBay listing URL' };
    }

    return { valid: true, error: null };
  }, []);

  // Helper function to extract error message from middleware error format
  const extractMiddlewareErrorMessage = useCallback((data: unknown): string | null => {
    if (!data || typeof data !== 'object' || !('error' in data)) {
      return null;
    }
    const errorObj = (data as { error: unknown }).error;
    if (typeof errorObj === 'object' && errorObj !== null && 'message' in errorObj) {
      return String(errorObj.message);
    }
    if (typeof errorObj === 'string') {
      return errorObj;
    }
    return null;
  }, []);

  // Helper function to handle HTTP error responses
  const handleHttpError = useCallback((data: unknown, response: Response): never => {
    const middlewareError = extractMiddlewareErrorMessage(data);
    if (middlewareError) {
      // Using TypeError since this error occurs after type checking in extractMiddlewareErrorMessage
      throw new TypeError(middlewareError);
    }
    if (data && typeof data === 'object' && 'success' in data && (data as { success: unknown }).success === false) {
      const errorData = data as EvaluateListingError;
      throw new Error(errorData.error || `Evaluation failed: ${response.statusText}`);
    }
    throw new TypeError(`Evaluation failed: ${response.statusText}`);
  }, [extractMiddlewareErrorMessage]);

  // Helper function to parse API response
  // Note: This function throws errors for all error cases, so it only returns EvaluateListingResponse
  const parseApiResponse = useCallback(async (response: Response): Promise<EvaluateListingResponse> => {
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Failed to parse API response: ${response.statusText || 'Unknown error'}. Parse error: ${errorMessage}`);
    }

    // Check if response is an HTTP error
    if (!response.ok) {
      handleHttpError(data, response);
    }

    // Check for success response
    if (!data.success) {
      const errorData = data as EvaluateListingError;
      throw new Error(errorData.error || 'Evaluation failed');
    }

    return data as EvaluateListingResponse;
  }, [handleHttpError]);

  // Helper function to log error in development
  const logErrorInDev = useCallback((error: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[use-evaluation] Caught error:', error);
      console.log('[use-evaluation] Error type:', typeof error);
      console.log('[use-evaluation] Error is Error instance:', error instanceof Error);
      if (error instanceof Error) {
        console.log('[use-evaluation] Error message:', error.message);
      }
    }
  }, []);

  const evaluateListing = useCallback(async (url: string) => {
    // Validate URL format
    const validation = validateUrl(url);
    if (!validation.valid) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: validation.error,
        result: null,
        listing: null,
      }));
      return;
    }

    const trimmedUrl = url.trim();

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

      // Parse and validate response
      const successData = await parseApiResponse(response);

      // Success - update state with results
      setState({
        isLoading: false,
        error: null,
        result: successData.result,
        listing: successData.listing,
      });
    } catch (error: unknown) {
      // Handle errors - use getErrorMessage for consistent error extraction
      logErrorInDev(error);

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
  }, [validateUrl, parseApiResponse, logErrorInDev]);

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

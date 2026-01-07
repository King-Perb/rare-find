/**
 * Tests for useEvaluation Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEvaluation } from '@/hooks/use-evaluation';
import {
  createSampleListing,
  createSampleEvaluationResult,
  createMockEvaluationResponse,
  createMockEvaluationErrorResponse,
  createMockFetchResponse,
} from '@/lib/services/__tests__/test-utils';

// Mock fetch globally
globalThis.fetch = vi.fn();

// Mock getErrorMessage
vi.mock('@/lib/errors', () => ({
  getErrorMessage: vi.fn((error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return 'An unexpected error occurred during evaluation';
  }),
}));

describe('useEvaluation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NODE_ENV', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useEvaluation());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
      expect(result.current.listing).toBeNull();
      expect(typeof result.current.evaluateListing).toBe('function');
      expect(typeof result.current.setMockData).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('evaluateListing - URL validation', () => {
    it('should reject empty URL', async () => {
      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Please provide a valid URL');
      });
      expect(result.current.result).toBeNull();
      expect(result.current.listing).toBeNull();
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should reject whitespace-only URL', async () => {
      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('   ');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Please provide a valid URL');
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should reject non-string URL', async () => {
      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        // @ts-expect-error - Testing invalid input
        await result.current.evaluateListing(null);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Please provide a valid URL');
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should reject URL from unsupported marketplace', async () => {
      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://example.com/item');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Please provide an Amazon or eBay listing URL');
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
    });

    it('should accept Amazon URL', async () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationResponse(mockResult, mockListing)
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/marketplace/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingUrl: 'https://amazon.com/dp/B123',
          mode: 'multimodal',
        }),
      });
    });

    it('should accept eBay URL', async () => {
      const mockListing = createSampleListing({
        marketplace: 'ebay',
        marketplaceId: '123',
        listingUrl: 'https://ebay.com/itm/123',
      });
      const mockResult = createSampleEvaluationResult();

      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationResponse(mockResult, mockListing)
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://ebay.com/itm/123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/marketplace/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingUrl: 'https://ebay.com/itm/123',
          mode: 'multimodal',
        }),
      });
    });

    it('should trim URL whitespace', async () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationResponse(mockResult, mockListing)
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('  https://amazon.com/dp/B123  ');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(globalThis.fetch).toHaveBeenCalledWith('/api/marketplace/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingUrl: 'https://amazon.com/dp/B123',
          mode: 'multimodal',
        }),
      });
    });
  });

  describe('evaluateListing - loading state', () => {
    it('should set loading state during evaluation', async () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      let resolvePromise: (value: Response) => void;
      const promise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(globalThis.fetch).mockReturnValueOnce(promise);

      const { result } = renderHook(() => useEvaluation());

      // Start evaluation (don't await yet - we want to check loading state)
      const evaluatePromise = result.current.evaluateListing('https://amazon.com/dp/B123');

      // Check loading state is set
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });
      expect(result.current.error).toBeNull();

      // Resolve the fetch
      resolvePromise!(createMockEvaluationResponse(mockResult, mockListing));

      await act(async () => {
        await evaluatePromise;
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should clear previous error when starting new evaluation', async () => {
      const { result } = renderHook(() => useEvaluation());

      // First, set an error
      await act(async () => {
        await result.current.evaluateListing('');
      });
      await waitFor(() => {
        expect(result.current.error).toBe('Please provide a valid URL');
      });

      // Then start a valid evaluation
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationResponse(mockResult, mockListing)
      );

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('evaluateListing - success handling', () => {
    it('should handle successful evaluation', async () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        images: ['image1.jpg'],
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult({
        evaluation: {
          estimatedMarketValue: 120,
          undervaluationPercentage: 20,
          confidenceScore: 85,
          reasoning: 'Good deal',
          factors: ['rare condition', 'below market'],
          isReplicaOrNovelty: false,
        },
      });

      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationResponse(mockResult, mockListing)
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.result).toEqual(mockResult);
        expect(result.current.listing).toEqual(mockListing);
      });
    });
  });

  describe('evaluateListing - error handling', () => {
    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Network error');
        expect(result.current.result).toBeNull();
        expect(result.current.listing).toBeNull();
      });
    });

    it('should handle non-OK response with error object', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationErrorResponse({ message: 'Invalid listing URL', code: 'VALIDATION_ERROR' })
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Invalid listing URL');
      });
    });

    it('should handle non-OK response with error string', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationErrorResponse('Invalid listing URL')
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Invalid listing URL');
      });
    });

    it('should handle non-OK response with EvaluateListingError format', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockEvaluationErrorResponse('Evaluation failed')
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Evaluation failed');
      });
    });

    it('should handle non-OK response fallback', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      } as Response);

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Evaluation failed: Internal Server Error');
      });
    });

    it('should handle success: false in response', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        createMockFetchResponse({
          success: false,
          error: 'Evaluation failed',
        })
      );

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('Evaluation failed');
      });
    });

    it('should handle JSON parse errors', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce({
        ok: true,
        statusText: 'OK',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as unknown as Response);

      const { result } = renderHook(() => useEvaluation());

      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toContain('Failed to parse API response');
      });
    });
  });

  describe('setMockData', () => {
    it('should set mock evaluation data', () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      const { result } = renderHook(() => useEvaluation());

      act(() => {
        result.current.setMockData(mockResult, mockListing);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toEqual(mockResult);
      expect(result.current.listing).toEqual(mockListing);
    });

    it('should clear previous error when setting mock data', async () => {
      const { result } = renderHook(() => useEvaluation());

      // Set an error first
      vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error('Network error'));
      await act(async () => {
        await result.current.evaluateListing('https://amazon.com/dp/B123');
      });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Then set mock data
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      act(() => {
        result.current.setMockData(mockResult, mockListing);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      const mockListing = createSampleListing({
        marketplace: 'amazon',
        marketplaceId: 'B123',
        listingUrl: 'https://amazon.com/dp/B123',
      });
      const mockResult = createSampleEvaluationResult();

      const { result } = renderHook(() => useEvaluation());

      // Set some state
      act(() => {
        result.current.setMockData(mockResult, mockListing);
      });

      expect(result.current.result).not.toBeNull();
      expect(result.current.listing).not.toBeNull();

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
      expect(result.current.listing).toBeNull();
    });

    it('should reset error state', async () => {
      const { result } = renderHook(() => useEvaluation());

      // Set an error
      await act(async () => {
        await result.current.evaluateListing('');
      });
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });
});

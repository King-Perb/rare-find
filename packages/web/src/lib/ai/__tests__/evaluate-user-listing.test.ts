/**
 * evaluate-user-listing.ts Unit Tests
 *
 * Tests for the AI evaluation module that uses OpenAI GPT-4o for
 * multimodal listing evaluation with web search capabilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type OpenAI from 'openai';
import type { MarketplaceListing } from '../../marketplace/types';
import type { EvaluationInput } from '../types';
import { AppError } from '../../errors';

// Create a mock for the responses.create function
const mockResponsesCreate = vi.fn();

// Mock OpenAI with a proper class structure
vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      responses = {
        create: mockResponsesCreate,
      };
    },
  };
});

// Mock logger
vi.mock('../../logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock prompts
vi.mock('../prompts', () => ({
  PROMPT_VERSION: '1.2.0',
  MODEL_VERSION: 'gpt-4o',
  getEvaluationPrompt: vi.fn((mode: string) =>
    mode === 'multimodal'
      ? 'Multimodal evaluation prompt...'
      : 'Text-only evaluation prompt...'
  ),
}));

// Import after mocks
import { evaluateUserListing } from '../evaluate-user-listing';
import { logger } from '../../logger';
import { getEvaluationPrompt } from '../prompts';

/**
 * Create a sample marketplace listing for testing
 */
function createTestListing(overrides?: Partial<MarketplaceListing>): MarketplaceListing {
  return {
    id: 'test-listing-1',
    marketplace: 'amazon',
    marketplaceId: 'B08XYZ123',
    title: 'Vintage Rolex Watch 1960',
    description: 'Original vintage Rolex Datejust from 1960 in excellent condition',
    price: 2500,
    currency: 'USD',
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    category: 'Watches & Jewelry',
    condition: 'Used - Excellent',
    sellerName: 'VintageCollector',
    sellerRating: 4.8,
    listingUrl: 'https://amazon.com/dp/B08XYZ123',
    available: true,
    ...overrides,
  };
}

/**
 * Create a valid AI response JSON
 */
function createValidAIResponse(overrides?: Record<string, unknown>): string {
  const response = {
    estimatedMarketValue: 4500,
    undervaluationPercentage: 44.4,
    confidenceScore: 85,
    reasoning:
      'This vintage Rolex Datejust from 1960 is significantly undervalued. Based on recent comparable sales, similar models in this condition sell for $4,000-$5,000.',
    factors: [
      'Rare vintage year',
      'Excellent condition for age',
      'Below market average by 44%',
      'Reputable seller with high rating',
    ],
    isReplicaOrNovelty: false,
    ...overrides,
  };
  return JSON.stringify(response);
}

/**
 * URL citation annotation type for mock responses
 */
interface UrlCitationAnnotation {
  type: 'url_citation';
  url: string;
  title: string;
  start_index: number;
  end_index: number;
}

/**
 * Create a mock OpenAI Responses API response
 */
function createMockOpenAIResponse(
  content: string,
  options?: {
    webSearchUsed?: boolean;
    citations?: Array<{ url: string; title?: string }>;
    tokensUsed?: number;
  }
): OpenAI.Responses.Response {
  const output: OpenAI.Responses.ResponseOutputItem[] = [];

  // Add web search call if web search was used
  if (options?.webSearchUsed) {
    output.push({
      type: 'web_search_call',
      id: 'ws_123',
      status: 'completed',
    } as OpenAI.Responses.ResponseOutputItem);
  }

  // Build annotations for citations
  const annotations: UrlCitationAnnotation[] = [];
  if (options?.citations) {
    options.citations.forEach((citation, index) => {
      annotations.push({
        type: 'url_citation',
        url: citation.url,
        title: citation.title || 'Source',
        start_index: index * 10,
        end_index: index * 10 + 9,
      });
    });
  }

  output.push({
    type: 'message',
    id: 'msg_123',
    role: 'assistant',
    status: 'completed',
    content: [
      {
        type: 'output_text',
        text: content,
        annotations,
      },
    ],
  } as OpenAI.Responses.ResponseOutputItem);

  return {
    id: 'resp_123',
    object: 'response',
    created_at: Date.now(),
    status: 'completed',
    output,
    output_text: content,
    usage: {
      input_tokens: 500,
      output_tokens: 200,
      total_tokens: options?.tokensUsed || 700,
    },
  } as unknown as OpenAI.Responses.Response;
}

describe('evaluateUserListing', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment
    process.env = { ...originalEnv, OPENAI_API_KEY: 'test-api-key' };
    // Suppress console.log output during tests
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  describe('successful evaluation', () => {
    it('should evaluate listing successfully with multimodal mode', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse, {
        webSearchUsed: true,
        citations: [
          { url: 'https://example.com/watch-prices', title: 'Watch Market Prices' },
        ],
      });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result).toBeDefined();
      expect(result.evaluation.estimatedMarketValue).toBe(4500);
      expect(result.evaluation.undervaluationPercentage).toBe(44.4);
      expect(result.evaluation.confidenceScore).toBe(85);
      expect(result.evaluation.reasoning).toContain('vintage Rolex');
      expect(result.evaluation.factors).toHaveLength(4);
      expect(result.evaluation.isReplicaOrNovelty).toBe(false);
      expect(result.modelVersion).toBe('gpt-4o');
      expect(result.promptVersion).toBe('1.2.0');
      expect(result.evaluationMode).toBe('multimodal');
      expect(result.webSearchUsed).toBe(true);
      expect(result.webSearchCitations).toHaveLength(1);
      expect(result.webSearchCitations?.[0].url).toBe(
        'https://example.com/watch-prices'
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Starting user-provided listing evaluation',
        expect.objectContaining({
          listingId: listing.marketplaceId,
          marketplace: 'amazon',
          mode: 'multimodal',
          hasImages: true,
        })
      );
      expect(logger.info).toHaveBeenCalledWith(
        'Evaluation completed successfully',
        expect.objectContaining({
          listingId: listing.marketplaceId,
          confidenceScore: 85,
          undervaluationPercentage: 44.4,
        })
      );
    });

    it('should evaluate listing successfully with text-only mode', async () => {
      const listing = createTestListing({ images: [] });
      const input: EvaluationInput = { listing, mode: 'text-only' };
      const aiResponse = createValidAIResponse({ confidenceScore: 70 });
      const mockResponse = createMockOpenAIResponse(aiResponse, { webSearchUsed: false });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluationMode).toBe('text-only');
      expect(result.evaluation.confidenceScore).toBe(70);
      expect(result.webSearchUsed).toBe(false);
      expect(result.webSearchCitations).toBeUndefined();
    });

    it('should fall back to text-only mode when multimodal requested but no images available', async () => {
      const listing = createTestListing({ images: [] });
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluationMode).toBe('text-only');
      expect(getEvaluationPrompt).toHaveBeenCalledWith('text-only');
    });

    it('should handle response wrapped in markdown code blocks', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = `\`\`\`json
${createValidAIResponse()}
\`\`\``;
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.estimatedMarketValue).toBe(4500);
    });

    it('should handle response wrapped in plain code blocks', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = `\`\`\`
${createValidAIResponse()}
\`\`\``;
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.estimatedMarketValue).toBe(4500);
    });

    it('should handle replica/novelty items correctly', async () => {
      const listing = createTestListing({
        title: 'Replica Rolex Watch',
        price: 25,
      });
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse({
        estimatedMarketValue: 20,
        undervaluationPercentage: -25,
        confidenceScore: 90,
        reasoning: 'This is a replica/novelty item worth approximately $15-25.',
        factors: ['Replica item', 'Typical novelty pricing'],
        isReplicaOrNovelty: true,
      });
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.isReplicaOrNovelty).toBe(true);
      expect(result.evaluation.estimatedMarketValue).toBe(20);
    });

    it('should limit images to 10 for multimodal evaluation', async () => {
      const images = Array.from(
        { length: 15 },
        (_, i) => `https://example.com/image${i + 1}.jpg`
      );
      const listing = createTestListing({ images });
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await evaluateUserListing(input);

      // Check that only 10 images are included in the request
      const callArgs = mockResponsesCreate.mock.calls[0][0] as Record<string, unknown>;
      const inputItems = callArgs.input as OpenAI.Responses.ResponseInputItem[];
      const messageItem = inputItems[0] as OpenAI.Responses.EasyInputMessage;
      const content = messageItem.content as OpenAI.Responses.ResponseInputContent[];
      const imageContents = content.filter(
        (c): c is OpenAI.Responses.ResponseInputImage => c.type === 'input_image'
      );
      expect(imageContents).toHaveLength(10);
    });

    it('should skip invalid image URLs', async () => {
      const listing = createTestListing({
        images: [
          'https://example.com/valid1.jpg',
          'data:image/png;base64,abc123', // Invalid - not http/https
          '/relative/path.jpg', // Invalid - not http/https
          'https://example.com/valid2.jpg',
        ],
      });
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await evaluateUserListing(input);

      const callArgs = mockResponsesCreate.mock.calls[0][0] as Record<string, unknown>;
      const inputItems = callArgs.input as OpenAI.Responses.ResponseInputItem[];
      const messageItem = inputItems[0] as OpenAI.Responses.EasyInputMessage;
      const content = messageItem.content as OpenAI.Responses.ResponseInputContent[];
      const imageContents = content.filter(
        (c): c is OpenAI.Responses.ResponseInputImage => c.type === 'input_image'
      );
      expect(imageContents).toHaveLength(2);
    });

    it('should include web search tool in API request', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await evaluateUserListing(input);

      expect(mockResponsesCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4o',
          tools: [{ type: 'web_search_preview' }],
          temperature: 0.7,
          max_output_tokens: 1000,
        })
      );
    });

    it('should handle optional listing fields', async () => {
      const listing = createTestListing({
        description: undefined,
        category: undefined,
        condition: undefined,
        sellerName: undefined,
        sellerRating: undefined,
      });
      const input: EvaluationInput = { listing, mode: 'text-only' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result).toBeDefined();
      expect(result.evaluation.estimatedMarketValue).toBe(4500);
    });

    it('should handle null sellerRating', async () => {
      const listing = createTestListing({ sellerRating: null as unknown as number });
      const input: EvaluationInput = { listing, mode: 'text-only' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result).toBeDefined();
    });

    it('should extract multiple web search citations', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse, {
        webSearchUsed: true,
        citations: [
          { url: 'https://example1.com', title: 'Source 1' },
          { url: 'https://example2.com', title: 'Source 2' },
          { url: 'https://example3.com', title: 'Source 3' },
        ],
      });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.webSearchCitations).toHaveLength(3);
      expect(result.webSearchCitations?.[0].url).toBe('https://example1.com');
      expect(result.webSearchCitations?.[1].url).toBe('https://example2.com');
      expect(result.webSearchCitations?.[2].url).toBe('https://example3.com');
    });
  });

  describe('error handling', () => {
    it('should throw AppError when OPENAI_API_KEY is not set', async () => {
      delete process.env.OPENAI_API_KEY;

      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'OPENAI_API_KEY environment variable is not set'
      );
    });

    it('should throw AppError for invalid evaluation mode', async () => {
      const listing = createTestListing();
      const input = { listing, mode: 'invalid-mode' } as unknown as EvaluationInput;

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'Invalid evaluation mode: invalid-mode'
      );
    });

    it('should throw AppError when AI returns empty response', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const mockResponse = createMockOpenAIResponse('');
      mockResponse.output_text = null as unknown as string;

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'AI returned empty response'
      );
    });

    it('should throw AppError when AI returns invalid JSON', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const mockResponse = createMockOpenAIResponse('not valid json');

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'Failed to parse AI evaluation response'
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to parse AI response',
        expect.objectContaining({
          content: 'not valid json',
        })
      );
    });

    it('should throw AppError when response is missing required fields', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      // Missing required fields
      const invalidResponse = JSON.stringify({
        estimatedMarketValue: 100,
        // Missing: undervaluationPercentage, confidenceScore, reasoning, factors
      });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'Failed to parse AI evaluation response'
      );
    });

    it('should throw AppError for invalid estimatedMarketValue', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = createValidAIResponse({ estimatedMarketValue: -100 });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should throw AppError for invalid undervaluationPercentage', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = createValidAIResponse({
        undervaluationPercentage: 2000, // Out of range (max 1000)
      });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should throw AppError for invalid confidenceScore (too low)', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = createValidAIResponse({ confidenceScore: -10 });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should throw AppError for invalid confidenceScore (too high)', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = createValidAIResponse({ confidenceScore: 150 });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should throw AppError for empty reasoning', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = createValidAIResponse({ reasoning: '   ' });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should handle OpenAI API errors', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };

      mockResponsesCreate.mockRejectedValue(new Error('API rate limit exceeded'));

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow(
        'Failed to evaluate listing with AI'
      );

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to evaluate listing',
        expect.objectContaining({
          error: 'API rate limit exceeded',
          listingId: listing.marketplaceId,
        })
      );
    });

    it('should re-throw AppError without wrapping', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };

      const originalError = new AppError('Custom AI error', 503, 'AI_UNAVAILABLE');
      mockResponsesCreate.mockRejectedValue(originalError);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
      await expect(evaluateUserListing(input)).rejects.toThrow('Custom AI error');
    });

    it('should handle non-Error thrown values', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };

      mockResponsesCreate.mockRejectedValue('String error');

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to evaluate listing',
        expect.objectContaining({
          error: 'String error',
        })
      );
    });
  });

  describe('response parsing edge cases', () => {
    it('should handle NaN values in response', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const invalidResponse = JSON.stringify({
        estimatedMarketValue: 'not-a-number',
        undervaluationPercentage: 25,
        confidenceScore: 85,
        reasoning: 'Test reasoning',
        factors: ['Factor 1'],
      });
      const mockResponse = createMockOpenAIResponse(invalidResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await expect(evaluateUserListing(input)).rejects.toThrow(AppError);
    });

    it('should convert factors to strings when not already strings', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithMixedFactors = JSON.stringify({
        estimatedMarketValue: 100,
        undervaluationPercentage: 25,
        confidenceScore: 85,
        reasoning: 'Test reasoning',
        factors: [123, 'string factor', true], // Mixed types
      });
      const mockResponse = createMockOpenAIResponse(responseWithMixedFactors);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.factors).toEqual(['123', 'string factor', 'true']);
    });

    it('should handle empty factors array', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithEmptyFactors = createValidAIResponse({ factors: [] });
      const mockResponse = createMockOpenAIResponse(responseWithEmptyFactors);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.factors).toEqual([]);
    });

    it('should handle non-array factors', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithNonArrayFactors = JSON.stringify({
        estimatedMarketValue: 100,
        undervaluationPercentage: 25,
        confidenceScore: 85,
        reasoning: 'Test reasoning',
        factors: 'not an array',
      });
      const mockResponse = createMockOpenAIResponse(responseWithNonArrayFactors);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.factors).toEqual([]);
    });

    it('should round confidence score to integer', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithDecimalConfidence = createValidAIResponse({
        confidenceScore: 85.7,
      });
      const mockResponse = createMockOpenAIResponse(responseWithDecimalConfidence);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.confidenceScore).toBe(86);
    });

    it('should trim reasoning whitespace', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithWhitespace = createValidAIResponse({
        reasoning: '  This is the reasoning.  ',
      });
      const mockResponse = createMockOpenAIResponse(responseWithWhitespace);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.reasoning).toBe('This is the reasoning.');
    });

    it('should default isReplicaOrNovelty to false when not provided', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const responseWithoutReplica = JSON.stringify({
        estimatedMarketValue: 100,
        undervaluationPercentage: 25,
        confidenceScore: 85,
        reasoning: 'Test reasoning',
        factors: ['Factor 1'],
        // isReplicaOrNovelty not included
      });
      const mockResponse = createMockOpenAIResponse(responseWithoutReplica);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.evaluation.isReplicaOrNovelty).toBe(false);
    });

    it('should accept valid undervaluation percentage boundaries', async () => {
      // Test minimum valid (-100)
      const listing = createTestListing();
      let input: EvaluationInput = { listing, mode: 'multimodal' };
      let response = createValidAIResponse({ undervaluationPercentage: -100 });
      let mockResponse = createMockOpenAIResponse(response);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      let result = await evaluateUserListing(input);
      expect(result.evaluation.undervaluationPercentage).toBe(-100);

      // Test maximum valid (1000)
      input = { listing, mode: 'multimodal' };
      response = createValidAIResponse({ undervaluationPercentage: 1000 });
      mockResponse = createMockOpenAIResponse(response);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      result = await evaluateUserListing(input);
      expect(result.evaluation.undervaluationPercentage).toBe(1000);
    });
  });

  describe('web search extraction', () => {
    it('should detect web search when web_search_call is in output', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse, {
        webSearchUsed: true,
      });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.webSearchUsed).toBe(true);
    });

    it('should not report web search when not used', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse, {
        webSearchUsed: false,
      });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.webSearchUsed).toBe(false);
    });

    it('should handle empty output array', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = {
        id: 'resp_123',
        object: 'response',
        output: [],
        output_text: aiResponse,
        usage: { total_tokens: 100 },
      } as unknown as OpenAI.Responses.Response;

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.webSearchUsed).toBe(false);
      expect(result.webSearchCitations).toBeUndefined();
    });

    it('should handle missing output array', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = {
        id: 'resp_123',
        object: 'response',
        output_text: aiResponse,
        usage: { total_tokens: 100 },
      } as unknown as OpenAI.Responses.Response;

      mockResponsesCreate.mockResolvedValue(mockResponse);

      const result = await evaluateUserListing(input);

      expect(result.webSearchUsed).toBe(false);
    });
  });

  describe('logging', () => {
    it('should log debug info for API request', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse);

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await evaluateUserListing(input);

      expect(logger.debug).toHaveBeenCalledWith(
        'Sending request to OpenAI Responses API',
        expect.objectContaining({
          model: 'gpt-4o',
          mode: 'multimodal',
          imageCount: 2,
          webSearchEnabled: true,
        })
      );
    });

    it('should log response info with token usage', async () => {
      const listing = createTestListing();
      const input: EvaluationInput = { listing, mode: 'multimodal' };
      const aiResponse = createValidAIResponse();
      const mockResponse = createMockOpenAIResponse(aiResponse, {
        tokensUsed: 850,
      });

      mockResponsesCreate.mockResolvedValue(mockResponse);

      await evaluateUserListing(input);

      expect(logger.info).toHaveBeenCalledWith(
        'Received OpenAI Responses API response',
        expect.objectContaining({
          tokensUsed: 850,
        })
      );
    });
  });
});

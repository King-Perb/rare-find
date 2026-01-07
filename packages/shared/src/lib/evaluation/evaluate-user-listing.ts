/**
 * User-Provided Listing Evaluation
 *
 * Full multimodal evaluation using GPT-4o for user-submitted listings.
 * This workflow analyzes both text descriptions and product images for maximum accuracy.
 * Uses the OpenAI Responses API with built-in web search for real-time market data.
 *
 * Platform-agnostic implementation that accepts OpenAI client and logger via dependency injection.
 *
 * Use this for:
 * - User explicitly requests evaluation of a specific listing
 * - Manual listing submission via UI
 * - High-value items requiring detailed assessment
 * - User wants maximum confidence in evaluation
 */

import type OpenAI from 'openai';
import type { ILogger } from '../interfaces';
import { AppError } from '../errors';
import type {
  EvaluationInput,
  EvaluationResult,
  AIEvaluationResponse,
  WebSearchCitation,
} from './types';
import { getEvaluationPrompt, PROMPT_VERSION, getModelVersion } from './prompts';
import type { MarketplaceListing } from '../marketplace/types';

/**
 * Format listing data for AI evaluation
 */
function formatListingForEvaluation(listing: MarketplaceListing): string {
  const parts: string[] = [];

  parts.push(`**Title**: ${listing.title}`);

  if (listing.description) {
    parts.push(`**Description**: ${listing.description}`);
  }

  parts.push(`**Price**: ${listing.currency} ${listing.price.toFixed(2)}`);

  if (listing.category) {
    parts.push(`**Category**: ${listing.category}`);
  }

  if (listing.condition) {
    parts.push(`**Condition**: ${listing.condition}`);
  }

  if (listing.sellerName) {
    parts.push(`**Seller**: ${listing.sellerName}`);
  }

  if (listing.sellerRating !== undefined && listing.sellerRating !== null) {
    parts.push(`**Seller Rating**: ${listing.sellerRating.toFixed(2)}/5.0`);
  }

  if (listing.images && listing.images.length > 0) {
    parts.push(`**Images**: ${listing.images.length} image(s) provided`);
  }

  parts.push(`**Listing URL**: ${listing.listingUrl}`);

  return parts.join('\n\n');
}

/**
 * Build input content for OpenAI Responses API
 *
 * The Responses API uses a different format than Chat Completions.
 * For multimodal, we include image URLs in the input array.
 */
function buildResponsesInput(
  prompt: string,
  listing: MarketplaceListing,
  mode: 'multimodal' | 'text-only'
): string | OpenAI.Responses.ResponseInputItem[] {
  const listingData = formatListingForEvaluation(listing);
  const fullPrompt = `${prompt}\n\n${listingData}`;

  // For multimodal mode, include images in the input
  if (mode === 'multimodal' && listing.images && listing.images.length > 0) {
    // Build content array with text and images
    const contentParts: OpenAI.Responses.ResponseInputContent[] = [
      {
        type: 'input_text',
        text: fullPrompt,
      },
    ];

    // Add image URLs (limit to 10 to avoid token limits)
    for (const imageUrl of listing.images.slice(0, 10)) {
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        contentParts.push({
          type: 'input_image',
          image_url: imageUrl,
          detail: 'auto', // Let the model determine the appropriate detail level
        });
      }
    }

    const inputParts: OpenAI.Responses.ResponseInputItem[] = [
      {
        type: 'message',
        role: 'user',
        content: contentParts,
      },
    ];

    return inputParts;
  }

  // Text-only mode - simple string input
  return fullPrompt;
}

/**
 * Extract citations from annotations
 */
function extractCitationsFromAnnotations(annotations: unknown[]): WebSearchCitation[] {
  const citations: WebSearchCitation[] = [];
  for (const annotation of annotations) {
    if (
      typeof annotation === 'object' &&
      annotation !== null &&
      'type' in annotation &&
      annotation.type === 'url_citation' &&
      'url' in annotation &&
      'title' in annotation &&
      'start_index' in annotation &&
      'end_index' in annotation
    ) {
      const citation = annotation as {
        type: 'url_citation';
        url: string;
        title: string;
        start_index: number;
        end_index: number;
      };
      citations.push({
        url: citation.url,
        title: citation.title,
        startIndex: citation.start_index,
        endIndex: citation.end_index,
      });
    }
  }
  return citations;
}

/**
 * Extract citations from content parts
 */
function extractCitationsFromContent(content: unknown[]): WebSearchCitation[] {
  const citations: WebSearchCitation[] = [];
  for (const contentPart of content) {
    if (
      typeof contentPart === 'object' &&
      contentPart !== null &&
      'type' in contentPart &&
      contentPart.type === 'output_text' &&
      'annotations' in contentPart &&
      Array.isArray(contentPart.annotations)
    ) {
      const partCitations = extractCitationsFromAnnotations(contentPart.annotations);
      citations.push(...partCitations);
    }
  }
  return citations;
}

/**
 * Extract web search usage information from OpenAI Responses API response
 *
 * The Responses API includes information about tool usage in the output array.
 * We look for web_search_call items to detect if web search was used.
 */
function extractWebSearchInfo(response: OpenAI.Responses.Response): {
  webSearchUsed: boolean;
  citations: WebSearchCitation[];
} {
  const citations: WebSearchCitation[] = [];
  let webSearchUsed = false;

  // Check the output array for web search calls and message annotations
  if (!response.output || !Array.isArray(response.output)) {
    return { webSearchUsed, citations };
  }

  for (const outputItem of response.output) {
    // Check for web_search_call type items
    if (outputItem.type === 'web_search_call') {
      webSearchUsed = true;
    }

    // Check for message items with annotations (citations)
    if (outputItem.type === 'message' && outputItem.content && Array.isArray(outputItem.content)) {
      const partCitations = extractCitationsFromContent(outputItem.content);
      citations.push(...partCitations);
    }
  }

  return { webSearchUsed, citations };
}

/**
 * Parse AI response JSON
 */
function parseAIResponse(
  content: string | null,
  logger: ILogger
): AIEvaluationResponse {
  if (!content) {
    throw new AppError(
      'AI returned empty response',
      500,
      'EMPTY_AI_RESPONSE'
    );
  }

  try {
    // Try to extract JSON from markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/i, '').replace(/```\s*$/, '');
    }

    const parsed = JSON.parse(jsonContent) as unknown;

    // Validate response structure
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('estimatedMarketValue' in parsed) ||
      !('undervaluationPercentage' in parsed) ||
      !('confidenceScore' in parsed) ||
      !('reasoning' in parsed) ||
      !('factors' in parsed)
    ) {
      throw new Error('Invalid response structure');
    }

    const response = parsed as Record<string, unknown>;

    // Validate and normalize values
    const estimatedMarketValue = Number(response.estimatedMarketValue);
    const undervaluationPercentage = Number(response.undervaluationPercentage);
    const confidenceScore = Number(response.confidenceScore);
    const reasoning = String(response.reasoning);
    const factors = Array.isArray(response.factors)
      ? response.factors.map(String)
      : [];
    const isReplicaOrNovelty = response.isReplicaOrNovelty === true;

    // Validate ranges
    if (
      Number.isNaN(estimatedMarketValue) ||
      estimatedMarketValue < 0
    ) {
      throw new Error('Invalid estimatedMarketValue');
    }

    if (
      Number.isNaN(undervaluationPercentage) ||
      undervaluationPercentage < -100 ||
      undervaluationPercentage > 1000
    ) {
      throw new Error('Invalid undervaluationPercentage');
    }

    if (
      Number.isNaN(confidenceScore) ||
      confidenceScore < 0 ||
      confidenceScore > 100
    ) {
      throw new Error('Invalid confidenceScore');
    }

    if (!reasoning || reasoning.trim().length === 0) {
      throw new Error('Missing or empty reasoning');
    }

    return {
      estimatedMarketValue,
      undervaluationPercentage,
      confidenceScore: Math.round(confidenceScore), // Ensure integer
      reasoning: reasoning.trim(),
      factors,
      isReplicaOrNovelty,
    };
  } catch (error) {
    logger.error('Failed to parse AI response', {
      error: error instanceof Error ? error.message : String(error),
      content,
    });
    throw new AppError(
      'Failed to parse AI evaluation response',
      500,
      'INVALID_AI_RESPONSE',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Evaluate a user-provided listing using GPT-4o multimodal capabilities
 *
 * Platform-agnostic: accepts OpenAI client, logger, and model via dependency injection.
 *
 * @param input - Evaluation input containing listing data and mode
 * @param openaiClient - OpenAI client instance (injected)
 * @param logger - Logger instance (injected)
 * @param model - Model to use (optional, defaults to 'gpt-4o')
 * @returns Evaluation result with AI assessment
 * @throws AppError if evaluation fails
 */
export async function evaluateUserListing(
  input: EvaluationInput,
  openaiClient: OpenAI,
  logger: ILogger,
  model?: string
): Promise<EvaluationResult> {
  const { listing, mode } = input;

  const modelToUse = getModelVersion(model);

  logger.info('Starting user-provided listing evaluation', {
    listingId: listing.marketplaceId,
    marketplace: listing.marketplace,
    mode,
    hasImages: listing.images?.length > 0,
    model: modelToUse,
  });

  // Validate mode
  if (mode !== 'multimodal' && mode !== 'text-only') {
    throw new AppError(
      `Invalid evaluation mode: ${mode}`,
      400,
      'INVALID_MODE'
    );
  }

  // For user-provided listings, default to multimodal if images are available
  const effectiveMode: 'multimodal' | 'text-only' =
    mode === 'multimodal' && listing.images && listing.images.length > 0
      ? 'multimodal'
      : 'text-only';

  try {
    const prompt = getEvaluationPrompt(effectiveMode);
    const responsesInput = buildResponsesInput(prompt, listing, effectiveMode);

    logger.debug('Sending request to OpenAI Responses API', {
      model: modelToUse,
      mode: effectiveMode,
      imageCount: effectiveMode === 'multimodal' ? listing.images?.length : 0,
      webSearchEnabled: true,
    });

    const startTime = Date.now();

    // Use Responses API with web search tool enabled
    // Note: Web search cannot be used with JSON mode, so we parse JSON manually from the response
    const response = await openaiClient.responses.create({
      model: modelToUse,
      input: responsesInput,
      tools: [
        { type: 'web_search_preview' }, // Enable web search for real-time market data
      ],
      temperature: 0.7, // Balance between creativity and consistency
      max_output_tokens: 1000, // Sufficient for evaluation response
      // Note: Cannot use json_object format with web_search_preview - the prompt instructs JSON output
    });

    const duration = Date.now() - startTime;

    // Extract web search usage from response
    const { webSearchUsed, citations } = extractWebSearchInfo(response);

    logger.info('Received OpenAI Responses API response', {
      duration,
      tokensUsed: response.usage?.total_tokens,
      webSearchUsed,
      citationCount: citations.length,
    });

    // Get the output text from the response
    const content = response.output_text;

    logger.debug('Raw AI response content', {
      content,
      contentLength: content?.length,
      listingId: listing.marketplaceId,
      webSearchUsed,
    });

    const aiResponse = parseAIResponse(content, logger);

    const result: EvaluationResult = {
      evaluation: aiResponse,
      modelVersion: modelToUse,
      promptVersion: PROMPT_VERSION,
      evaluationMode: effectiveMode,
      evaluatedAt: new Date(),
      webSearchUsed,
      webSearchCitations: citations.length > 0 ? citations : undefined,
    };

    logger.info('Evaluation completed successfully', {
      listingId: listing.marketplaceId,
      confidenceScore: aiResponse.confidenceScore,
      undervaluationPercentage: aiResponse.undervaluationPercentage,
      mode: effectiveMode,
      duration,
      webSearchUsed,
    });

    return result;
  } catch (error) {
    logger.error('Failed to evaluate listing', {
      error: error instanceof Error ? error.message : String(error),
      listingId: listing.marketplaceId,
      mode: effectiveMode,
    });

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      'Failed to evaluate listing with AI',
      500,
      'EVALUATION_FAILED',
      error instanceof Error ? error : undefined
    );
  }
}

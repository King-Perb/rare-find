/**
 * User-Provided Listing Evaluation
 * 
 * Full multimodal evaluation using GPT-4o for user-submitted listings.
 * This workflow analyzes both text descriptions and product images for maximum accuracy.
 * 
 * Use this for:
 * - User explicitly requests evaluation of a specific listing
 * - Manual listing submission via UI
 * - High-value items requiring detailed assessment
 * - User wants maximum confidence in evaluation
 */

import OpenAI from 'openai';
import { logger } from '../logger';
import { AppError } from '../errors';
import type {
  EvaluationInput,
  EvaluationResult,
  AIEvaluationResponse,
} from './types';
import { getEvaluationPrompt, PROMPT_VERSION, MODEL_VERSION } from './prompts';
import type { MarketplaceListing } from '../marketplace/types';

/**
 * Initialize OpenAI client
 */
function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AppError(
      'OPENAI_API_KEY environment variable is not set',
      500,
      'MISSING_API_KEY'
    );
  }
  return new OpenAI({ apiKey });
}

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
 * Build messages for OpenAI API
 */
function buildMessages(
  prompt: string,
  listing: MarketplaceListing,
  mode: 'multimodal' | 'text-only'
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: prompt,
    },
  ];

  // For multimodal mode, include images in the user message
  if (mode === 'multimodal' && listing.images && listing.images.length > 0) {
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
      {
        type: 'text',
        text: formatListingForEvaluation(listing),
      },
    ];

    // Add image URLs (GPT-4o supports image URLs)
    for (const imageUrl of listing.images.slice(0, 10)) {
      // Limit to 10 images to avoid token limits
      // Only include valid HTTP/HTTPS URLs
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        content.push({
          type: 'image_url',
          image_url: {
            url: imageUrl,
          },
        });
      }
    }

    messages.push({
      role: 'user',
      content,
    });
  } else {
    // Text-only mode
    messages.push({
      role: 'user',
      content: formatListingForEvaluation(listing),
    });
  }

  return messages;
}

/**
 * Parse AI response JSON
 */
function parseAIResponse(
  content: string | null
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
 * @param input - Evaluation input containing listing data and mode
 * @returns Evaluation result with AI assessment
 * @throws AppError if evaluation fails
 */
export async function evaluateUserListing(
  input: EvaluationInput
): Promise<EvaluationResult> {
  const { listing, mode } = input;

  logger.info('Starting user-provided listing evaluation', {
    listingId: listing.marketplaceId,
    marketplace: listing.marketplace,
    mode,
    hasImages: listing.images?.length > 0,
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
    const openai = getOpenAIClient();
    const prompt = getEvaluationPrompt(effectiveMode);
    const messages = buildMessages(prompt, listing, effectiveMode);

    logger.debug('Sending request to OpenAI', {
      model: MODEL_VERSION,
      mode: effectiveMode,
      imageCount: effectiveMode === 'multimodal' ? listing.images?.length : 0,
    });

    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: MODEL_VERSION,
      messages,
      response_format: { type: 'json_object' }, // Force JSON output
      temperature: 0.7, // Balance between creativity and consistency
      max_tokens: 1000, // Sufficient for evaluation response
    });

    const duration = Date.now() - startTime;
    logger.info('Received OpenAI response', {
      duration,
      tokensUsed: completion.usage?.total_tokens,
    });

    const content = completion.choices[0]?.message?.content;
    const aiResponse = parseAIResponse(content);

    const result: EvaluationResult = {
      evaluation: aiResponse,
      modelVersion: MODEL_VERSION,
      promptVersion: PROMPT_VERSION,
      evaluationMode: effectiveMode,
      evaluatedAt: new Date(),
    };

    logger.info('Evaluation completed successfully', {
      listingId: listing.marketplaceId,
      confidenceScore: aiResponse.confidenceScore,
      undervaluationPercentage: aiResponse.undervaluationPercentage,
      mode: effectiveMode,
      duration,
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


/**
 * AI Evaluation Types
 * 
 * Types for AI-powered listing evaluation using OpenAI GPT-4o
 * with Responses API and built-in web search support.
 */

import type { MarketplaceListing } from '../marketplace/types';

/**
 * Evaluation mode - determines whether to use multimodal (with images) or text-only evaluation
 */
export type EvaluationMode = 'multimodal' | 'text-only';

/**
 * Web search citation from OpenAI Responses API
 */
export interface WebSearchCitation {
  /** URL of the source */
  url: string;
  /** Title of the source (if available) */
  title?: string;
  /** Start index in the response text where this citation applies */
  startIndex?: number;
  /** End index in the response text where this citation applies */
  endIndex?: number;
}

/**
 * Input data for AI evaluation
 */
export interface EvaluationInput {
  /** Listing data to evaluate */
  listing: MarketplaceListing;
  /** Evaluation mode - multimodal includes image analysis, text-only skips images */
  mode: EvaluationMode;
  /** Optional category context for better evaluation */
  category?: string;
}

/**
 * Raw AI evaluation response from OpenAI
 */
export interface AIEvaluationResponse {
  /** Estimated market value in USD (always provided, even for replicas/novelty items) */
  estimatedMarketValue: number;
  /** Percentage of undervaluation (e.g., 25.5 for 25.5%) */
  undervaluationPercentage: number;
  /** Confidence score from 0-100 */
  confidenceScore: number;
  /** Detailed reasoning explanation */
  reasoning: string;
  /** Array of factors that influenced the evaluation */
  factors: string[];
  /** Whether the item is a replica, reproduction, or novelty item (not authentic) */
  isReplicaOrNovelty?: boolean;
}

/**
 * Complete evaluation result including metadata
 */
export interface EvaluationResult {
  /** Raw AI evaluation response */
  evaluation: AIEvaluationResponse;
  /** Model version used (e.g., "gpt-4o") */
  modelVersion: string;
  /** Prompt version used */
  promptVersion: string;
  /** Evaluation mode used */
  evaluationMode: EvaluationMode;
  /** Timestamp of evaluation */
  evaluatedAt: Date;
  /** Whether web search was used in this evaluation */
  webSearchUsed?: boolean;
  /** Citations from web search (if web search was used) */
  webSearchCitations?: WebSearchCitation[];
}

/**
 * Evaluation request for API endpoint
 */
export interface EvaluateListingRequest {
  /** Listing URL to evaluate (will be fetched and parsed) */
  listingUrl?: string;
  /** Or provide listing data directly */
  listing?: MarketplaceListing;
  /** Evaluation mode - defaults to "multimodal" for user-provided listings */
  mode?: EvaluationMode;
}

/**
 * Evaluation response from API endpoint
 */
export interface EvaluateListingResponse {
  /** Evaluation result */
  result: EvaluationResult;
  /** Listing data that was evaluated */
  listing: MarketplaceListing;
  /** Success indicator */
  success: true;
}

/**
 * Evaluation error response
 */
export interface EvaluateListingError {
  /** Error message */
  error: string;
  /** Error code if available */
  code?: string;
  /** Success indicator */
  success: false;
}

/**
 * Union type for API response
 */
export type EvaluateListingApiResponse = EvaluateListingResponse | EvaluateListingError;


/**
 * Tests for AI Evaluation Prompts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  PROMPT_VERSION,
  MODEL_VERSION,
  MULTIMODAL_EVALUATION_PROMPT,
  TEXT_ONLY_EVALUATION_PROMPT,
  getEvaluationPrompt,
} from '../prompts';

describe('prompts', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('PROMPT_VERSION', () => {
    it('should export prompt version constant', () => {
      expect(PROMPT_VERSION).toBe('1.2.0');
      expect(typeof PROMPT_VERSION).toBe('string');
    });
  });

  describe('MODEL_VERSION', () => {
    it('should default to gpt-4o when OPENAI_MODEL is not set', async () => {
      delete process.env.OPENAI_MODEL;
      // Re-import to get fresh value
      vi.resetModules();
      const { MODEL_VERSION } = await import('../prompts');
      expect(MODEL_VERSION).toBe('gpt-4o');
    });

    it('should use OPENAI_MODEL environment variable when set', async () => {
      process.env.OPENAI_MODEL = 'gpt-4o-mini';
      vi.resetModules();
      const { MODEL_VERSION } = await import('../prompts');
      expect(MODEL_VERSION).toBe('gpt-4o-mini');
    });
  });

  describe('MULTIMODAL_EVALUATION_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).toBeTruthy();
      expect(typeof MULTIMODAL_EVALUATION_PROMPT).toBe('string');
      expect(MULTIMODAL_EVALUATION_PROMPT.length).toBeGreaterThan(0);
    });

    it('should contain key evaluation instructions', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('expert appraiser');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('estimatedMarketValue');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('undervaluationPercentage');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('confidenceScore');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('reasoning');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('factors');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('isReplicaOrNovelty');
    });

    it('should mention image analysis', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('image');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('Image Analysis');
    });

    it('should mention web search', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('web search');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('comparable');
    });

    it('should include JSON output format example', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('JSON object');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('"estimatedMarketValue"');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('"undervaluationPercentage"');
      expect(MULTIMODAL_EVALUATION_PROMPT).toContain('"confidenceScore"');
    });
  });

  describe('TEXT_ONLY_EVALUATION_PROMPT', () => {
    it('should be a non-empty string', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toBeTruthy();
      expect(typeof TEXT_ONLY_EVALUATION_PROMPT).toBe('string');
      expect(TEXT_ONLY_EVALUATION_PROMPT.length).toBeGreaterThan(0);
    });

    it('should contain key evaluation instructions', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('expert appraiser');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('estimatedMarketValue');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('undervaluationPercentage');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('confidenceScore');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('reasoning');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('factors');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('isReplicaOrNovelty');
    });

    it('should mention text-only evaluation', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('text information only');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('no image analysis');
    });

    it('should mention web search', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('web search');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('comparable');
    });

    it('should include JSON output format example', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('JSON object');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('"estimatedMarketValue"');
    });

    it('should mention lower confidence without images', () => {
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('lower than multimodal');
      expect(TEXT_ONLY_EVALUATION_PROMPT).toContain('cannot see images');
    });
  });

  describe('getEvaluationPrompt', () => {
    it('should return multimodal prompt for multimodal mode', () => {
      const prompt = getEvaluationPrompt('multimodal');
      expect(prompt).toBe(MULTIMODAL_EVALUATION_PROMPT);
    });

    it('should return text-only prompt for text-only mode', () => {
      const prompt = getEvaluationPrompt('text-only');
      expect(prompt).toBe(TEXT_ONLY_EVALUATION_PROMPT);
    });

    it('should return different prompts for different modes', () => {
      const multimodalPrompt = getEvaluationPrompt('multimodal');
      const textOnlyPrompt = getEvaluationPrompt('text-only');
      expect(multimodalPrompt).not.toBe(textOnlyPrompt);
    });
  });
});

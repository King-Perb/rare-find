import { describe, it, expect } from 'vitest';
import {
  PROMPT_VERSION,
  MODEL_VERSION,
  getEvaluationPrompt,
  MULTIMODAL_EVALUATION_PROMPT,
  TEXT_ONLY_EVALUATION_PROMPT,
  getModelVersion,
} from '../../src/lib/evaluation/prompts';

describe('Prompts', () => {
  describe('PROMPT_VERSION', () => {
    it('should be a string', () => {
      expect(typeof PROMPT_VERSION).toBe('string');
    });

    it('should match semantic version format', () => {
      // Should be in format like "1.2.0"
      expect(PROMPT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have a value', () => {
      expect(PROMPT_VERSION.length).toBeGreaterThan(0);
    });
  });

  describe('MODEL_VERSION', () => {
    it('should be a string', () => {
      expect(typeof MODEL_VERSION).toBe('string');
    });

    it('should have a default value', () => {
      expect(MODEL_VERSION.length).toBeGreaterThan(0);
    });

    it('should default to gpt-4o', () => {
      expect(MODEL_VERSION).toBe('gpt-4o');
    });
  });

  describe('getModelVersion', () => {
    it('should return provided model when given', () => {
      expect(getModelVersion('gpt-4o-mini')).toBe('gpt-4o-mini');
      expect(getModelVersion('gpt-4.1')).toBe('gpt-4.1');
      expect(getModelVersion('gpt-5')).toBe('gpt-5');
    });

    it('should default to gpt-4o when no model provided', () => {
      expect(getModelVersion()).toBe('gpt-4o');
      expect(getModelVersion(undefined)).toBe('gpt-4o');
    });

    it('should return a string', () => {
      expect(typeof getModelVersion()).toBe('string');
      expect(typeof getModelVersion('gpt-4o-mini')).toBe('string');
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

    it('should return prompts that contain evaluation instructions', () => {
      const multimodalPrompt = getEvaluationPrompt('multimodal');
      const textOnlyPrompt = getEvaluationPrompt('text-only');

      expect(multimodalPrompt).toContain('expert appraiser');
      expect(multimodalPrompt).toContain('estimatedMarketValue');
      expect(multimodalPrompt).toContain('confidenceScore');

      expect(textOnlyPrompt).toContain('expert appraiser');
      expect(textOnlyPrompt).toContain('estimatedMarketValue');
      expect(textOnlyPrompt).toContain('confidenceScore');
    });

    it('should return multimodal prompt that mentions image analysis', () => {
      const prompt = getEvaluationPrompt('multimodal');
      expect(prompt.toLowerCase()).toContain('image');
    });

    it('should return text-only prompt that mentions text-only evaluation', () => {
      const prompt = getEvaluationPrompt('text-only');
      expect(prompt.toLowerCase()).toContain('text');
      expect(prompt.toLowerCase()).toContain('no image');
    });
  });

  describe('Prompt constants', () => {
    it('should export MULTIMODAL_EVALUATION_PROMPT', () => {
      expect(typeof MULTIMODAL_EVALUATION_PROMPT).toBe('string');
      expect(MULTIMODAL_EVALUATION_PROMPT.length).toBeGreaterThan(0);
    });

    it('should export TEXT_ONLY_EVALUATION_PROMPT', () => {
      expect(typeof TEXT_ONLY_EVALUATION_PROMPT).toBe('string');
      expect(TEXT_ONLY_EVALUATION_PROMPT.length).toBeGreaterThan(0);
    });

    it('should have different content for multimodal vs text-only prompts', () => {
      expect(MULTIMODAL_EVALUATION_PROMPT).not.toBe(TEXT_ONLY_EVALUATION_PROMPT);
    });
  });
});

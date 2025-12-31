/**
 * Tests for Transition Configurations
 */

import { describe, it, expect } from 'vitest';
import {
  defaultTransition,
  fastTransition,
  slowTransition,
  springTransition,
  bounceTransition,
} from '@/lib/animations/transitions';

describe('Transition Configurations', () => {
  describe('defaultTransition', () => {
    it('should have duration of 0.3 seconds', () => {
      expect(defaultTransition.duration).toBe(0.3);
    });

    it('should use easeInOut easing', () => {
      expect(defaultTransition.ease).toBe('easeInOut');
    });
  });

  describe('fastTransition', () => {
    it('should have duration of 0.15 seconds', () => {
      expect(fastTransition.duration).toBe(0.15);
    });

    it('should use easeInOut easing', () => {
      expect(fastTransition.ease).toBe('easeInOut');
    });
  });

  describe('slowTransition', () => {
    it('should have duration of 0.5 seconds', () => {
      expect(slowTransition.duration).toBe(0.5);
    });

    it('should use easeInOut easing', () => {
      expect(slowTransition.ease).toBe('easeInOut');
    });
  });

  describe('springTransition', () => {
    it('should be a spring type transition', () => {
      expect(springTransition.type).toBe('spring');
    });

    it('should have stiffness of 300', () => {
      expect(springTransition.stiffness).toBe(300);
    });

    it('should have damping of 30', () => {
      expect(springTransition.damping).toBe(30);
    });
  });

  describe('bounceTransition', () => {
    it('should be a spring type transition', () => {
      expect(bounceTransition.type).toBe('spring');
    });

    it('should have stiffness of 400', () => {
      expect(bounceTransition.stiffness).toBe(400);
    });

    it('should have damping of 10', () => {
      expect(bounceTransition.damping).toBe(10);
    });
  });
});

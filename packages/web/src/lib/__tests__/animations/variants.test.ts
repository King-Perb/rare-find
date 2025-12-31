/**
 * Tests for Animation Variants
 */

import { describe, it, expect } from 'vitest';
import {
  fadeIn,
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideInDown,
  scaleIn,
  scaleOut,
  staggerContainer,
  staggerItem,
  shake,
} from '@/lib/animations/variants';

describe('Animation Variants', () => {
  describe('fadeIn', () => {
    it('should have hidden state with opacity 0', () => {
      expect(fadeIn.hidden).toEqual({ opacity: 0 });
    });

    it('should have visible state with opacity 1', () => {
      expect(fadeIn.visible).toMatchObject({ opacity: 1 });
      expect(fadeIn.visible).toHaveProperty('transition');
    });
  });

  describe('fadeInUp', () => {
    it('should have hidden state with opacity 0 and y: 20', () => {
      expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it('should have visible state with opacity 1 and y: 0', () => {
      expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('fadeInDown', () => {
    it('should have hidden state with opacity 0 and y: -20', () => {
      expect(fadeInDown.hidden).toEqual({ opacity: 0, y: -20 });
    });

    it('should have visible state with opacity 1 and y: 0', () => {
      expect(fadeInDown.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('slideInLeft', () => {
    it('should have hidden state with opacity 0 and x: -50', () => {
      expect(slideInLeft.hidden).toEqual({ opacity: 0, x: -50 });
    });

    it('should have visible state with opacity 1 and x: 0', () => {
      expect(slideInLeft.visible).toMatchObject({ opacity: 1, x: 0 });
    });
  });

  describe('slideInRight', () => {
    it('should have hidden state with opacity 0 and x: 50', () => {
      expect(slideInRight.hidden).toEqual({ opacity: 0, x: 50 });
    });

    it('should have visible state with opacity 1 and x: 0', () => {
      expect(slideInRight.visible).toMatchObject({ opacity: 1, x: 0 });
    });
  });

  describe('slideInUp', () => {
    it('should have hidden state with opacity 0 and y: -50', () => {
      expect(slideInUp.hidden).toEqual({ opacity: 0, y: -50 });
    });

    it('should have visible state with opacity 1 and y: 0', () => {
      expect(slideInUp.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('slideInDown', () => {
    it('should have hidden state with opacity 0 and y: 50', () => {
      expect(slideInDown.hidden).toEqual({ opacity: 0, y: 50 });
    });

    it('should have visible state with opacity 1 and y: 0', () => {
      expect(slideInDown.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('scaleIn', () => {
    it('should have hidden state with opacity 0 and scale: 0.8', () => {
      expect(scaleIn.hidden).toEqual({ opacity: 0, scale: 0.8 });
    });

    it('should have visible state with opacity 1 and scale: 1', () => {
      expect(scaleIn.visible).toMatchObject({ opacity: 1, scale: 1 });
    });
  });

  describe('scaleOut', () => {
    it('should have hidden state with opacity 1 and scale: 1', () => {
      expect(scaleOut.hidden).toEqual({ opacity: 1, scale: 1 });
    });

    it('should have visible state with opacity 0 and scale: 0.8', () => {
      expect(scaleOut.visible).toMatchObject({ opacity: 0, scale: 0.8 });
    });
  });

  describe('staggerContainer', () => {
    it('should have hidden state with opacity 0', () => {
      expect(staggerContainer.hidden).toEqual({ opacity: 0 });
    });

    it('should have visible state with staggerChildren configuration', () => {
      expect(staggerContainer.visible).toMatchObject({ opacity: 1 });
      expect(staggerContainer.visible).toHaveProperty('transition');
      if ('transition' in staggerContainer.visible && typeof staggerContainer.visible.transition === 'object' && staggerContainer.visible.transition !== null) {
        expect(staggerContainer.visible.transition).toMatchObject({
          staggerChildren: 0.1,
          delayChildren: 0,
        });
      }
    });
  });

  describe('staggerItem', () => {
    it('should have hidden state with opacity 0 and y: 20', () => {
      expect(staggerItem.hidden).toEqual({ opacity: 0, y: 20 });
    });

    it('should have visible state with opacity 1 and y: 0', () => {
      expect(staggerItem.visible).toMatchObject({ opacity: 1, y: 0 });
    });
  });

  describe('shake', () => {
    it('should have shake state with x array animation', () => {
      expect(shake.shake).toMatchObject({
        x: [0, -10, 10, -10, 10, 0],
      });
      expect(shake.shake).toHaveProperty('transition');
      if ('transition' in shake.shake && typeof shake.shake.transition === 'object' && shake.shake.transition !== null) {
        expect(shake.shake.transition).toMatchObject({
          duration: 0.5,
          ease: 'easeInOut',
        });
      }
    });

    it('should have normal state with x: 0', () => {
      expect(shake.normal).toEqual({ x: 0 });
    });
  });
});

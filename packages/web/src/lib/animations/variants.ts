/**
 * Animation Variants
 *
 * Reusable Framer Motion animation variants for consistent animations across the application
 */

import type { Variants } from 'framer-motion';
import { defaultTransition, fastTransition, springTransition } from './transitions';

/**
 * Fade-in animation variant
 * Simple opacity fade from 0 to 1
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

/**
 * Fade-in with slide up animation variant
 * Fades in while sliding up from below
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Fade-in with slide down animation variant
 * Fades in while sliding down from above
 */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Slide in from left animation variant
 * Slides in from the left side
 */
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

/**
 * Slide in from right animation variant
 * Slides in from the right side
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

/**
 * Slide in from top animation variant
 * Slides in from above
 */
export const slideInUp: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Slide in from bottom animation variant
 * Slides in from below
 */
export const slideInDown: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Scale in animation variant
 * Scales from 0.8 to 1.0 with fade
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

/**
 * Scale out animation variant
 * Scales from 1.0 to 0.8 with fade
 */
export const scaleOut: Variants = {
  hidden: {
    opacity: 1,
    scale: 1,
  },
  visible: {
    opacity: 0,
    scale: 0.8,
    transition: fastTransition,
  },
};

/**
 * Stagger container variant
 * Container for stagger animations with delay between children
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

/**
 * Stagger item variant
 * Individual item in a stagger animation
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Shake animation variant
 * Horizontal shake for error states
 */
export const shake: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  normal: {
    x: 0,
  },
};

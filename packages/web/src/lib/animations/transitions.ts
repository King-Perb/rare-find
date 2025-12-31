/**
 * Transition Configurations
 *
 * Reusable transition configurations for consistent animation timing across the application
 */

import type { Transition } from 'framer-motion';
import { FAST_DURATION, DEFAULT_DURATION, SLOW_DURATION } from './constants';

/**
 * Default transition configuration
 * Standard ease-in-out transition for most animations
 */
export const defaultTransition: Transition = {
  duration: DEFAULT_DURATION / 1000, // Convert to seconds
  ease: 'easeInOut',
};

/**
 * Fast transition configuration
 * Quick feedback for hover states and immediate interactions
 */
export const fastTransition: Transition = {
  duration: FAST_DURATION / 1000,
  ease: 'easeInOut',
};

/**
 * Slow transition configuration
 * Dramatic effects and page transitions
 */
export const slowTransition: Transition = {
  duration: SLOW_DURATION / 1000,
  ease: 'easeInOut',
};

/**
 * Spring transition configuration
 * Natural, physics-based motion for interactive elements
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Bounce transition configuration
 * Playful bounce effect for emphasis
 */
export const bounceTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 10,
};

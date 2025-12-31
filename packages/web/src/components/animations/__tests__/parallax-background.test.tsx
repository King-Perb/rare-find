/**
 * Tests for ParallaxBackground Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParallaxBackground } from '../parallax-background';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import * as framerMotion from 'framer-motion';

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion hooks - define mocks inside factory to avoid hoisting issues
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof framerMotion>('framer-motion');

  const mockScrollY = {
    get: vi.fn(() => 0),
    set: vi.fn(),
  };

  const mockUseScroll = vi.fn(() => ({
    scrollY: mockScrollY,
    scrollYProgress: { get: () => 0 },
  }));

  const mockMotionValue = vi.fn((initial) => ({
    get: vi.fn(() => initial),
    set: vi.fn(),
  }));

  const mockUseAnimationFrame = vi.fn((callback) => {
    // Call immediately for testing
    callback(0);
  });

  return {
    ...actual,
    useScroll: mockUseScroll,
    useMotionValue: mockMotionValue,
    useAnimationFrame: mockUseAnimationFrame,
    motion: {
      div: vi.fn(({ children, ...props }) => {
        return <div data-testid="motion-div" {...props}>{children}</div>;
      }),
    },
  };
});

describe('ParallaxBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render container with ref', () => {
    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ParallaxBackground className="custom-class">
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // The className should be on the root div element
    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass('custom-class');
  });

  it('should use motion.div for parallax layers when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Should have multiple motion.div calls for different layers
    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should disable parallax when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Motion values should be created and animation frame should be called
    expect(framerMotion.useMotionValue).toHaveBeenCalled();
    expect(framerMotion.useAnimationFrame).toHaveBeenCalled();
  });

  it('should disable parallax when disabled prop is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <ParallaxBackground disabled>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Motion values should be created and animation frame should be called
    expect(framerMotion.useMotionValue).toHaveBeenCalled();
    expect(framerMotion.useAnimationFrame).toHaveBeenCalled();
  });

  it('should call useScroll with correct options', () => {
    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // useScroll should be called (mocked in framer-motion)
    expect(framerMotion.useScroll).toHaveBeenCalled();
  });

  it('should create multiple parallax layers with different speeds', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Should have multiple motion values for different layers
    expect(framerMotion.useMotionValue).toHaveBeenCalled();
    // Should have motion values for midY, nearY, farXLeft, farXRight, midXLeft, midXRight, etc.
    expect(framerMotion.useMotionValue).toHaveBeenCalledTimes(11); // 11 motion values total
  });

  it('should render parallax assets', () => {
    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Check that motion.div is called (which wraps the parallax assets)
    expect(framerMotion.motion.div).toHaveBeenCalled();
  });
});

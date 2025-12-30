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

// Mock framer-motion hooks
const mockUseScroll = vi.fn(() => ({
  scrollYProgress: { get: () => 0 },
}));

const mockUseTransform = vi.fn((value, inputRange, outputRange) => {
  return outputRange[0];
});

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof framerMotion>('framer-motion');
  return {
    ...actual,
    useScroll: () => mockUseScroll(),
    useTransform: mockUseTransform,
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
    render(
      <ParallaxBackground className="custom-class">
        <div>Test Content</div>
      </ParallaxBackground>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
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

    // Transform should return [0, 0] when reduced motion is enabled
    expect(mockUseTransform).toHaveBeenCalled();
    const calls = mockUseTransform.mock.calls;
    const reducedMotionCalls = calls.filter(
      (call) => call[2]?.[0] === 0 && call[2]?.[1] === 0
    );
    expect(reducedMotionCalls.length).toBeGreaterThan(0);
  });

  it('should disable parallax when disabled prop is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <ParallaxBackground disabled>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Transform should return [0, 0] when disabled
    expect(mockUseTransform).toHaveBeenCalled();
    const calls = mockUseTransform.mock.calls;
    const disabledCalls = calls.filter(
      (call) => call[2]?.[0] === 0 && call[2]?.[1] === 0
    );
    expect(disabledCalls.length).toBeGreaterThan(0);
  });

  it('should call useScroll with correct options', () => {
    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    expect(mockUseScroll).toHaveBeenCalled();
  });

  it('should create multiple parallax layers with different speeds', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <ParallaxBackground>
        <div>Test Content</div>
      </ParallaxBackground>
    );

    // Should have calls for far, mid, and near background layers
    expect(mockUseTransform).toHaveBeenCalled();
    const calls = mockUseTransform.mock.calls;

    // Check for different output ranges (different speeds)
    const farBackgroundCalls = calls.filter(
      (call) => call[2]?.[1] === 200 // Far background moves 200px
    );
    const midBackgroundCalls = calls.filter(
      (call) => call[2]?.[1] === 500 // Mid background moves 500px
    );
    const nearBackgroundCalls = calls.filter(
      (call) => call[2]?.[1] === 800 // Near background moves 800px
    );

    expect(farBackgroundCalls.length).toBeGreaterThan(0);
    expect(midBackgroundCalls.length).toBeGreaterThan(0);
    expect(nearBackgroundCalls.length).toBeGreaterThan(0);
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

/**
 * Tests for SlideIn Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SlideIn } from '../slide-in';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import * as framerMotion from 'framer-motion';

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => {
      return <div data-testid="motion-div" {...props}>{children}</div>;
    }),
  },
}));

describe('SlideIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should use motion.div when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );

    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should use regular div when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(
      <SlideIn>
        <div>Test Content</div>
      </SlideIn>
    );

    expect(framerMotion.motion.div).not.toHaveBeenCalled();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should use regular div when disabled prop is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <SlideIn disabled>
        <div>Test Content</div>
      </SlideIn>
    );

    expect(framerMotion.motion.div).not.toHaveBeenCalled();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <SlideIn className="custom-class">
        <div>Test Content</div>
      </SlideIn>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should use fadeInUp variant for up direction', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <SlideIn direction="up">
        <div>Test Content</div>
      </SlideIn>
    );

    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should pass delay to motion component', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <SlideIn delay={0.3}>
        <div>Test Content</div>
      </SlideIn>
    );

    const calls = vi.mocked(framerMotion.motion.div).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const firstCall = calls[0]?.[0];
    expect(firstCall).toHaveProperty('transition');
    expect(firstCall?.transition).toHaveProperty('delay', 0.3);
  });
});

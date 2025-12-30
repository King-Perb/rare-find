/**
 * Tests for ScrollReveal Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollReveal } from '../scroll-reveal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import * as framerMotion from 'framer-motion';

// Mock the hooks
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

vi.mock('@/hooks/use-scroll-animation', () => ({
  useScrollAnimation: vi.fn(() => ({
    isVisible: true,
    ref: vi.fn(), // ref is a callback function, not an object
  })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => {
      return <div data-testid="motion-div" {...props}>{children}</div>;
    }),
  },
}));

describe('ScrollReveal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should use motion.div when reduced motion is disabled and element is visible', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should use regular div when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container?.tagName).toBe('DIV');
    expect(container).not.toHaveAttribute('data-testid', 'motion-div');
  });

  it('should use regular div when disabled prop is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal disabled>
        <div>Test Content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container?.tagName).toBe('DIV');
    expect(container).not.toHaveAttribute('data-testid', 'motion-div');
  });

  it('should apply custom className', () => {
    render(
      <ScrollReveal className="custom-class">
        <div>Test Content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should pass ref to useScrollAnimation hook', () => {
    const mockRef = vi.fn();
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: mockRef,
    });

    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(useScrollAnimation).toHaveBeenCalled();
  });

  it('should pass threshold to useScrollAnimation', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal threshold={0.3}>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(useScrollAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        threshold: 0.3,
      })
    );
  });

  it('should pass rootMargin to useScrollAnimation', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal rootMargin="100px">
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(useScrollAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        rootMargin: '100px',
      })
    );
  });

  it('should pass triggerOnce to useScrollAnimation', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal triggerOnce={false}>
        <div>Test Content</div>
      </ScrollReveal>
    );

    expect(useScrollAnimation).toHaveBeenCalledWith(
      expect.objectContaining({
        triggerOnce: false,
      })
    );
  });

  it('should animate to visible when isVisible is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: true,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    const calls = vi.mocked(framerMotion.motion.div).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const firstCall = calls[0]?.[0];
    expect(firstCall).toHaveProperty('animate', 'visible');
  });

  it('should animate to hidden when isVisible is false', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);
    vi.mocked(useScrollAnimation).mockReturnValue({
      isVisible: false,
      ref: vi.fn(),
    });

    render(
      <ScrollReveal>
        <div>Test Content</div>
      </ScrollReveal>
    );

    const calls = vi.mocked(framerMotion.motion.div).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const firstCall = calls[0]?.[0];
    expect(firstCall).toHaveProperty('animate', 'hidden');
  });
});

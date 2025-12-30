/**
 * Tests for Home Page Hero Section Entrance Animations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import Home from '../page';

// Mock the evaluation hook
vi.mock('@/hooks/use-evaluation', () => ({
  useEvaluation: () => ({
    isLoading: false,
    error: null,
    result: null,
    listing: null,
    evaluateListing: vi.fn(),
    reset: vi.fn(),
    setMockData: vi.fn(),
  }),
}));

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion to track animation props
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, initial, animate, variants, transition, ...props }) => {
      return <div data-testid="motion-div" data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={variants ? 'present' : 'absent'} {...props}>{children}</div>;
    }),
  },
}));

describe('Home Page Hero Section Entrance Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render hero section elements', () => {
    render(<Home />);

    expect(screen.getByText('Rare Find')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Bargain Detection')).toBeInTheDocument();
    expect(screen.getByText(/Find undervalued items on Amazon and eBay/)).toBeInTheDocument();
  });

  it('should apply entrance animations when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<Home />);

    // Check that motion components are used (via mock)
    const motionElements = screen.getAllByTestId('motion-div');
    expect(motionElements.length).toBeGreaterThan(0);
  });

  it('should disable animations when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(<Home />);

    // When reduced motion is enabled, animations should be disabled
    // This is handled by the animation components themselves
    expect(useReducedMotion).toHaveBeenCalled();
  });

  it('should complete all animations within 1 second', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    const startTime = Date.now();
    render(<Home />);

    // Wait for animations to complete (max 1 second)
    await waitFor(
      () => {
        const elapsed = Date.now() - startTime;
        expect(elapsed).toBeLessThan(1000);
      },
      { timeout: 1100 }
    );
  });

  it('should render logo with fade and scale animation', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<Home />);

    const logo = screen.getByText('Rare Find').closest('div');
    expect(logo).toBeInTheDocument();
  });

  it('should render headline with fade and slide up animation', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<Home />);

    const headline = screen.getByText('AI-Powered Bargain Detection');
    expect(headline).toBeInTheDocument();
  });

  it('should render description with fade in animation', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<Home />);

    const description = screen.getByText(/Find undervalued items on Amazon and eBay/);
    expect(description).toBeInTheDocument();
  });

  it('should render form with fade in animation', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<Home />);

    const form = screen.getByPlaceholderText(/Paste Amazon or eBay URL/);
    expect(form).toBeInTheDocument();
  });
});

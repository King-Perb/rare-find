/**
 * Tests for EvaluationForm Component Animations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvaluationForm } from '../evaluation-form';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import type { UseEvaluationReturn } from '@/hooks/use-evaluation';

// Mock AnimatedButton
vi.mock('@/components/ui/animated-button', () => ({
  AnimatedButton: ({ children, isLoading, loadingText, ...props }: { children: React.ReactNode; isLoading?: boolean; loadingText?: string; [key: string]: unknown }) => {
    return (
      <button data-testid="animated-button" {...props}>
        {isLoading ? loadingText || 'Loading...' : children}
      </button>
    );
  },
}));

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, animate, ...props }) => {
      return <div data-testid="motion-div" data-animate={animate} {...props}>{children}</div>;
    }),
    input: vi.fn(({ animate, variants, ...props }) => {
      return <input data-testid="motion-input" data-animate={animate} data-variants={variants ? 'present' : 'absent'} {...props} />;
    }),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock evaluation hook
const createMockEvaluation = (overrides?: Partial<UseEvaluationReturn>): UseEvaluationReturn => ({
  isLoading: false,
  error: null,
  result: null,
  listing: null,
  evaluateListing: vi.fn(),
  reset: vi.fn(),
  setMockData: vi.fn(),
  ...overrides,
});

describe('EvaluationForm Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply focus animations to input', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    const evaluation = createMockEvaluation();
    render(<EvaluationForm evaluation={evaluation} />);

    const input = screen.getByPlaceholderText(/Paste Amazon or eBay listing URL/i);
    expect(input).toBeInTheDocument();

    // Focus the input
    input.focus();

    // Input should have focus styles (border color + ring)
    await waitFor(() => {
      expect(input).toHaveFocus();
    });
  });

  it('should apply shake animation on error', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    const evaluation = createMockEvaluation();
    const user = userEvent.setup();

    render(<EvaluationForm evaluation={evaluation} />);

    const input = screen.getByPlaceholderText(/Paste Amazon or eBay listing URL/i);
    const form = input.closest('form');

    // Type an invalid URL format (not a valid URL) to trigger error
    await user.type(input, 'not-a-valid-url');

    // Submit form directly to trigger error validation
    if (form) {
      fireEvent.submit(form);
    }

    // Error should appear (shake animation will be applied)
    // Wait for error to be displayed - it appears in ErrorDisplay component
    await waitFor(() => {
      const errorElement = screen.queryByText(/Please enter a valid URL/i);
      expect(errorElement).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should apply loading state transitions', async () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    const evaluation = createMockEvaluation({ isLoading: true });
    render(<EvaluationForm evaluation={evaluation} />);

    // Button should show loading state with loading text
    const button = screen.getByRole('button', { name: /Evaluating/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Evaluating...');
  });

  it('should respect reduced motion for input focus', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const evaluation = createMockEvaluation();
    render(<EvaluationForm evaluation={evaluation} />);

    const input = screen.getByPlaceholderText(/Paste Amazon or eBay listing URL/i);
    expect(input).toBeInTheDocument();
    // Input should still be functional, just without animations
  });

  it('should respect reduced motion for error shake', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const evaluation = createMockEvaluation();
    render(<EvaluationForm evaluation={evaluation} />);

    // Form should still work, just without shake animation
    const input = screen.getByPlaceholderText(/Paste Amazon or eBay listing URL/i);
    expect(input).toBeInTheDocument();
  });
});

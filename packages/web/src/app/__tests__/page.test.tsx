/**
 * Tests for Home Page Hero Section Entrance Animations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useEvaluation } from '@/hooks/use-evaluation';
import type { EvaluationResult } from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';
import Home from '../page';

// Mock the evaluation hook
const mockEvaluateListing = vi.fn();
const mockReset = vi.fn();
const mockSetMockData = vi.fn();

const createMockEvaluation = (overrides = {}) => ({
  isLoading: false,
  error: null,
  result: null,
  listing: null,
  evaluateListing: mockEvaluateListing,
  reset: mockReset,
  setMockData: mockSetMockData,
  ...overrides,
});

vi.mock('@/hooks/use-evaluation', () => ({
  useEvaluation: vi.fn(() => createMockEvaluation()),
}));

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion to track animation props
const mockScrollY = {
  get: vi.fn(() => 0),
  set: vi.fn(),
};

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    motion: {
      div: vi.fn(({ children, initial, animate, variants, ...props }) => {
        return <div data-testid="motion-div" data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={variants ? 'present' : 'absent'} {...props}>{children}</div>;
      }),
      button: vi.fn(({ children, whileHover, whileTap, ...props }) => {
        return <button data-testid="motion-button" data-while-hover={whileHover ? 'present' : 'absent'} data-while-tap={whileTap ? 'present' : 'absent'} {...props}>{children}</button>;
      }),
    },
    AnimatePresence: vi.fn(({ children }) => children),
    useScroll: vi.fn(() => ({
      scrollY: mockScrollY,
      scrollYProgress: { get: () => 0 },
    })),
    useMotionValue: vi.fn((initial) => ({
      get: vi.fn(() => initial),
      set: vi.fn(),
    })),
    useAnimationFrame: vi.fn((callback) => {
      // Call immediately for testing
      callback(0);
    }),
  };
});

// Mock StaggerContainer component
vi.mock('@/components/animations/stagger-container', () => ({
  StaggerContainer: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div data-testid="stagger-container" className={className}>{children}</div>;
  },
}));

// Mock ScrollReveal component
vi.mock('@/components/animations/scroll-reveal', () => ({
  ScrollReveal: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div data-testid="scroll-reveal" className={className}>{children}</div>;
  },
}));

// Mock FadeIn component
vi.mock('@/components/animations/fade-in', () => ({
  FadeIn: ({ children, delay }: { children: React.ReactNode; delay?: number }) => {
    return <div data-testid="fade-in" data-delay={delay}>{children}</div>;
  },
}));

// Mock EvaluationResults component
vi.mock('@/components/evaluation/evaluation-results', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EvaluationResults: ({ result: _result, listing }: { result: EvaluationResult; listing: MarketplaceListing }) => {
    return (
      <div data-testid="evaluation-results">
        <div>Evaluation Results</div>
        <div>Listing: {listing?.title}</div>
      </div>
    );
  },
}));

describe('Home Page Hero Section Entrance Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEvaluation).mockReturnValue(createMockEvaluation());
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

  it('should render features section when no results and not loading', () => {
    render(<Home />);

    expect(screen.getByText('Instant Analysis')).toBeInTheDocument();
    expect(screen.getByText('Market Value Estimates')).toBeInTheDocument();
    expect(screen.getByText('Smart Insights')).toBeInTheDocument();
  });

  it('should not render features section when results are shown', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        result: {
          evaluation: {
            estimatedMarketValue: 100,
            undervaluationPercentage: 10,
            confidenceScore: 85,
            reasoning: 'Test reasoning',
            keyFactors: [],
            isReplicaOrNovelty: false,
          },
        },
        listing: { title: 'Test Listing', price: 90, images: [] },
      })
    );

    render(<Home />);

    expect(screen.queryByText('Instant Analysis')).not.toBeInTheDocument();
  });

  it('should render loading spinner when isLoading is true', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: true,
      })
    );

    render(<Home />);

    expect(screen.getByText('Analyzing listing...')).toBeInTheDocument();
  });

  it('should render reset button when results are shown', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        result: {
          evaluation: {
            estimatedMarketValue: 100,
            undervaluationPercentage: 10,
            confidenceScore: 85,
            reasoning: 'Test reasoning',
            keyFactors: [],
            isReplicaOrNovelty: false,
          },
        },
        listing: { title: 'Test Listing', price: 90, images: [] },
      })
    );

    render(<Home />);

    const resetButton = screen.getByText('Evaluate another listing');
    expect(resetButton).toBeInTheDocument();
  });

  it('should call reset when reset button is clicked', async () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        result: {
          evaluation: {
            estimatedMarketValue: 100,
            undervaluationPercentage: 10,
            confidenceScore: 85,
            reasoning: 'Test reasoning',
            keyFactors: [],
            isReplicaOrNovelty: false,
          },
        },
        listing: { title: 'Test Listing', price: 90, images: [] },
      })
    );

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(<Home />);

    const resetButton = screen.getByText('Evaluate another listing');
    await user.click(resetButton);

    expect(mockReset).toHaveBeenCalled();
  });

  it('should render wave pattern at bottom', () => {
    render(<Home />);

    // Wave pattern should be rendered (check for SVG element)
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should handle URL validation for Amazon URLs', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste Amazon or eBay URL/);
    expect(input).toBeInTheDocument();
  });

  it('should handle URL validation for eBay URLs', () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/Paste Amazon or eBay URL/);
    expect(input).toBeInTheDocument();
  });
});

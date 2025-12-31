/**
 * Tests for Evaluate Page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EvaluatePage from '../page';
import { useEvaluation } from '@/hooks/use-evaluation';

// Mock the evaluation hook
vi.mock('@/hooks/use-evaluation', () => ({
  useEvaluation: vi.fn(),
}));

// Mock components
vi.mock('@/components/evaluation/evaluation-form', () => ({
  EvaluationForm: ({ evaluation }: { evaluation: ReturnType<typeof useEvaluation> }) => (
    <div data-testid="evaluation-form">Evaluation Form</div>
  ),
}));

vi.mock('@/components/evaluation/evaluation-results', () => ({
  EvaluationResults: ({ result, listing }: { result: unknown; listing: unknown }) => (
    <div data-testid="evaluation-results">Evaluation Results</div>
  ),
}));

vi.mock('@/components/ui/loading-spinner', () => ({
  LoadingSpinner: ({ message }: { message: string }) => (
    <div data-testid="loading-spinner">{message}</div>
  ),
}));

describe('EvaluatePage', () => {
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

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEvaluation).mockReturnValue(createMockEvaluation());
  });

  it('should render page title and description', () => {
    render(<EvaluatePage />);

    expect(screen.getByText('Evaluate Marketplace Listing')).toBeInTheDocument();
    expect(screen.getByText(/Get AI-powered evaluation of Amazon and eBay listings/)).toBeInTheDocument();
  });

  it('should render evaluation form', () => {
    render(<EvaluatePage />);

    expect(screen.getByTestId('evaluation-form')).toBeInTheDocument();
  });

  it('should render loading spinner when isLoading is true', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: true,
      })
    );

    render(<EvaluatePage />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Analyzing listing and generating evaluation...')).toBeInTheDocument();
  });

  it('should not render results when loading', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: true,
        result: { estimatedMarketValue: 100 } as never,
        listing: { title: 'Test' } as never,
      })
    );

    render(<EvaluatePage />);

    expect(screen.queryByTestId('evaluation-results')).not.toBeInTheDocument();
  });

  it('should render results when not loading and result exists', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: false,
        result: {
          estimatedMarketValue: 100,
          undervaluationPercentage: 10,
          confidenceScore: 85,
          reasoning: 'Test',
          keyFactors: [],
          isReplicaOrNovelty: false,
        },
        listing: {
          id: '1',
          marketplace: 'amazon',
          marketplaceId: 'B123',
          title: 'Test Item',
          price: 90,
          currency: 'USD',
          images: [],
          listingUrl: 'https://amazon.com/dp/B123',
          available: true,
        },
      })
    );

    render(<EvaluatePage />);

    expect(screen.getByTestId('evaluation-results')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('should not render results when result is null', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: false,
        result: null,
        listing: null,
      })
    );

    render(<EvaluatePage />);

    expect(screen.queryByTestId('evaluation-results')).not.toBeInTheDocument();
  });

  it('should not render results when listing is null', () => {
    vi.mocked(useEvaluation).mockReturnValue(
      createMockEvaluation({
        isLoading: false,
        result: {
          estimatedMarketValue: 100,
          undervaluationPercentage: 10,
          confidenceScore: 85,
          reasoning: 'Test',
          keyFactors: [],
          isReplicaOrNovelty: false,
        },
        listing: null,
      })
    );

    render(<EvaluatePage />);

    expect(screen.queryByTestId('evaluation-results')).not.toBeInTheDocument();
  });
});

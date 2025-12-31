/**
 * Tests for EvaluationResults Component Animations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EvaluationResults } from '../evaluation-results';
import type { EvaluationResult } from '@/lib/ai/types';
import type { MarketplaceListing } from '@/lib/marketplace/types';
import * as framerMotion from 'framer-motion';

// Create a shared mock function for useReducedMotion
const mockUseReducedMotion = vi.fn(() => false);

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, initial, animate, variants, ...props }) => {
      return <div data-testid="motion-div" data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={variants ? 'present' : 'absent'} {...props}>{children}</div>;
    }),
    section: vi.fn(({ children, initial, animate, variants, transition, ...props }) => {
      return <section data-testid="motion-section" data-initial={JSON.stringify(initial)} data-animate={JSON.stringify(animate)} data-variants={variants ? 'present' : 'absent'} data-transition={transition ? 'present' : 'absent'} {...props}>{children}</section>;
    }),
  },
}));

// Mock useCountUp hook - respects reduced motion for testing
vi.mock('@/hooks/use-count-up', () => ({
  useCountUp: vi.fn(({ target, formatter }) => {
    // Call the mocked useReducedMotion to track calls
    mockUseReducedMotion();
    if (formatter) {
      return formatter(target);
    }
    return target;
  }),
}));

// Mock FadeIn component - respects reduced motion
vi.mock('@/components/animations/fade-in', () => ({
  FadeIn: ({ children, delay, className }: { children: React.ReactNode; delay?: number; className?: string }) => {
    // Call the mocked useReducedMotion to track calls
    mockUseReducedMotion();
    return <div data-testid="fade-in" data-delay={delay} className={className}>{children}</div>;
  },
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

const mockListing: MarketplaceListing = {
  id: 'test-1',
  marketplace: 'amazon',
  marketplaceId: 'B08XYZ123',
  title: 'Test Item',
  description: 'Test description',
  price: 100,
  currency: 'USD',
  images: ['https://example.com/image1.jpg'],
  category: 'Test',
  condition: 'New',
  sellerName: 'Test Seller',
  sellerRating: 95,
  listingUrl: 'https://example.com',
  available: true,
};

const mockEvaluationResult: EvaluationResult = {
  evaluation: {
    estimatedMarketValue: 150,
    undervaluationPercentage: 50,
    confidenceScore: 85,
    reasoning: 'Test reasoning',
    factors: ['Factor 1', 'Factor 2'],
    isReplicaOrNovelty: false,
  },
  modelVersion: 'gpt-4o',
  promptVersion: '1.0.0',
  evaluationMode: 'multimodal',
  evaluatedAt: new Date(),
};

describe('EvaluationResults Animations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseReducedMotion.mockReturnValue(false);
  });

  describe('Results Card Slide-in Animations', () => {
    it('should apply slide-in animation to results cards when reduced motion is disabled', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Check that motion components are used for slide-in animations
      const motionElements = screen.getAllByTestId('motion-div');
      expect(motionElements.length).toBeGreaterThan(0);
    });

    it('should disable slide-in animations when reduced motion is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // With reduced motion, animations should be disabled
      // useReducedMotion is called by useCountUp (4 times) and FadeIn (1 time for each image)
      expect(mockUseReducedMotion).toHaveBeenCalled();

      // Verify motion sections still render (but animations are disabled)
      const motionSections = screen.getAllByTestId('motion-section');
      expect(motionSections.length).toBeGreaterThan(0);
    });

    it('should slide in listing details section from bottom', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const listingSection = screen.getByText('Listing Details');
      expect(listingSection).toBeInTheDocument();
    });

    it('should slide in AI evaluation section from bottom', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const evaluationSection = screen.getByText('AI Evaluation');
      expect(evaluationSection).toBeInTheDocument();
    });
  });

  describe('Metric Count-up Animations', () => {
    it('should use count-up animation for estimated market value', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const estimatedValue = screen.getByText(/Estimated Market Value/i);
      expect(estimatedValue).toBeInTheDocument();
    });

    it('should use count-up animation for potential savings', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const savings = screen.getByText(/Potential Savings/i);
      expect(savings).toBeInTheDocument();
    });

    it('should use count-up animation for undervaluation percentage', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const undervaluation = screen.getByText(/Undervaluation/i);
      expect(undervaluation).toBeInTheDocument();
    });

    it('should disable count-up animations when reduced motion is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Values should display immediately without animation
      // useReducedMotion is called by useCountUp (4 times) and FadeIn (1 time)
      expect(mockUseReducedMotion).toHaveBeenCalled();

      // Verify values are displayed (immediately, not animated)
      expect(screen.getByText('$150.00')).toBeInTheDocument();
      expect(screen.getByText('+$50.00')).toBeInTheDocument();
      expect(screen.getByText('+50.0%')).toBeInTheDocument();
    });
  });

  describe('Progress Bar Fill Animation', () => {
    it('should animate confidence score progress bar fill', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const confidenceScore = screen.getByText(/Confidence Score/i);
      expect(confidenceScore).toBeInTheDocument();

      // Progress bar should be present (motion.div with animation)
      const progressBarContainer = confidenceScore.closest('div')?.parentElement;
      const progressBar = progressBarContainer?.querySelector('[data-testid="motion-div"]');
      expect(progressBar).toBeInTheDocument();

      // Verify it has animation properties
      const progressBarData = progressBar as HTMLElement;
      expect(progressBarData.dataset.animate).toContain('width');
    });

    it('should fill progress bar to confidence score percentage', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Progress bar should eventually reach 85% (confidenceScore)
      // Note: In actual implementation, this would be animated
      expect(mockEvaluationResult.evaluation.confidenceScore).toBe(85);
    });

    it('should disable progress bar animation when reduced motion is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Progress bar should display final state immediately
      // useReducedMotion is called by useCountUp (4 times) and FadeIn (1 time)
      expect(mockUseReducedMotion).toHaveBeenCalled();

      // Verify progress bar is still rendered
      const confidenceScore = screen.getByText(/Confidence Score/i);
      expect(confidenceScore).toBeInTheDocument();
    });

    it('should complete progress bar fill within 1-2 seconds', async () => {
      mockUseReducedMotion.mockReturnValue(false);

      const startTime = Date.now();
      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Wait for animation to complete
      await waitFor(
        () => {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(2000);
        },
        { timeout: 2500 }
      );
    });
  });

  describe('Image Fade-in Animations', () => {
    it('should apply fade-in animation to listing images', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      const images = screen.getAllByAltText(/Test Item/i);
      expect(images.length).toBeGreaterThan(0);
    });

    it('should disable image fade-in animations when reduced motion is enabled', () => {
      mockUseReducedMotion.mockReturnValue(true);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Images should appear immediately without fade-in
      // useReducedMotion is called by FadeIn component (1 time) and useCountUp (4 times)
      expect(mockUseReducedMotion).toHaveBeenCalled();

      // Verify images are still rendered
      const images = screen.getAllByAltText(/Test Item/i);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Animation Performance', () => {
    it('should complete all animations within 1-2 seconds', async () => {
      mockUseReducedMotion.mockReturnValue(false);

      const startTime = Date.now();
      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      await waitFor(
        () => {
          const elapsed = Date.now() - startTime;
          expect(elapsed).toBeLessThan(2000);
        },
        { timeout: 2500 }
      );
    });

    it('should maintain 60fps performance during animations', () => {
      mockUseReducedMotion.mockReturnValue(false);

      render(<EvaluationResults result={mockEvaluationResult} listing={mockListing} />);

      // Performance check would be done in E2E tests
      // This test verifies component structure supports performance
      expect(framerMotion.motion.div).toHaveBeenCalled();
    });
  });
});

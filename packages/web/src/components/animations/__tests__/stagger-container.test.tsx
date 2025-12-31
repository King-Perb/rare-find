/**
 * Tests for StaggerContainer Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StaggerContainer } from '../stagger-container';
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

describe('StaggerContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should use motion.div when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should use regular div when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    const container = screen.getByText('Child 1').parentElement;
    expect(container?.tagName).toBe('DIV');
    expect(container).not.toHaveAttribute('data-testid', 'motion-div');
  });

  it('should use regular div when disabled prop is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer disabled>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    const container = screen.getByText('Child 1').parentElement;
    expect(container?.tagName).toBe('DIV');
    expect(container).not.toHaveAttribute('data-testid', 'motion-div');
  });

  it('should apply custom className', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer className="custom-class">
        <div>Child 1</div>
      </StaggerContainer>
    );

    // The className should be on the motion.div container (the outer one)
    const motionDivs = screen.getAllByTestId('motion-div');
    const containerDiv = motionDivs[0]; // First one is the container
    expect(containerDiv).toHaveClass('custom-class');
  });

  it('should wrap array children in motion.div', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </StaggerContainer>
    );

    // Should have multiple motion.div calls (one for container, one for each child)
    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should wrap single child in motion.div', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer>
        <div>Single Child</div>
      </StaggerContainer>
    );

    expect(framerMotion.motion.div).toHaveBeenCalled();
  });

  it('should pass stagger delay to container variants', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer staggerDelay={0.2}>
        <div>Child 1</div>
        <div>Child 2</div>
      </StaggerContainer>
    );

    const calls = vi.mocked(framerMotion.motion.div).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    // The first call should be the container with stagger configuration
    const containerCall = calls[0]?.[0];
    expect(containerCall).toHaveProperty('variants');
  });

  it('should pass initial delay to container variants', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(
      <StaggerContainer delay={0.5}>
        <div>Child 1</div>
      </StaggerContainer>
    );

    const calls = vi.mocked(framerMotion.motion.div).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const containerCall = calls[0]?.[0];
    expect(containerCall).toHaveProperty('variants');
  });
});

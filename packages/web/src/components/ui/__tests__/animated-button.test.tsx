/**
 * Tests for AnimatedButton Component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnimatedButton } from '../animated-button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Mock the reduced motion hook
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: vi.fn(({ children, whileHover, whileTap, ...props }) => {
      return (
        <button
          data-testid="motion-button"
          data-while-hover={whileHover ? 'present' : 'absent'}
          data-while-tap={whileTap ? 'present' : 'absent'}
          {...props}
        >
          {children}
        </button>
      );
    }),
  },
}));

describe('AnimatedButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(<AnimatedButton>Click me</AnimatedButton>);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply hover animation when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<AnimatedButton>Click me</AnimatedButton>);

    const button = screen.getByTestId('motion-button');
    expect(button).toHaveAttribute('data-while-hover', 'present');
  });

  it('should apply click animation when reduced motion is disabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<AnimatedButton>Click me</AnimatedButton>);

    const button = screen.getByTestId('motion-button');
    expect(button).toHaveAttribute('data-while-tap', 'present');
  });

  it('should disable animations when reduced motion is enabled', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(<AnimatedButton>Click me</AnimatedButton>);

    const button = screen.getByTestId('motion-button');
    expect(button).toHaveAttribute('data-while-hover', 'absent');
    expect(button).toHaveAttribute('data-while-tap', 'absent');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<AnimatedButton onClick={handleClick}>Click me</AnimatedButton>);

    const button = screen.getByText('Click me');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    render(<AnimatedButton className="custom-class">Click me</AnimatedButton>);

    const button = screen.getByTestId('motion-button');
    expect(button).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<AnimatedButton disabled>Click me</AnimatedButton>);

    const button = screen.getByTestId('motion-button');
    expect(button).toBeDisabled();
  });

  it('should show loading state', () => {
    render(<AnimatedButton isLoading>Click me</AnimatedButton>);

    // Loading state should show loading text, not children
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    // Loading state should be disabled
    const button = screen.getByTestId('motion-button');
    expect(button).toBeDisabled();
  });
});

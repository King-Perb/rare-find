/**
 * Tests for useCountUp Hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCountUp } from '@/hooks/use-count-up';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// Mock useReducedMotion
vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useCountUp', () => {
  it('should start from 0', () => {
    const { result } = renderHook(() => useCountUp({ target: 100, duration: 1000 }));

    expect(result.current).toBe(0);
  });

  it('should start from custom start value', () => {
    const { result } = renderHook(() => useCountUp({ target: 100, start: 50, duration: 1000 }));

    expect(result.current).toBe(50);
  });

  it('should handle zero target value', () => {
    const { result } = renderHook(() => useCountUp({ target: 0, duration: 1000 }));

    expect(result.current).toBe(0);
  });

  it('should handle negative target value', () => {
    const { result } = renderHook(() => useCountUp({ target: -100, duration: 1000 }));

    expect(result.current).toBe(0);
  });

  it('should format numbers with custom formatter', () => {
    const formatter = (value: number) => `$${value.toFixed(2)}`;
    const { result } = renderHook(() =>
      useCountUp({ target: 100, duration: 1000, formatter })
    );

    // Initially should be formatted start value (0)
    expect(result.current).toBe('$0.00');
  });

  it('should respect reduced motion preferences', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const { result } = renderHook(() => useCountUp({ target: 100, duration: 1000 }));

    // With reduced motion, should jump to target immediately
    expect(result.current).toBe(100);
  });

  it('should accept duration parameter', () => {
    const { result } = renderHook(() => useCountUp({ target: 100, duration: 500 }));

    // Hook should initialize (starts at 0, then animates)
    expect(result.current).toBeDefined();
    expect(typeof result.current === 'number' || typeof result.current === 'string').toBe(true);
  });

  it('should accept custom easing function', () => {
    const customEasing = (t: number) => t * t; // Quadratic easing
    const { result } = renderHook(() =>
      useCountUp({ target: 100, duration: 1000, easing: customEasing })
    );

    // Hook should initialize with custom easing
    expect(result.current).toBeDefined();
    expect(typeof result.current === 'number' || typeof result.current === 'string').toBe(true);
  });

  it('should handle target changes', () => {
    const { result, rerender } = renderHook(
      ({ target }) => useCountUp({ target, duration: 1000 }),
      { initialProps: { target: 100 } }
    );

    // Hook should initialize
    expect(result.current).toBeDefined();

    rerender({ target: 200 });
    // Value should update when target changes
    expect(result.current).toBeDefined();
  });

  it('should return number when no formatter provided', () => {
    const { result } = renderHook(() => useCountUp({ target: 100, duration: 1000 }));

    expect(typeof result.current).toBe('number');
  });
});

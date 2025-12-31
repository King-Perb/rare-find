/**
 * Tests for useReducedMotion Hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import * as framerMotion from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  useReducedMotion: vi.fn(),
}));

describe('useReducedMotion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return true when user prefers reduced motion', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(true);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('should return false when user does not prefer reduced motion', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(false);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('should return false when useReducedMotion returns null', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(null);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('should return false when useReducedMotion returns undefined', () => {
    vi.mocked(framerMotion.useReducedMotion).mockReturnValue(undefined as unknown as boolean);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });
});

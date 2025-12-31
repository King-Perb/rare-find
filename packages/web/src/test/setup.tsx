// Vitest setup file for React Testing Library
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver for tests
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
} as unknown as typeof IntersectionObserver;

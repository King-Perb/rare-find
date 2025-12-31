/**
 * Tests for Supabase Client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @supabase/supabase-js
const mockCreateClient = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

describe('supabase client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create client with correct URL and key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key';

    vi.resetModules();
    await import('../client');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-publishable-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key';

    vi.resetModules();

    await expect(import('../client')).rejects.toThrow('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    vi.resetModules();

    await expect(import('../client')).rejects.toThrow('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variable');
  });
});

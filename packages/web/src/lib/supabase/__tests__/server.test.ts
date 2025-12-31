/**
 * Tests for Supabase Server Client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock @supabase/supabase-js
const mockCreateClient = vi.fn();
vi.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

describe('supabase server client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should create admin client with correct URL and secret key', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    vi.resetModules();
    await import('../server');

    expect(mockCreateClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-secret-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  });

  it('should throw error when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_SECRET_KEY = 'test-key';

    vi.resetModules();

    await expect(import('../server')).rejects.toThrow('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  });

  it('should throw error when SUPABASE_SECRET_KEY is missing', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    delete process.env.SUPABASE_SECRET_KEY;

    vi.resetModules();

    await expect(import('../server')).rejects.toThrow('Missing SUPABASE_SECRET_KEY environment variable');
  });
});

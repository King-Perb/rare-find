/**
 * Tests for API Middleware
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, requireAuth, parseJsonBody, getQueryParams } from '../middleware';
import { AppError, logError } from '@/lib/errors';
import { logApiRequest, logApiResponse } from '@/lib/logger';
import { getCurrentUser } from '@/lib/supabase/auth';
import type { User } from '@supabase/supabase-js';

// Helper function to delay execution (extracted to module level to reduce nesting)
const delay = (ms: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};

// Helper function to create delayed handler (extracted to module level to reduce nesting)
const createDelayedHandler = (ms: number) => {
  return async () => {
    await delay(ms);
    return NextResponse.json({ success: true });
  };
};

// Mock dependencies
vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
  logApiResponse: vi.fn(),
}));

vi.mock('@/lib/errors', async () => {
  const actual = await vi.importActual<typeof import('@/lib/errors')>('@/lib/errors');
  return {
    ...actual,
    logError: vi.fn(),
  };
});

vi.mock('@/lib/supabase/auth', () => ({
  getCurrentUser: vi.fn(),
}));

describe('API Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('withApiHandler', () => {
    it('should execute handler successfully', async () => {
      const handler = vi.fn(async () => {
        return NextResponse.json({ success: true });
      });

      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      const response = await wrapped(req);

      expect(handler).toHaveBeenCalled();
      expect(logApiRequest).toHaveBeenCalledWith('POST', '/api/test');
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toEqual({ success: true });
    });

    it('should log request and response', async () => {
      const handler = vi.fn(async () => NextResponse.json({ success: true }));
      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'GET',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      await wrapped(req);

      expect(logApiRequest).toHaveBeenCalledWith('GET', '/api/test');
      expect(logApiResponse).toHaveBeenCalled();
    });

    it('should include user context when authenticated', async () => {
      const handler = vi.fn(async (req: NextRequest, context: { userId?: string; user?: { id: string; email: string } }) => {
        expect(context.userId).toBe('user-123');
        expect(context.user).toEqual({ id: 'user-123', email: 'test@example.com' });
        return NextResponse.json({ success: true });
      });

      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        id: 'user-123',
        email: 'test@example.com',
      } as User);

      await wrapped(req);

      expect(handler).toHaveBeenCalled();
    });

    it('should handle unauthenticated requests gracefully', async () => {
      const handler = vi.fn(async () => NextResponse.json({ success: true }));
      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      const response = await wrapped(req);

      expect(response.status).toBe(200);
      expect(handler).toHaveBeenCalledWith(req, { userId: undefined, user: undefined });
    });

    it('should handle AppError with correct status code', async () => {
      const handler = vi.fn(async () => {
        throw new AppError('Validation error', 400, 'VALIDATION_ERROR');
      });

      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      const response = await wrapped(req);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBeDefined();
      expect(logError).toHaveBeenCalled();
      expect(logApiResponse).toHaveBeenCalledWith('POST', '/api/test', 400, expect.any(Number), undefined);
    });

    // Helper function to create error handler (extracted to reduce nesting)
    const createErrorHandler = () => {
      return async () => {
        throw new Error('Internal error');
      };
    };

    it('should handle generic errors with 500 status', async () => {
      const handler = vi.fn(createErrorHandler());

      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      const response = await wrapped(req);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.error).toBeDefined();
      expect(logError).toHaveBeenCalled();
    });

    it('should log response duration', async () => {
      const handler = vi.fn(createDelayedHandler(10));
      const wrapped = withApiHandler(handler);
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      });

      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Not authenticated'));

      await wrapped(req);

      expect(logApiResponse).toHaveBeenCalledWith(
        'POST',
        '/api/test',
        200,
        expect.any(Number),
        undefined
      );
      const callArgs = vi.mocked(logApiResponse).mock.calls[0];
      const duration = callArgs[3];
      expect(duration).toBeGreaterThanOrEqual(10);
    });
  });

  describe('requireAuth', () => {
    it('should return user context when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      } as User;

      vi.mocked(getCurrentUser).mockResolvedValueOnce(mockUser);

      const context = await requireAuth();

      expect(context.userId).toBe('user-123');
      expect(context.user).toEqual({ id: 'user-123', email: 'test@example.com' });
    });

    it('should throw AppError when user is null', async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      const promise = requireAuth();
      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toThrow('Authentication required');
    });

    it('should throw AppError when getCurrentUser throws', async () => {
      vi.mocked(getCurrentUser).mockRejectedValueOnce(new Error('Auth error'));

      const promise = requireAuth();
      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toThrow('Authentication required');
    });

    it('should preserve AppError when getCurrentUser throws AppError', async () => {
      const appError = new AppError('Custom auth error', 401, 'CUSTOM_AUTH_ERROR');
      vi.mocked(getCurrentUser).mockRejectedValueOnce(appError);

      // requireAuth should preserve the AppError
      await expect(requireAuth()).rejects.toThrow(appError);
    });
  });

  describe('parseJsonBody', () => {
    it('should parse valid JSON body', async () => {
      const body = { test: 'value' };
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });

      const parsed = await parseJsonBody(req);

      expect(parsed).toEqual(body);
    });

    it('should throw AppError for invalid JSON', async () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const promise = parseJsonBody(req);
      await expect(promise).rejects.toThrow(AppError);
      await expect(promise).rejects.toThrow('Invalid JSON body');
    });
  });

  describe('getQueryParams', () => {
    it('should return query parameters', () => {
      const req = new NextRequest('http://localhost:3000/api/test?key=value&other=test');

      const params = getQueryParams(req);

      expect(params.get('key')).toBe('value');
      expect(params.get('other')).toBe('test');
    });

    it('should return empty params when no query string', () => {
      const req = new NextRequest('http://localhost:3000/api/test');

      const params = getQueryParams(req);

      expect(params.toString()).toBe('');
    });
  });
});

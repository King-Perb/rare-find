/**
 * Tests for Supabase Auth
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthError } from '@supabase/supabase-js';
import { getCurrentUser, signOut, getSession } from '../auth';
import { supabase } from '../client';

const mockGetUser = vi.mocked(supabase.auth.getUser);
const mockSignOut = vi.mocked(supabase.auth.signOut);
const mockGetSession = vi.mocked(supabase.auth.getSession);

// Mock supabase client
vi.mock('../client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
    },
  },
}));

describe('supabase auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as const;

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(mockGetUser).toHaveBeenCalled();
    });

    it('should throw error when getUser fails', async () => {
      const mockError = {
        message: 'Auth error',
        name: 'AuthError',
        status: 400,
        code: 'auth_error',
        __isAuthError: true,
      } as unknown as AuthError;

      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      await expect(getCurrentUser()).rejects.toEqual(mockError);
    });

    it('should throw error when user is null', async () => {
      const mockError = {
        message: 'User not found',
        name: 'AuthError',
        status: 404,
        code: 'user_not_found',
        __isAuthError: true,
      } as unknown as AuthError;

      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      await expect(getCurrentUser()).rejects.toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      mockSignOut.mockResolvedValueOnce({
        error: null,
      });

      await signOut();

      expect(mockSignOut).toHaveBeenCalled();
    });

    it('should throw error when signOut fails', async () => {
      const mockError = {
        message: 'Sign out error',
        name: 'AuthError',
        status: 400,
        code: 'sign_out_error',
        __isAuthError: true,
      } as unknown as AuthError;

      mockSignOut.mockResolvedValueOnce({
        error: mockError,
      });

      await expect(signOut()).rejects.toEqual(mockError);
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = {
        access_token: 'token',
        refresh_token: 'refresh_token',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        },
      } as const;

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await getSession();

      expect(session).toEqual(mockSession);
      expect(mockGetSession).toHaveBeenCalled();
    });

    it('should throw error when getSession fails', async () => {
      const mockError = {
        message: 'Session error',
        name: 'AuthError',
        status: 400,
        code: 'session_error',
        __isAuthError: true,
      } as unknown as AuthError;

      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: mockError,
      });

      await expect(getSession()).rejects.toEqual(mockError);
    });
  });
});

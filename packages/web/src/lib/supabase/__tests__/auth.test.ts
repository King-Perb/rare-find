/**
 * Tests for Supabase Auth
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(mockGetUser).toHaveBeenCalled();
    });

    it('should throw error when getUser fails', async () => {
      const mockError = new Error('Auth error');
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: mockError,
      });

      await expect(getCurrentUser()).rejects.toThrow('Auth error');
    });

    it('should throw error when user is null', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'User not found' },
      });

      await expect(getCurrentUser()).rejects.toEqual(
        expect.objectContaining({ message: 'User not found' })
      );
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
      const mockError = new Error('Sign out error');
      mockSignOut.mockResolvedValueOnce({
        error: mockError,
      });

      await expect(signOut()).rejects.toThrow('Sign out error');
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = {
        access_token: 'token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockGetSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await getSession();

      expect(session).toEqual(mockSession);
      expect(mockGetSession).toHaveBeenCalled();
    });

    it('should throw error when getSession fails', async () => {
      const mockError = new Error('Session error');
      mockGetSession.mockResolvedValueOnce({
        data: { session: null },
        error: mockError,
      });

      await expect(getSession()).rejects.toThrow('Session error');
    });
  });
});

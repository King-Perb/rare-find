/**
 * AuthService Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { User, Session } from '@supabase/supabase-js';
import { AuthService } from '../auth.service';

// Mock Supabase auth functions
vi.mock('../../supabase/auth', () => ({
  getCurrentUser: vi.fn(),
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

import { getCurrentUser as getCurrentUserImpl, getSession as getSessionImpl, signOut as signOutImpl } from '../../supabase/auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService();
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      } as unknown as User;
      vi.mocked(getCurrentUserImpl).mockResolvedValue(mockUser);

      const result = await service.getCurrentUser();

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
      });
      expect(getCurrentUserImpl).toHaveBeenCalled();
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(getCurrentUserImpl).mockResolvedValue(null);

      const result = await service.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null when auth throws error', async () => {
      vi.mocked(getCurrentUserImpl).mockRejectedValue(new Error('Auth error'));

      const result = await service.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle user without email', async () => {
      const mockUser = {
        id: 'user-123',
        email: null,
      } as unknown as User;
      vi.mocked(getCurrentUserImpl).mockResolvedValue(mockUser);

      const result = await service.getCurrentUser();

      expect(result).toEqual({
        id: 'user-123',
        email: null,
      });
    });
  });

  describe('getSession', () => {
    it('should return session when available', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-123' } as unknown as User,
      } as unknown as Session;
      vi.mocked(getSessionImpl).mockResolvedValue(mockSession);

      const result = await service.getSession();

      expect(result).toEqual(mockSession);
      expect(getSessionImpl).toHaveBeenCalled();
    });

    it('should return null when no session', async () => {
      vi.mocked(getSessionImpl).mockResolvedValue(null);

      const result = await service.getSession();

      expect(result).toBeNull();
    });

    it('should return null when session throws error', async () => {
      vi.mocked(getSessionImpl).mockRejectedValue(new Error('Session error'));

      const result = await service.getSession();

      expect(result).toBeNull();
    });
  });

  describe('signOut', () => {
    it('should call signOut successfully', async () => {
      vi.mocked(signOutImpl).mockResolvedValue(undefined);

      await service.signOut();

      expect(signOutImpl).toHaveBeenCalled();
    });

    it('should propagate signOut errors', async () => {
      const error = new Error('Sign out failed');
      vi.mocked(signOutImpl).mockRejectedValue(error);

      await expect(service.signOut()).rejects.toThrow('Sign out failed');
    });
  });
});

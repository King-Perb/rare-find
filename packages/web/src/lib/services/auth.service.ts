/**
 * Auth Service
 *
 * Handles authentication operations
 */

import type { IAuthService } from './interfaces';
import { getCurrentUser as getCurrentUserImpl, getSession as getSessionImpl, signOut as signOutImpl } from '../supabase/auth';

export class AuthService implements IAuthService {
  async getCurrentUser(): Promise<{ id: string; email?: string } | null> {
    try {
      const user = await getCurrentUserImpl();
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        email: user.email,
      };
    } catch {
      return null;
    }
  }

  async getSession(): Promise<unknown> {
    try {
      return await getSessionImpl();
    } catch {
      return null;
    }
  }

  async signOut(): Promise<void> {
    await signOutImpl();
  }
}

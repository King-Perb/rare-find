/**
 * API route middleware
 * 
 * Shared middleware for API routes including error handling,
 * authentication, and request logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { logApiRequest, logApiResponse } from '@/lib/logger';
import { formatErrorResponse, logError, AppError } from '@/lib/errors';
import { getCurrentUser } from '@/lib/supabase/auth';

export interface ApiContext {
  userId?: string;
  user?: { id: string; email: string };
}

/**
 * API route handler wrapper with error handling and logging
 */
export function withApiHandler<T = unknown>(
  handler: (req: NextRequest, context: ApiContext) => Promise<NextResponse<T>>
) {
  return async (req: NextRequest) => {
    const startTime = Date.now();
    const method = req.method;
    const path = req.nextUrl.pathname;
    let userId: string | undefined;

    try {
      // Log request
      logApiRequest(method, path);

      // Get authenticated user (optional - some routes may be public)
      let user;
      try {
        user = await getCurrentUser();
        userId = user?.id;
      } catch {
        // User not authenticated - this is OK for public routes
        // Individual route handlers can check authentication if needed
      }

      const context: ApiContext = {
        userId,
        user: user ? { id: user.id, email: user.email || '' } : undefined,
      };

      // Execute handler
      const response = await handler(req, context);

      // Log response
      const duration = Date.now() - startTime;
      logApiResponse(method, path, response.status, duration, userId);

      return response;
    } catch (error) {
      // Log error
      const duration = Date.now() - startTime;
      logError(error, {
        method,
        path,
        duration: `${duration}ms`,
        userId,
      });

      // Format error response
      const errorResponse = formatErrorResponse(error);
      const statusCode = error instanceof AppError ? error.statusCode : 500;

      // Log error response
      logApiResponse(method, path, statusCode, duration, userId);

      return NextResponse.json(errorResponse, { status: statusCode });
    }
  };
}

/**
 * Require authentication middleware
 * Returns user context or throws UnauthorizedError
 */
export async function requireAuth(): Promise<ApiContext> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    return {
      userId: user.id,
      user: { id: user.id, email: user.email || '' },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }
}

/**
 * Parse JSON body with error handling
 */
export async function parseJsonBody<T = unknown>(req: NextRequest): Promise<T> {
  try {
    const body = await req.json();
    return body as T;
  } catch {
    throw new AppError('Invalid JSON body', 400, 'INVALID_JSON');
  }
}

/**
 * Get query parameters
 */
export function getQueryParams(req: NextRequest): URLSearchParams {
  return req.nextUrl.searchParams;
}



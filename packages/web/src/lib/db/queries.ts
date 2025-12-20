/**
 * Database query helpers
 * 
 * This file contains reusable database query functions.
 * 
 * Note: For most operations, prefer using Supabase client (respects RLS).
 * Use Prisma queries only for admin operations or when RLS is not applicable.
 * 
 * NOTE: Prisma client must be generated first: npm run db:generate
 */

import { prisma } from './prisma';

// Example query functions - add as needed
// These use Prisma and bypass RLS, so use carefully

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      preferences: true,
      recommendations: {
        include: {
          listing: {
            include: {
              evaluation: true,
            },
          },
        },
      },
    },
  });
}

export async function getActivePreferences(userId: string) {
  return prisma.searchPreference.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getRecommendationsByStatus(
  userId: string,
  status: 'new' | 'viewed' | 'dismissed' | 'purchased'
) {
  return prisma.recommendation.findMany({
    where: {
      userId,
      status,
    },
    include: {
      listing: {
        include: {
          evaluation: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}


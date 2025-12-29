/**
 * Prisma client instance (Prisma 7)
 *
 * Use this for schema management and migrations.
 * For data access, prefer Supabase client (respects RLS).
 *
 * NOTE: Run `npm run db:generate` first to generate the Prisma client.
 * This file will have type errors until Prisma client is generated.
 */

import 'dotenv/config';

// Prisma 7: Client and adapter imports
import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Prisma 7 requires explicit database adapter
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

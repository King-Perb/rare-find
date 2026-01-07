/**
 * Test Prisma Database Connection
 *
 * This script tests the Prisma connection to Supabase.
 * Run with: npm run db:test-connection
 *
 * Prerequisites:
 * 1. DATABASE_URL must be set in packages/web/.env
 * 2. Prisma client must be generated: npm run db:generate
 */

import 'dotenv/config';
import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Error type for database/connection errors
interface DatabaseError extends Error {
  code?: string;
  message: string;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  console.error('   Add DATABASE_URL to packages/web/.env');
  process.exit(1);
}

console.log('🔌 Testing Prisma connection to Supabase...\n');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

let client;
try {
  // Test 1: Raw database connection
  console.log('1️⃣ Testing raw PostgreSQL connection...');
  client = await pool.connect();
  const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
  console.log('   ✅ Raw connection successful');
  console.log(`   📅 Database time: ${result.rows[0].current_time}`);
  console.log(`   🐘 PostgreSQL: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`);

  // Test 2: Check Supabase-specific features
  console.log('\n2️⃣ Testing Supabase connection...');
  const supabaseCheck = await client.query(`
    SELECT
      current_database() as database_name,
      current_user as database_user,
      version() as postgres_version
  `);
  console.log('   ✅ Supabase connection verified');
  console.log(`   📊 Database: ${supabaseCheck.rows[0].database_name}`);
  console.log(`   👤 User: ${supabaseCheck.rows[0].database_user}`);

  // Release connection before Prisma test
  client.release();
  client = null;

  // Test 3: Prisma connection (if tables exist)
  console.log('\n3️⃣ Testing Prisma client connection...');

  try {
    const userCount = await prisma.user.count();
    console.log(`   ✅ Prisma connection successful`);
    console.log(`   👥 Users in database: ${userCount}`);
  } catch (error) {
    const dbError = error as DatabaseError;
    if (dbError.message?.includes('does not exist') || dbError.code === '42P01') {
      console.log('   ⚠️  Prisma connection works, but tables don\'t exist yet');
      console.log('   💡 Run: npm run db:push to create tables');
    } else {
      throw error;
    }
  }

  console.log('\n✅ All connection tests passed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Run: npm run db:push (to create tables)');
  console.log('   2. Set up RLS policies in Supabase Dashboard');

} catch (error) {
  const dbError = error as DatabaseError;
  console.error('\n❌ Connection test failed:');
  console.error(`   Error: ${dbError.message || String(error)}`);
  console.error(`   Code: ${dbError.code || 'N/A'}`);

  if (dbError.message?.includes('password authentication failed')) {
    console.error('\n💡 Tip: Check your DATABASE_URL password');
    console.error('   Get password from: Supabase Dashboard → Settings → Database');
  } else if (dbError.message?.includes('getaddrinfo ENOTFOUND') || dbError.code === 'ENOTFOUND') {
    console.error('\n💡 Tip: Check your DATABASE_URL host/connection string');
    console.error('   Also check if Supabase project is active (not paused)');
  } else if (dbError.code === 'ECONNREFUSED') {
    console.error('\n💡 Tip: Database connection refused. Check if Supabase project is active');
  } else if (dbError.code === 'ETIMEDOUT' || dbError.code === 'ECONNRESET') {
    console.error('\n💡 Tip: Connection timed out. Check network/firewall settings');
  }

  process.exit(1);
} finally {
  if (client) client.release();
  await prisma.$disconnect();
  await pool.end();
}

/**
 * Generate Supabase Database types from the database schema
 *
 * This script generates TypeScript types from the Supabase database
 * and writes them to src/lib/db/types.ts
 *
 * Required environment variables (in .env.local or .env):
 *   SUPABASE_ACCESS_TOKEN - Supabase access token (get from Supabase Dashboard)
 *   SUPABASE_PROJECT_ID - Supabase project ID (defaults to xabpmvuubgfjuroenxuq if not set)
 *
 * Usage:
 *   npm run db:generate-types
 */

import { config } from 'dotenv';
import { execSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env file from the project root
const envPath = join(rootDir, '.env');
const envResult = config({ path: envPath });

// Debug: Check if .env file exists
if (existsSync(envPath)) {
  console.log(`📄 Loading .env file from: ${envPath}`);
  if (envResult.error) {
    console.warn(`⚠️  Warning: Error loading .env file: ${envResult.error.message}`);
  }
} else {
  console.warn(`⚠️  Warning: .env file not found at: ${envPath}`);
  console.warn('   Trying to load from environment variables...');
}

const outputFile = join(rootDir, 'src/lib/db/types.ts');

const projectId = process.env.SUPABASE_PROJECT_ID || 'xabpmvuubgfjuroenxuq';
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

// Debug: Show if token was loaded (without exposing the full token)
if (accessToken) {
  console.log(`✅ Access token loaded (starts with: ${accessToken.substring(0, 10)}...)`);
} else {
  console.log('❌ Access token not found in environment');
}

if (!accessToken) {
  console.error('❌ Error: SUPABASE_ACCESS_TOKEN environment variable is not set');
  console.error('');
  console.error(`Expected .env file location: ${envPath}`);
  console.error('');
  console.error('Please set it in .env file:');
  console.error('  SUPABASE_ACCESS_TOKEN=sbp_...');
  console.error('');
  console.error('Or get a new token from: https://app.supabase.com/account/tokens');
  process.exit(1);
}

// Validate token format
if (!accessToken.startsWith('sbp_')) {
  console.error('❌ Error: SUPABASE_ACCESS_TOKEN format is invalid');
  console.error('');
  console.error('Token must start with "sbp_"');
  console.error(`Current token starts with: "${accessToken.substring(0, 10)}..."`);
  console.error('');
  console.error('Get a valid token from: https://app.supabase.com/account/tokens');
  process.exit(1);
}

console.log(`🔧 Generating Supabase types for project: ${projectId}...`);

try {
  // Trim token in case there's whitespace in .env file
  // Remove quotes from start and end if present, and any newlines/carriage returns
  // Also remove any trailing non-hex characters (tokens should be sbp_ + hex only)
  let cleanToken = accessToken.trim().replaceAll(/(^["']+)|(["']+$)/g, '').replaceAll(/\r?\n/g, '').trim();

  // Remove any trailing non-hex characters after sbp_ prefix
  // Token format should be: sbp_[hex characters only]
  if (cleanToken.startsWith('sbp_')) {
    const prefix = 'sbp_';
    const hexPart = cleanToken.substring(prefix.length);
    // Keep only hex characters (0-9, a-f, A-F)
    const cleanHexPart = hexPart.replaceAll(/[^0-9a-fA-F]/g, '');
    cleanToken = prefix + cleanHexPart;
  }

  // Verify token is still valid after cleaning
  if (!cleanToken.startsWith('sbp_')) {
    console.error('❌ Error: Token became invalid after cleaning');
    console.error(`   Token starts with: "${cleanToken.substring(0, 10)}..."`);
    process.exit(1);
  }

  // Debug: Show token info (without exposing full token)
  console.log(`🔑 Using access token: ${cleanToken.substring(0, 10)}...${cleanToken.substring(cleanToken.length - 4)}`);
  console.log(`📏 Token length: ${cleanToken.length} characters`);
  console.log(`📦 Project ID: ${projectId}`);

  // Supabase tokens should be around 40+ characters (sbp_ + 36+ hex chars)
  if (cleanToken.length < 20) {
    console.error('❌ Error: Token appears to be too short');
    console.error(`   Expected length: 40+ characters, got: ${cleanToken.length}`);
    console.error(`   Token might be incomplete in .env file`);
    process.exit(1);
  }

  // Verify token format matches expected pattern (sbp_ followed by hex characters)
  const tokenPattern = /^sbp_[a-f0-9]+$/i;
  if (!tokenPattern.test(cleanToken)) {
    console.error('❌ Error: Token format is invalid');
    console.error(`   Token should match pattern: sbp_[hex characters]`);
    console.error(`   Token contains invalid characters or format`);
    console.error(`   First 20 chars: ${cleanToken.substring(0, 20)}`);
    console.error(`   Last 10 chars: ${cleanToken.substring(cleanToken.length - 10)}`);
    process.exit(1);
  }

  const command = `npx supabase gen types typescript --project-id ${projectId}`;
  const types = execSync(command, {
    encoding: 'utf-8',
    cwd: rootDir,
    stdio: 'pipe',
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: cleanToken
    }
  });

  writeFileSync(outputFile, types, 'utf-8');

  console.log(`✅ Types generated successfully: ${outputFile}`);
  console.log('');
  console.log('✨ Types are ready to use!');
  console.log('   Import: import type { Database } from "@/lib/db/types"');
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  process.exit(1);
}

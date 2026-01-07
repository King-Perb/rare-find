/**
 * Generate Supabase Database types from the database schema
 *
 * This script generates TypeScript types from the Supabase database
 * and writes them to src/types/database.ts
 *
 * Required environment variables (in .env.local or .env):
 *   SUPABASE_ACCESS_TOKEN - Supabase access token (get from Supabase Dashboard)
 *   SUPABASE_PROJECT_ID - Supabase project ID (defaults to xabpmvuubgfjuroenxuq if not set)
 *
 * Usage:
 *   npm run db:generate-types
 */

import { config } from 'dotenv';
import { spawnSync } from 'node:child_process';
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env file from the project root
const envPath = join(rootDir, '.env');
const envResult = config({ path: envPath });

// Also try loading from parent directory (monorepo root)
const monorepoEnvPath = join(rootDir, '..', '..', '.env');
if (existsSync(monorepoEnvPath)) {
  config({ path: monorepoEnvPath });
}

// Debug: Check if .env file exists
if (existsSync(envPath)) {
  console.log(`📄 Loading .env file from: ${envPath}`);
  if (envResult.error) {
    console.warn(`⚠️  Warning: Error loading .env file: ${envResult.error.message}`);
  }
} else if (existsSync(monorepoEnvPath)) {
  console.log(`📄 Loading .env file from: ${monorepoEnvPath}`);
} else {
  console.warn(`⚠️  Warning: .env file not found at: ${envPath} or ${monorepoEnvPath}`);
  console.warn('   Trying to load from environment variables...');
}

const outputFile = join(rootDir, 'src/types/database.ts');

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
  console.error(`Expected .env file locations:`);
  console.error(`  - ${envPath}`);
  console.error(`  - ${monorepoEnvPath}`);
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
  let cleanToken = accessToken.trim();

  // Remove quotes from start and end (safer than regex to avoid ReDoS)
  while ((cleanToken.startsWith('"') || cleanToken.startsWith("'")) && cleanToken.length > 0) {
    cleanToken = cleanToken.substring(1);
  }
  while ((cleanToken.endsWith('"') || cleanToken.endsWith("'")) && cleanToken.length > 0) {
    cleanToken = cleanToken.slice(0, -1);
  }

  // Remove newlines/carriage returns
  cleanToken = cleanToken.replaceAll(/\r?\n/g, '').trim();

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

  // Validate projectId to prevent command injection
  // Supabase project IDs are alphanumeric with hyphens and underscores
  const projectIdPattern = /^[a-zA-Z0-9_-]+$/;
  if (!projectIdPattern.test(projectId)) {
    console.error('❌ Error: Project ID format is invalid');
    console.error(`   Project ID should only contain alphanumeric characters, hyphens, and underscores`);
    console.error(`   Received: ${projectId}`);
    process.exit(1);
  }

  // Use spawn with proper argument passing to prevent command injection
  // Sanitize environment: only pass safe, necessary variables
  // PATH is restricted to system directories to prevent PATH injection
  const safeEnv = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) =>
        // Only include safe environment variables (exclude PATH and potentially dangerous vars)
        key !== 'PATH' &&
        !key.startsWith('npm_') && // Exclude npm-specific vars that might be manipulated
        key !== 'NODE_PATH' // Exclude NODE_PATH for security
      )
    ),
    // Use safe default PATH (system directories only) to prevent PATH injection
    // Never use process.env.PATH as it may contain user-writable directories
    PATH: process.platform === 'win32'
      ? String.raw`C:\Windows\System32;C:\Windows;C:\Windows\System32\WindowsPowerShell\v1.0`
      : '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
    SUPABASE_ACCESS_TOKEN: cleanToken
  };

  const result = spawnSync('npx', ['supabase', 'gen', 'types', 'typescript', '--project-id', projectId], {
    encoding: 'utf-8',
    cwd: rootDir,
    stdio: 'pipe',
    env: safeEnv
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status}: ${result.stderr}`);
  }

  const types = result.stdout;

  // Add header comment to generated file
  const header = `/**
 * Supabase Database Types
 *
 * ⚠️ This file is GENERATED - DO NOT EDIT MANUALLY
 *
 * To regenerate these types from your Supabase schema:
 *   npm run db:generate-types
 *
 * Required environment variables:
 *   SUPABASE_ACCESS_TOKEN - Get from https://app.supabase.com/account/tokens
 *   SUPABASE_PROJECT_ID - Your Supabase project ID (optional, defaults to xabpmvuubgfjuroenxuq)
 *
 * This file will be overwritten when you run the generation script.
 * Make any schema changes in Supabase, then regenerate this file.
 */

`;

  writeFileSync(outputFile, header + types, 'utf-8');

  console.log(`✅ Types generated successfully: ${outputFile}`);
  console.log('');
  console.log('✨ Types are ready to use!');
  console.log('   Import: import type { Database } from "@rare-find/shared/types/database"');
  console.log('   Or: import type { Database } from "@rare-find/shared"');
} catch (error) {
  console.error('❌ Failed to generate types:', error.message);
  process.exit(1);
}

#!/bin/bash
# Generate Supabase Database types from the database schema
#
# This script generates TypeScript types from the Supabase database
# and writes them to src/lib/db/types.ts
#
# Required environment variables:
#   SUPABASE_ACCESS_TOKEN - Supabase access token (get from Supabase Dashboard)
#   SUPABASE_PROJECT_ID - Supabase project ID (defaults to xabpmvuubgfjuroenxuq if not set)
#
# Usage:
#   npm run db:generate-types

set -e

PROJECT_ID="${SUPABASE_PROJECT_ID:-xabpmvuubgfjuroenxuq}"
OUTPUT_FILE="src/lib/db/types.ts"

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ Error: SUPABASE_ACCESS_TOKEN environment variable is not set"
  echo ""
  echo "Please set it:"
  echo "  export SUPABASE_ACCESS_TOKEN=your-token-here"
  echo ""
  echo "Or get a new token from: https://app.supabase.com/account/tokens"
  exit 1
fi

echo "🔧 Generating Supabase types for project: $PROJECT_ID..."

npx supabase gen types typescript --project-id "$PROJECT_ID" > "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Types generated successfully: $OUTPUT_FILE"
  echo ""
  echo "✨ Types are ready to use!"
  echo "   Import: import type { Database } from '@/lib/db/types'"
else
  echo "❌ Failed to generate types"
  exit 1
fi

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

$ErrorActionPreference = "Stop"

$projectId = if ($env:SUPABASE_PROJECT_ID) { $env:SUPABASE_PROJECT_ID } else { "xabpmvuubgfjuroenxuq" }
$outputFile = "src/lib/db/types.ts"

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Host "❌ Error: SUPABASE_ACCESS_TOKEN environment variable is not set" -ForegroundColor Red
  Write-Host ""
  Write-Host "Please set it:"
  Write-Host "  `$env:SUPABASE_ACCESS_TOKEN='your-token-here'"
  Write-Host ""
  Write-Host "Or get a new token from: https://app.supabase.com/account/tokens"
  exit 1
}

Write-Host "🔧 Generating Supabase types for project: $projectId..." -ForegroundColor Cyan

try {
  npx supabase gen types typescript --project-id $projectId | Out-File -FilePath $outputFile -Encoding utf8

  Write-Host "✅ Types generated successfully: $outputFile" -ForegroundColor Green
  Write-Host ""
  Write-Host "✨ Types are ready to use!" -ForegroundColor Green
  Write-Host "   Import: import type { Database } from '@/lib/db/types'"
} catch {
  Write-Host "❌ Failed to generate types: $_" -ForegroundColor Red
  exit 1
}

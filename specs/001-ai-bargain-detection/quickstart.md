# Quickstart Guide: AI-Powered Bargain Detection System

**Feature**: 001-ai-bargain-detection
**Date**: 2025-01-09

## Overview

This guide helps developers quickly understand and start working with the AI-Powered Bargain Detection System feature.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database and authentication)
- Vercel account (for deployment, optional)
- Amazon Product Advertising API credentials
- eBay Developer API credentials
- OpenAI API key

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create `.env.local` file:

```env
# Supabase (using new publishable/secret keys)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SECRET_KEY="sb_secret_..."

# Marketplace APIs
AMAZON_ACCESS_KEY="your-amazon-access-key"
AMAZON_SECRET_KEY="your-amazon-secret-key"
AMAZON_ASSOCIATE_TAG="your-associate-tag"
EBAY_APP_ID="your-ebay-app-id"
EBAY_DEV_ID="your-ebay-dev-id"
EBAY_CERT_ID="your-ebay-cert-id"
EBAY_AUTH_TOKEN="your-ebay-auth-token"

# AI
OPENAI_API_KEY="your-openai-api-key"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Install Supabase client
npm install @supabase/supabase-js

# (Optional) If using Prisma as additional layer
npx prisma generate
npx prisma migrate dev

# Setup Supabase:
# 1. Create project at https://supabase.com
# 2. Get project URL and anon key from Settings > API
# 3. Run SQL migrations in Supabase SQL Editor (from schema.sql)
# 4. Configure Row Level Security policies
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   └── (dashboard)/       # Dashboard pages
├── components/            # React components
├── lib/                   # Business logic
│   ├── ai/               # AI evaluation
│   ├── marketplace/      # Marketplace integrations
│   ├── recommendations/  # Recommendation logic
│   └── supabase/         # Supabase client and auth
└── types/                 # TypeScript types
```

## Key Concepts

### 1. Search Preferences

Users configure what items to search for:
- Categories (antique, collectible, vintage)
- Keywords
- Price ranges
- Marketplaces (Amazon, eBay)

**Example**:
```typescript
const preference = {
  name: "Vintage Watches",
  categories: ["antique", "collectible"],
  keywords: ["rolex", "omega"],
  minPrice: 500,
  maxPrice: 5000,
  marketplaces: ["amazon", "ebay"]
}
```

### 2. Listings

Items discovered from marketplaces:
- Contains title, description, price, images
- Stored in database for caching
- Updated periodically

### 3. AI Evaluation

AI analyzes listings to determine undervaluation:
- Estimates market value
- Calculates undervaluation percentage
- Provides confidence score and reasoning
- Identifies undervaluation factors

### 4. Recommendations

Buy recommendations generated for undervalued listings:
- Linked to user and listing
- Contains AI evaluation results
- Tracked by status (new, viewed, dismissed, purchased)

## Common Tasks

### Create a Search Preference

```typescript
// API call
const response = await fetch('/api/preferences', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Vintage Watches",
    categories: ["antique", "collectible"],
    keywords: ["rolex"],
    minPrice: 500,
    maxPrice: 5000,
    marketplaces: ["amazon", "ebay"]
  })
})
```

### Trigger Marketplace Search

```typescript
const response = await fetch('/api/marketplace/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    preferenceId: "uuid" // Optional
  })
})
```

### Get Recommendations

```typescript
const response = await fetch('/api/recommendations?status=new&limit=20')
const { recommendations } = await response.json()
```

### Mark Recommendation as Viewed

```typescript
await fetch(`/api/recommendations/${recommendationId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'viewed' })
})
```

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Type Checking

```bash
npm run type:check
```

## Development Workflow

1. **Create feature branch**: Already on `001-ai-bargain-detection`
2. **Make changes**: Follow constitution principles
3. **Write tests**: Test-first development required
4. **Run checks**: `npm run lint && npm run type:check && npm test`
5. **Commit**: Use conventional commits
6. **Create PR**: Merge to main via pull request

## API Rate Limits

- **Amazon**: 1 request/second (86400/day)
- **eBay**: ~5000 requests/day (varies by endpoint)
- **OpenAI**: Varies by plan (typically 500 requests/minute)

The system implements rate limiting and caching to stay within limits.

## Troubleshooting

### Database Connection Issues

- Verify Supabase credentials in `.env.local`
- Check Supabase project status at https://supabase.com
- Verify Row Level Security policies are configured
- Test connection with Supabase client

### Marketplace API Errors

- Verify API credentials in `.env.local`
- Check rate limit status
- Review API logs in server console

### AI Evaluation Failures

- Verify `OPENAI_API_KEY` is set
- Check OpenAI API status
- Review evaluation logs for error details

## Next Steps

1. Review [data-model.md](./data-model.md) for database schema
2. Review [api-spec.md](./contracts/api-spec.md) for API details
3. Review [research.md](./research.md) for technical decisions
4. Start implementing user stories from [spec.md](./spec.md)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Amazon Product Advertising API](https://webservices.amazon.com/paapi5/documentation/)
- [eBay Finding API](https://developer.ebay.com/develop/apis)
- [OpenAI API Documentation](https://platform.openai.com/docs)

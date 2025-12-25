# Research: AI-Powered Bargain Detection System

**Feature**: 001-ai-bargain-detection  
**Date**: 2025-01-09  
**Purpose**: Resolve technical unknowns and research best practices for marketplace integration and AI evaluation

## Database Solution

### Decision: Supabase (PostgreSQL)

**Rationale**: 
- PostgreSQL provides robust relational data model for users, preferences, recommendations, and listings
- Built-in authentication (email/password, OAuth, magic links) - no need for separate auth service
- Real-time subscriptions for live recommendation updates
- Row-level security (RLS) for secure client-side access
- React Native SDK available for future mobile app
- Platform-agnostic (works with Vercel, other hosts, or self-hosted)
- Generous free tier for MVP development
- Encryption at rest and secure connection strings
- Storage, edge functions, and additional services available as needed

**Alternatives Considered**:
- **Vercel Postgres**: Good for web-only, but no built-in auth, tied to Vercel, no React Native support
- **SQLite**: Simple but not suitable for production web apps, no concurrent access
- **MongoDB**: Document-based, but relational model better fits user/preference/recommendation relationships
- **PlanetScale**: MySQL-based, good option but PostgreSQL more standard, no built-in auth
- **Firebase**: NoSQL, but requires significant data modeling changes, vendor lock-in

**Implementation Notes**:
- Use Supabase client libraries (JavaScript/TypeScript) for direct database access
- Use Prisma ORM as alternative/additional layer for type-safe database access (optional)
- Schema will include: User, SearchPreference, Listing, AIEvaluation, Recommendation tables
- Migrations will be version-controlled
- Row-level security policies for user data isolation
- Supabase Auth for authentication (email/password, OAuth providers)
- Real-time subscriptions for recommendation notifications

## Amazon Product Advertising API

### Decision: Use Amazon Product Advertising API 5.0 (PA-API 5)

**Rationale**:
- Official API for accessing Amazon product data
- Supports product search, item lookup, and browse node queries
- Provides product details, images, prices, seller information
- Rate limit: 1 request per second per IP (86400 requests/day)
- Requires Associates account and API credentials

**Key Endpoints**:
- `SearchItems`: Search for products by keywords, category, etc.
- `GetItems`: Get detailed information about specific items
- `GetBrowseNodes`: Browse product categories

**Implementation Notes**:
- Use AWS SDK or custom HTTP client with signature v4 authentication
- Implement request throttling (1 req/sec)
- Cache search results to reduce API calls
- Handle API errors gracefully (rate limits, invalid requests)
- Store API credentials in environment variables (server-side only)

**Alternatives Considered**:
- **Web scraping**: Violates Amazon ToS, unreliable, legal issues
- **Third-party APIs**: Additional cost, dependency on external service
- **Amazon MWS**: Deprecated, replaced by PA-API 5

## eBay Finding API

### Decision: Use eBay Finding API (RESTful)

**Rationale**:
- Official eBay API for searching listings
- Supports keyword search, category filtering, price ranges
- Provides listing details, images, prices, seller ratings
- Rate limits vary by endpoint (typically 5000 calls/day for Finding API)
- Requires eBay Developer account and OAuth tokens

**Key Endpoints**:
- `findItemsAdvanced`: Advanced search with multiple filters
- `findItemsByKeywords`: Simple keyword search
- `findItemsByCategory`: Search within specific categories
- `getHistograms`: Get category/item count information

**Implementation Notes**:
- Use eBay SDK or custom HTTP client with OAuth 2.0
- Implement rate limiting per endpoint
- Cache search results appropriately
- Handle API errors and rate limit responses
- Store OAuth tokens securely (refresh as needed)

**Alternatives Considered**:
- **eBay Browse API**: Newer API but Finding API more established
- **Web scraping**: Violates eBay ToS, unreliable
- **Third-party aggregators**: Additional cost, less control

## AI Evaluation Strategy

### Decision: OpenAI GPT-4o (multimodal) with structured output for listing evaluation

**Rationale**:
- OpenAI API provides powerful multimodal model for analyzing listing descriptions, images, and metadata
- GPT-4o offers superior vision capabilities compared to GPT-4 Turbo, enabling detailed image analysis
- Can analyze product images to assess condition, authenticity, rarity, and damage indicators
- GPT-4o is faster and more cost-effective than GPT-4 Turbo while providing better vision performance
- Structured output (JSON mode) ensures consistent evaluation results
- Native multimodal support allows simultaneous processing of text descriptions and image URLs
- Cost-effective when batched and cached appropriately

**Evaluation Workflows**:

#### Workflow 1: User-Provided Listing Evaluation (Full Multimodal)
**Use Case**: User manually submits a listing URL for evaluation

**Approach**:
- **Full multimodal evaluation** using GPT-4o with image analysis
- Analyze all available listing images to assess:
  - Condition and authenticity
  - Damage, wear, or restoration indicators
  - Rarity markers visible in images
  - Quality and completeness
- Process title, description, price, category, seller info
- Higher accuracy due to comprehensive image analysis
- Slower and more expensive per evaluation

**When to Use**:
- User explicitly requests evaluation of a specific listing
- Manual listing submission via UI
- High-value items requiring detailed assessment
- User wants maximum confidence in evaluation

#### Workflow 2: Automated Recommendation Scanning (Optimized)
**Use Case**: System automatically scanning marketplace listings for recommendations

**Approach**:
- **Optimized text-only evaluation** using GPT-4o (images optional/skipped)
- Focus on text-based analysis:
  - Title and description analysis
  - Price comparison to market averages
  - Category and keyword matching
  - Seller information and ratings
- **Skip image analysis** for initial screening to optimize:
  - Speed: Faster evaluation (2-3s vs 5s+)
  - Cost: Lower API costs (text-only cheaper than multimodal)
  - Throughput: Process more listings per day
- Only analyze images for listings that pass initial screening threshold
- Can upgrade to full multimodal evaluation for high-confidence candidates

**When to Use**:
- Automated marketplace scanning
- Bulk listing evaluation
- Initial screening of search results
- High-volume recommendation generation

**Evaluation Approach** (Both Workflows):
1. **Input**: Listing title, description, images (optional for Workflow 2), price, category, seller info
2. **Prompt**: Structured prompt asking AI to:
   - Estimate market value based on item description and category
   - Compare current price to estimated value
   - Identify undervaluation factors (condition, rarity, comparable sales)
   - Provide confidence score (0-100)
   - Generate reasoning explanation
3. **Output**: Structured JSON with:
   - `estimatedMarketValue`: number
   - `undervaluationPercentage`: number
   - `confidenceScore`: number (0-100)
   - `reasoning`: string
   - `factors`: array of strings (e.g., "rare condition", "below market average", "limited edition")

**Implementation Notes**:
- Use OpenAI SDK with GPT-4o model
- **Workflow 1 (User-provided)**: Full multimodal evaluation with image analysis
  - Pass listing images as image URLs in the API request
  - Use GPT-4o vision capabilities for detailed assessment
  - Higher cost but maximum accuracy
- **Workflow 2 (Automated scanning)**: Optimized text-only evaluation
  - Skip image analysis for initial screening
  - Use text-only mode (title, description, metadata)
  - Faster and cheaper for bulk processing
  - Optionally upgrade to multimodal for high-confidence candidates
- Use structured output (JSON mode) for consistent evaluation results
- Implement prompt versioning (store prompts in code, version control)
- Cache evaluation results for identical listings to reduce costs
- Batch evaluations when possible to reduce API calls
- Implement fallback for AI failures (retry with exponential backoff)
- Track evaluation accuracy over time
- Store model version ("gpt-4o") and evaluation mode ("multimodal" | "text-only") in evaluation records

**Alternatives Considered**:
- **Custom ML model**: Requires training data, infrastructure, ongoing maintenance
- **Rule-based evaluation**: Too rigid, can't handle nuanced antique/collectible valuations
- **Third-party valuation APIs**: Limited availability for antiques/collectibles, additional cost

## Rate Limiting Strategy

### Decision: Token bucket algorithm with per-marketplace queues

**Rationale**:
- Token bucket provides smooth rate limiting
- Separate queues for Amazon and eBay prevent one marketplace blocking the other
- Allows burst requests when tokens available
- Prevents API rate limit violations

**Implementation**:
- Amazon: 1 token per second (86400 tokens/day)
- eBay: Distributed across day (5000 tokens/day ≈ 0.058 tokens/second)
- Queue requests when tokens unavailable
- Retry with exponential backoff on rate limit errors

**Alternatives Considered**:
- **Fixed delay**: Too rigid, doesn't handle bursts efficiently
- **Leaky bucket**: Similar to token bucket, token bucket more standard

## Caching Strategy

### Decision: Multi-layer caching (in-memory, database, CDN)

**Rationale**:
- Reduces API calls and costs
- Improves response times
- Handles temporary API outages

**Layers**:
1. **In-memory cache** (Redis or in-process): Short-term (5-15 minutes) for frequently accessed data
2. **Database cache**: Store listing data and evaluations for 24-48 hours
3. **CDN** (Vercel Edge): Cache static recommendation data

**Cache Keys**:
- Listing data: `listing:{marketplace}:{listingId}`
- Search results: `search:{marketplace}:{hashOfQuery}`
- AI evaluations: `evaluation:{hashOfListingData}`

**Alternatives Considered**:
- **No caching**: Too expensive, slow, violates rate limits
- **Database only**: Slower than in-memory for hot data

## Notification Delivery

### Decision: In-app notifications with optional email push

**Rationale**:
- In-app notifications provide immediate visibility
- Email notifications ensure users don't miss recommendations
- Can be extended to SMS/push notifications later

**Implementation**:
- Store notifications in database
- Real-time updates via polling or WebSocket (future)
- Email via Resend or SendGrid
- Notification preferences per user

**Alternatives Considered**:
- **SMS only**: More expensive, requires phone numbers
- **Push notifications**: Requires browser permission, more complex setup

## Error Handling Strategy

### Decision: Graceful degradation with user feedback

**Rationale**:
- Marketplace APIs can fail (rate limits, outages, invalid requests)
- AI evaluation can fail (API errors, timeouts)
- Users should understand system status

**Approach**:
- Retry with exponential backoff (max 3 retries)
- Log all errors for monitoring
- Show user-friendly error messages
- Continue processing other listings when one fails
- Queue failed requests for later retry

**Alternatives Considered**:
- **Fail fast**: Poor user experience
- **Silent failures**: Users lose trust

## Security Considerations

### Decision: Server-side API key management with environment variables

**Rationale**:
- API keys must never be exposed to client
- Environment variables secure in Vercel/serverless
- Rotate keys regularly
- Use least-privilege API access

**Implementation**:
- All marketplace API calls from Next.js API routes (server-side)
- Store credentials in environment variables (Vercel or Supabase secrets)
- Use different keys for dev/staging/production
- Monitor API usage for anomalies
- Supabase RLS policies for database security

**Alternatives Considered**:
- **Client-side API keys**: Security risk, violates API ToS
- **Proxy service**: Additional complexity, cost

## State Management for Cross-Platform

### Decision: RTK Query, React Query, or Zustand

**Rationale**:
- All three work on both web and React Native
- RTK Query: Part of Redux Toolkit, excellent for API state management, caching, and synchronization
- React Query (TanStack Query): Popular, great caching, works everywhere
- Zustand: Lightweight, simple API, works everywhere
- Choice depends on team preference and complexity needs

**RTK Query Advantages**:
- Built-in API caching and synchronization
- Automatic refetching and background updates
- Optimistic updates
- Request deduplication
- Works seamlessly with Redux DevTools
- Excellent TypeScript support
- Works on both web and React Native

**React Query Advantages**:
- Very popular, large community
- Excellent caching strategies
- Background refetching
- Works on both web and React Native
- Simpler than Redux if you don't need global state

**Zustand Advantages**:
- Lightweight (no boilerplate)
- Simple API
- Works on both web and React Native
- Good for simple state management
- Less ideal for complex API state

**Implementation Notes**:
- RTK Query recommended if you need robust API state management
- Can use RTK Query for API state + Zustand for UI state
- All three can share the same store/query setup between web and mobile

## UI Library Choice for Cross-Platform

### Decision: Tamagui (Recommended) or React Native Paper

**Rationale**:
- **Tamagui**: Cross-platform UI library that works on BOTH web and React Native
  - Write components once, use on web and mobile
  - Same API, same components, same styling
  - Can replace shadcn/ui on web and provide mobile components
  - Excellent performance (compiles to native code)
  - TypeScript-first
- **React Native Paper**: Material Design for React Native only
  - Mobile-only, would need separate web UI (shadcn/ui)
  - More mature, larger component library
  - Material Design aesthetic

**Tamagui Advantages**:
- **Single codebase**: Write UI components once, use everywhere
- **Shared components**: Can share UI between web and mobile
- **Performance**: Compiles to optimized native code
- **Styling**: Similar to Tailwind (utility-first)
- **TypeScript**: Excellent type safety

**React Native Paper Advantages**:
- **Mature**: Well-established, large community
- **Material Design**: Consistent Material Design components
- **Mobile-focused**: Optimized for mobile UX
- **Large component set**: Many pre-built components

**Recommendation**: 
- **If using monorepo and want to share UI**: Use Tamagui
- **If separate projects or prefer Material Design**: Use React Native Paper + keep shadcn/ui for web

**Note**: They don't work together - choose one approach. Tamagui allows maximum code sharing.

## Monorepo Structure

### Decision: Monorepo for web + mobile (Recommended)

**Rationale**:
- Share business logic, types, and potentially UI components
- Single source of truth for shared code
- Easier to maintain consistency
- Can use Turborepo, Nx, or simple npm/yarn workspaces

**Structure**:
```
rare-find/
├── packages/
│   ├── shared/              # Shared business logic and types
│   │   ├── src/
│   │   │   ├── lib/         # Business logic (AI, marketplace, recommendations)
│   │   │   └── types/       # TypeScript types
│   │   └── package.json
│   ├── web/                 # Next.js web app
│   │   ├── src/
│   │   │   ├── app/         # Next.js App Router
│   │   │   ├── components/  # Web-specific components
│   │   │   └── ...
│   │   └── package.json
│   └── mobile/              # React Native app (Expo)
│       ├── src/
│       │   ├── app/         # React Navigation
│       │   ├── components/  # Mobile-specific components (or shared Tamagui)
│       │   └── ...
│       └── package.json
├── package.json             # Root workspace
└── turbo.json               # Turborepo config (if using)
```

**Alternatives Considered**:
- **Separate repos**: More duplication, harder to keep in sync
- **Single repo, separate folders**: Simpler but less organized

## React Native Compatibility Considerations

### Decision: Stack choices optimized for future mobile app

**Rationale**:
- Planning for React Native implementation requires stack decisions that work across platforms
- Shared business logic and API layer reduces duplication
- TypeScript and React patterns translate well to React Native

**Stack Analysis**:

**✅ Mobile-Compatible Choices**:
- **TypeScript**: Works identically on web and mobile
- **React**: React Native uses React, patterns translate well
- **Supabase**: Has official React Native SDK with full feature parity
- **OpenAI SDK**: Works in React Native (HTTP-based)
- **Marketplace APIs**: Same backend API routes can be used from mobile
- **State Management**: RTK Query, React Query, or Zustand (all work on both platforms)

**⚠️ Web-Only (Need Alternatives for Mobile)**:
- **Next.js**: Web-only, but API routes can be reused as backend
- **Tailwind CSS**: Web-only, but NativeWind exists for React Native
- **shadcn/ui**: Web-only, alternatives: React Native Paper, NativeBase, Tamagui
- **Playwright**: Web-only, use React Native Testing Library + Detox for mobile

**📱 Mobile-Specific Considerations**:
- **Navigation**: Next.js routing vs React Navigation (need separate implementation)
- **Styling**: Tailwind → NativeWind or StyleSheet API
- **UI Components**: shadcn/ui → React Native Paper or Tamagui (cross-platform)
- **Icons**: lucide-react → lucide-react-native (same API)
- **Animations**: framer-motion → react-native-reanimated (similar API)

**Recommended Approach**:
1. **Shared Business Logic**: Keep all business logic in `src/lib/` - works on both platforms
2. **API Layer**: Next.js API routes serve as backend for both web and mobile
3. **Type Safety**: Shared TypeScript types in `src/types/`
4. **UI Abstraction**: Consider creating platform-agnostic component interfaces
5. **State Management**: Use RTK Query, React Query, or Zustand (all work on both platforms)
6. **Styling Strategy**: Use NativeWind for shared Tailwind classes, or StyleSheet for platform-specific

**Implementation Strategy**:
- Build web first with Next.js
- Design API routes to be mobile-friendly (RESTful, JSON responses)
- Abstract UI components where possible (business logic separate from presentation)
- Use shared types and business logic
- When building mobile: Create React Native app that calls same API routes
- Use Supabase React Native SDK for direct database access (with RLS)
- Use React Native Paper or Tamagui for mobile UI components

**Alternatives Considered**:
- **Expo**: Good option for React Native, integrates well with Supabase
- **React Native CLI**: More control but more setup
- **Monorepo**: Separate packages for web/mobile, share business logic


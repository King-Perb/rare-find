# API Routes

This directory contains Next.js API routes for the AI-Powered Bargain Detection System.

## Structure

```
api/
├── middleware.ts          # Shared middleware (error handling, auth, logging)
├── marketplace/           # Marketplace integration endpoints
│   ├── search/           # POST /api/marketplace/search
│   └── evaluate/         # POST /api/marketplace/evaluate
├── recommendations/      # Recommendation endpoints
│   ├── route.ts         # GET, POST /api/recommendations
│   └── [id]/           # GET, PATCH /api/recommendations/:id
└── preferences/         # Search preference endpoints
    ├── route.ts        # GET, POST /api/preferences
    └── [id]/          # PATCH, DELETE /api/preferences/:id
```

## Usage

All API routes use the `withApiHandler` middleware wrapper for:
- Error handling
- Request/response logging
- Authentication context (optional)

### Example Route

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, requireAuth } from '../middleware';

export const GET = withApiHandler(async (req, context) => {
  // context.userId and context.user are available if authenticated
  // Use requireAuth(req) if authentication is required
  
  return NextResponse.json({ data: 'example' });
});
```

## Authentication

- Public routes: No authentication required
- Protected routes: Use `requireAuth(req)` to get authenticated user context
- User context is available in `context.userId` and `context.user` when authenticated

## Error Handling

All errors are automatically caught and formatted:
- `AppError` instances return appropriate status codes
- Unknown errors return 500 with safe error messages
- All errors are logged with context

## Logging

All API requests and responses are automatically logged with:
- Method and path
- Status code
- Duration
- User ID (if authenticated)



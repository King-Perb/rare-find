# API Specification: AI-Powered Bargain Detection System

**Feature**: 001-ai-bargain-detection  
**Date**: 2025-01-09  
**Format**: RESTful API  
**Base URL**: `/api`

## Authentication

All API endpoints require authentication. Authentication method: [NEEDS CLARIFICATION - Session-based, JWT, or OAuth2]

**Headers**:
- `Authorization: Bearer <token>` (if JWT)
- `Cookie: session=<session-id>` (if session-based)

## Endpoints

### Recommendations

#### GET /api/recommendations

Get list of recommendations for the authenticated user.

**Query Parameters**:
- `status` (optional, string): Filter by status ("new" | "viewed" | "dismissed" | "purchased")
- `limit` (optional, number, default: 20): Maximum number of results
- `offset` (optional, number, default: 0): Pagination offset
- `sort` (optional, string, default: "createdAt"): Sort field ("createdAt" | "priority" | "undervaluationPercentage")
- `order` (optional, string, default: "desc"): Sort order ("asc" | "desc")

**Response** (200 OK):
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "listing": {
        "id": "uuid",
        "marketplace": "amazon",
        "marketplaceId": "B08XYZ123",
        "title": "Vintage Rolex Watch",
        "description": "Authentic vintage Rolex...",
        "price": 1250.00,
        "currency": "USD",
        "images": ["https://..."],
        "category": "antique",
        "condition": "used",
        "sellerName": "TrustedSeller",
        "sellerRating": 4.8,
        "listingUrl": "https://amazon.com/...",
        "available": true
      },
      "evaluation": {
        "estimatedMarketValue": 1800.00,
        "undervaluationPercentage": 30.6,
        "confidenceScore": 85,
        "reasoning": "This vintage Rolex is significantly undervalued...",
        "factors": ["rare condition", "below market average", "authentic vintage"]
      },
      "status": "new",
      "priority": 10,
      "createdAt": "2025-01-09T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### GET /api/recommendations/:id

Get detailed information about a specific recommendation.

**Response** (200 OK):
```json
{
  "id": "uuid",
  "listing": { /* full listing object */ },
  "evaluation": { /* full evaluation object */ },
  "status": "new",
  "priority": 10,
  "createdAt": "2025-01-09T10:00:00Z",
  "updatedAt": "2025-01-09T10:00:00Z",
  "viewedAt": null,
  "dismissedAt": null,
  "purchasedAt": null
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Recommendation not found or doesn't belong to user
- `500 Internal Server Error`: Server error

#### PATCH /api/recommendations/:id

Update recommendation status.

**Request Body**:
```json
{
  "status": "viewed" | "dismissed" | "purchased"
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  "status": "viewed",
  "viewedAt": "2025-01-09T11:00:00Z",
  "updatedAt": "2025-01-09T11:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid status value
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Recommendation not found
- `500 Internal Server Error`: Server error

#### POST /api/recommendations/:id/mark-purchased

Mark recommendation as purchased (convenience endpoint).

**Response** (200 OK):
```json
{
  "id": "uuid",
  "status": "purchased",
  "purchasedAt": "2025-01-09T11:30:00Z",
  "updatedAt": "2025-01-09T11:30:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Recommendation not found
- `500 Internal Server Error`: Server error

### Preferences

#### GET /api/preferences

Get user's search preferences.

**Response** (200 OK):
```json
{
  "preferences": [
    {
      "id": "uuid",
      "name": "Vintage Watches",
      "categories": ["antique", "collectible", "vintage"],
      "keywords": ["rolex", "omega", "vintage watch"],
      "minPrice": 500.00,
      "maxPrice": 5000.00,
      "marketplaces": ["amazon", "ebay"],
      "isActive": true,
      "createdAt": "2025-01-09T09:00:00Z",
      "updatedAt": "2025-01-09T09:00:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### POST /api/preferences

Create a new search preference.

**Request Body**:
```json
{
  "name": "Vintage Watches",
  "categories": ["antique", "collectible", "vintage"],
  "keywords": ["rolex", "omega", "vintage watch"],
  "minPrice": 500.00,
  "maxPrice": 5000.00,
  "marketplaces": ["amazon", "ebay"]
}
```

**Response** (201 Created):
```json
{
  "id": "uuid",
  "name": "Vintage Watches",
  "categories": ["antique", "collectible", "vintage"],
  "keywords": ["rolex", "omega", "vintage watch"],
  "minPrice": 500.00,
  "maxPrice": 5000.00,
  "marketplaces": ["amazon", "ebay"],
  "isActive": true,
  "createdAt": "2025-01-09T12:00:00Z",
  "updatedAt": "2025-01-09T12:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input (missing required fields, invalid values)
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

#### PATCH /api/preferences/:id

Update an existing search preference.

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "categories": ["antique"],
  "keywords": ["new keyword"],
  "minPrice": 1000.00,
  "maxPrice": 3000.00,
  "marketplaces": ["amazon"],
  "isActive": false
}
```

**Response** (200 OK):
```json
{
  "id": "uuid",
  /* updated fields */
  "updatedAt": "2025-01-09T12:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Preference not found
- `500 Internal Server Error`: Server error

#### DELETE /api/preferences/:id

Delete a search preference.

**Response** (204 No Content)

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Preference not found
- `500 Internal Server Error`: Server error

### Marketplace

#### POST /api/marketplace/search

Trigger a marketplace search based on active user preferences.

**Request Body**:
```json
{
  "preferenceId": "uuid" // Optional: search specific preference, otherwise all active
}
```

**Response** (202 Accepted):
```json
{
  "jobId": "uuid",
  "status": "queued",
  "message": "Search job queued. Results will be processed asynchronously."
}
```

**Error Responses**:
- `400 Bad Request`: Invalid preference ID or no active preferences
- `401 Unauthorized`: User not authenticated
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

#### POST /api/marketplace/evaluate

Evaluate a specific listing with AI.

**Request Body**:
```json
{
  "listingId": "uuid" // Optional: evaluate existing listing
  // OR
  "listing": {
    "marketplace": "amazon",
    "marketplaceId": "B08XYZ123",
    "title": "Vintage Rolex Watch",
    "description": "...",
    "price": 1250.00,
    "images": ["https://..."],
    "category": "antique"
  }
}
```

**Response** (200 OK):
```json
{
  "evaluation": {
    "id": "uuid",
    "estimatedMarketValue": 1800.00,
    "undervaluationPercentage": 30.6,
    "confidenceScore": 85,
    "reasoning": "This vintage Rolex is significantly undervalued...",
    "factors": ["rare condition", "below market average"],
    "evaluatedAt": "2025-01-09T13:00:00Z"
  },
  "recommendationCreated": true // Whether a recommendation was created
}
```

**Error Responses**:
- `400 Bad Request`: Invalid listing data
- `401 Unauthorized`: User not authenticated
- `429 Too Many Requests`: AI evaluation rate limit exceeded
- `500 Internal Server Error`: Server or AI service error

## Error Response Format

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional: additional error details
  }
}
```

## Rate Limiting

- **Recommendations API**: 100 requests per minute per user
- **Preferences API**: 20 requests per minute per user
- **Marketplace Search**: 10 requests per hour per user
- **Marketplace Evaluate**: 50 requests per hour per user

Rate limit headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets

## Pagination

List endpoints support pagination via `limit` and `offset` query parameters.

Response includes:
- `total`: Total number of items
- `limit`: Requested limit
- `offset`: Requested offset


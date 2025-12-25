# Data Model: AI-Powered Bargain Detection System

**Feature**: 001-ai-bargain-detection  
**Date**: 2025-01-09  
**Database**: PostgreSQL (Vercel Postgres)  
**ORM**: Prisma

## Entity Relationships

```
User
  ├── 1:N SearchPreference
  ├── 1:N Recommendation
  └── 1:N Notification

SearchPreference
  └── N:1 User

Listing
  ├── 1:1 AIEvaluation
  └── 1:N Recommendation

AIEvaluation
  └── 1:1 Listing

Recommendation
  ├── N:1 User
  └── N:1 Listing

Notification
  └── N:1 User
```

## Entities

### User

Represents a user of the system with authentication and profile information.

**Fields**:
- `id` (UUID, Primary Key): Unique user identifier
- `email` (String, Unique, Required): User email address
- `name` (String, Optional): User display name
- `createdAt` (DateTime, Required): Account creation timestamp
- `updatedAt` (DateTime, Required): Last update timestamp
- `preferences` (Relation): User's search preferences
- `recommendations` (Relation): User's recommendations
- `notifications` (Relation): User's notifications

**Validation Rules**:
- Email must be valid email format
- Email must be unique across all users

**State Transitions**: None (simple entity)

### SearchPreference

User-defined criteria for what items to search for and evaluate.

**Fields**:
- `id` (UUID, Primary Key): Unique preference identifier
- `userId` (UUID, Foreign Key → User, Required): Owner of this preference
- `name` (String, Required): User-friendly name for this preference (e.g., "Vintage Watches")
- `categories` (String[], Required): Array of categories to search (e.g., ["antique", "collectible", "vintage"])
- `keywords` (String[], Optional): Array of search keywords to prioritize
- `minPrice` (Decimal, Optional): Minimum price filter (in USD)
- `maxPrice` (Decimal, Optional): Maximum price filter (in USD)
- `marketplaces` (String[], Required): Marketplaces to search (e.g., ["amazon", "ebay"])
- `isActive` (Boolean, Required, Default: true): Whether this preference is currently active
- `createdAt` (DateTime, Required): Preference creation timestamp
- `updatedAt` (DateTime, Required): Last update timestamp
- `user` (Relation): Owner user

**Validation Rules**:
- `categories` must contain at least one category
- `marketplaces` must contain at least one marketplace
- `maxPrice` must be greater than `minPrice` if both are set
- `minPrice` and `maxPrice` must be positive numbers
- `keywords` array can be empty but not null

**State Transitions**:
- `isActive: false` → `isActive: true`: Re-activate preference
- `isActive: true` → `isActive: false`: Deactivate preference

### Listing

An item listing from Amazon or eBay marketplace.

**Fields**:
- `id` (UUID, Primary Key): Unique listing identifier
- `marketplace` (String, Required): Marketplace source ("amazon" | "ebay")
- `marketplaceId` (String, Required): Listing ID from marketplace (e.g., ASIN, eBay item ID)
- `title` (String, Required): Listing title
- `description` (Text, Optional): Listing description
- `price` (Decimal, Required): Current listing price (in USD)
- `currency` (String, Required, Default: "USD"): Price currency code
- `images` (String[], Required): Array of image URLs
- `category` (String, Optional): Item category
- `condition` (String, Optional): Item condition (e.g., "new", "used", "vintage")
- `sellerName` (String, Optional): Seller name/username
- `sellerRating` (Decimal, Optional): Seller rating (0-5 scale)
- `listingUrl` (String, Required): Direct link to marketplace listing
- `available` (Boolean, Required, Default: true): Whether listing is still available
- `lastChecked` (DateTime, Required): Last time listing data was fetched
- `createdAt` (DateTime, Required): When listing was first discovered
- `updatedAt` (DateTime, Required): Last update timestamp
- `evaluation` (Relation): AI evaluation of this listing
- `recommendations` (Relation): Recommendations generated for this listing

**Validation Rules**:
- `marketplace` must be one of: "amazon", "ebay"
- `marketplaceId` must be unique per marketplace (composite unique constraint)
- `price` must be positive
- `images` must contain at least one URL
- `listingUrl` must be valid URL format

**State Transitions**:
- `available: true` → `available: false`: Listing sold or removed
- Price updates trigger re-evaluation if significant change (>10%)

### AIEvaluation

AI-powered analysis of a listing to determine if it's undervalued.

**Fields**:
- `id` (UUID, Primary Key): Unique evaluation identifier
- `listingId` (UUID, Foreign Key → Listing, Required, Unique): Listing being evaluated
- `estimatedMarketValue` (Decimal, Required): AI-estimated market value (in USD)
- `undervaluationPercentage` (Decimal, Required): Percentage below market value (e.g., 25.5 for 25.5% undervalued)
- `confidenceScore` (Integer, Required): Confidence in evaluation (0-100)
- `reasoning` (Text, Required): Human-readable explanation of evaluation
- `factors` (String[], Required): Array of factors indicating undervaluation (e.g., ["rare condition", "below market average"])
- `promptVersion` (String, Required): Version of AI prompt used (for tracking)
- `modelVersion` (String, Required): AI model version used (e.g., "gpt-4o")
- `evaluatedAt` (DateTime, Required): When evaluation was performed
- `listing` (Relation): Evaluated listing

**Validation Rules**:
- `estimatedMarketValue` must be positive
- `undervaluationPercentage` must be >= 0 (0 = at market value, >0 = undervalued)
- `confidenceScore` must be between 0 and 100
- `reasoning` must not be empty
- `factors` must contain at least one factor

**State Transitions**: None (immutable - new evaluation creates new record)

### Recommendation

A buy recommendation generated for an undervalued listing.

**Fields**:
- `id` (UUID, Primary Key): Unique recommendation identifier
- `userId` (UUID, Foreign Key → User, Required): User receiving recommendation
- `listingId` (UUID, Foreign Key → Listing, Required): Recommended listing
- `status` (String, Required, Default: "new"): Recommendation status ("new" | "viewed" | "dismissed" | "purchased")
- `priority` (Integer, Required, Default: 0): Recommendation priority (higher = more important)
- `createdAt` (DateTime, Required): When recommendation was created
- `updatedAt` (DateTime, Required): Last update timestamp
- `viewedAt` (DateTime, Optional): When user first viewed recommendation
- `dismissedAt` (DateTime, Optional): When user dismissed recommendation
- `purchasedAt` (DateTime, Optional): When user marked as purchased
- `user` (Relation): User receiving recommendation
- `listing` (Relation): Recommended listing

**Validation Rules**:
- `status` must be one of: "new", "viewed", "dismissed", "purchased"
- `priority` must be >= 0
- `viewedAt` must be set when `status` changes to "viewed"
- `dismissedAt` must be set when `status` changes to "dismissed"
- `purchasedAt` must be set when `status` changes to "purchased"
- One recommendation per user per listing (composite unique constraint)

**State Transitions**:
- `status: "new"` → `status: "viewed"`: User views recommendation
- `status: "new"` → `status: "dismissed"`: User dismisses recommendation
- `status: "new"` → `status: "purchased"`: User marks as purchased
- `status: "viewed"` → `status: "dismissed"`: User dismisses after viewing
- `status: "viewed"` → `status: "purchased"`: User purchases after viewing
- Once "dismissed" or "purchased", status cannot change back

### Notification

Notification sent to user about new recommendations or system updates.

**Fields**:
- `id` (UUID, Primary Key): Unique notification identifier
- `userId` (UUID, Foreign Key → User, Required): User receiving notification
- `type` (String, Required): Notification type ("new_recommendation" | "system_update" | "preference_updated")
- `title` (String, Required): Notification title
- `message` (Text, Required): Notification message
- `read` (Boolean, Required, Default: false): Whether notification has been read
- `readAt` (DateTime, Optional): When notification was read
- `createdAt` (DateTime, Required): When notification was created
- `user` (Relation): User receiving notification

**Validation Rules**:
- `type` must be one of: "new_recommendation", "system_update", "preference_updated"
- `title` and `message` must not be empty
- `readAt` must be set when `read` changes to true

**State Transitions**:
- `read: false` → `read: true`: User reads notification

## Database Indexes

**Performance Optimizations**:
- `User.email`: Unique index for fast lookups
- `Listing.markplace_marketplaceId`: Composite unique index
- `Recommendation.userId_status`: Composite index for filtering user recommendations
- `Recommendation.createdAt`: Index for sorting by date
- `SearchPreference.userId_isActive`: Composite index for active preferences
- `AIEvaluation.listingId`: Index for joining with listings
- `Notification.userId_read`: Composite index for unread notifications

## Data Retention

- **Listings**: Retain for 90 days after last update (archive old listings)
- **AI Evaluations**: Retain permanently (for accuracy tracking)
- **Recommendations**: Retain for 1 year after creation
- **Notifications**: Retain for 30 days after creation
- **Search Preferences**: Retain while user account is active

## Migration Strategy

1. Create base schema with all tables
2. Add indexes after initial data load
3. Add constraints and validations
4. Set up database backups (daily)
5. Monitor query performance and optimize as needed


# Supabase Architecture: Client-Side vs Backend-Only

This document explains when you need `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` when using a backend proxy.

## Two Architecture Options

### Option 1: Client-Side Auth (Current Setup) ✅ Recommended

**Architecture:**
```
Mobile App (Supabase Client)
    ↓ Login/Signup
Supabase Auth
    ↓ Auth Token
Mobile App stores token
    ↓ Token in requests
Backend API (Vercel) validates token
    ↓ Validated requests
External APIs (OpenAI, Amazon, eBay)
```

**Do you need EXPO_PUBLIC_SUPABASE_URL?** ✅ **YES**

**Why:**
- Mobile app handles login/signup directly with Supabase
- Mobile app manages auth state (session persistence)
- Mobile app gets auth tokens from Supabase
- Backend validates tokens (doesn't handle login)

**Environment Variables Needed:**
```bash
# Mobile app (.env)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
EXPO_PUBLIC_API_URL=https://your-api.vercel.app  # Backend API
```

**How it works:**
1. User logs in via mobile app → Supabase Auth
2. Mobile app gets session token
3. Mobile app calls backend API with token: `Authorization: Bearer <token>`
4. Backend validates token with Supabase
5. Backend makes API calls (OpenAI, Amazon, etc.)

**Benefits:**
- ✅ Standard Supabase auth flow
- ✅ Session management handled by Supabase
- ✅ Works offline (cached sessions)
- ✅ Real-time subscriptions work (if needed)

---

### Option 2: Backend-Only Auth

**Architecture:**
```
Mobile App
    ↓ Login/Signup requests
Backend API (Vercel)
    ↓ Handles Supabase Auth
Supabase Auth
    ↓ Returns session
Backend API
    ↓ Returns custom token
Mobile App stores custom token
    ↓ Custom token in requests
Backend API validates custom token
    ↓ Validated requests
External APIs (OpenAI, Amazon, eBay)
```

**Do you need EXPO_PUBLIC_SUPABASE_URL?** ❌ **NO**

**Why:**
- Backend handles all Supabase operations
- Mobile app never directly calls Supabase
- Mobile app only calls your backend API
- Backend manages Supabase connection

**Environment Variables Needed:**
```bash
# Mobile app (.env)
EXPO_PUBLIC_API_URL=https://your-api.vercel.app  # Only this!

# Backend (Vercel environment variables)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only!
OPENAI_API_KEY=sk-...
AMAZON_ACCESS_KEY=...
# etc.
```

**How it works:**
1. User logs in via mobile app → Calls `/api/auth/login`
2. Backend handles Supabase login
3. Backend returns custom session token
4. Mobile app stores custom token
5. Mobile app calls backend API with custom token
6. Backend validates custom token and makes API calls

**Benefits:**
- ✅ No Supabase client in mobile app
- ✅ Full control over auth flow
- ✅ Can use service role key (more permissions)
- ❌ More backend code needed
- ❌ No offline session support

---

## Current Setup Analysis

Looking at your code:

**Mobile App** (`packages/mobile/src/app/_layout.tsx`):
```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  // Handles auth state changes
});
```

**Backend API** (`packages/web/src/app/api/middleware.ts`):
```typescript
const user = await getCurrentUser(); // Gets user from Supabase
```

**Conclusion**: You're using **Option 1 (Client-Side Auth)**

This means:
- ✅ **YES, you need** `EXPO_PUBLIC_SUPABASE_URL`
- ✅ **YES, you need** `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- ✅ **YES, you need** `EXPO_PUBLIC_API_URL` (for backend API)

---

## Environment Variables Breakdown

### Mobile App Environment Variables

```bash
# Required for Supabase Auth (client-side)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Required for Backend API calls
EXPO_PUBLIC_API_URL=https://your-api.vercel.app

# NOT needed (handled by backend):
# ❌ EXPO_PUBLIC_OPENAI_API_KEY
# ❌ EXPO_PUBLIC_AMAZON_SECRET_KEY
# ❌ EXPO_PUBLIC_RAPIDAPI_KEY
```

### Backend (Vercel) Environment Variables

```bash
# Supabase (for auth validation)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only!

# External API Keys (server-side only)
OPENAI_API_KEY=sk-...
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
AMAZON_ASSOCIATE_TAG=...
EBAY_APP_ID=...
RAPIDAPI_KEY=...  # If using RapidAPI
```

---

## What Each Variable Does

### `EXPO_PUBLIC_SUPABASE_URL` & `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Purpose**: Client-side Supabase connection for authentication

**Used for**:
- User login/signup
- Session management
- Auth state changes
- Getting auth tokens

**Security**:
- ✅ Safe to expose (anon key is public by design)
- ✅ Protected by Row Level Security (RLS) policies
- ✅ Can only do what RLS allows

**Do you need it?**: ✅ **YES** (if using client-side auth)

---

### `EXPO_PUBLIC_API_URL`

**Purpose**: Your backend API endpoint (Vercel deployment)

**Used for**:
- Calling `/api/marketplace/evaluate`
- Calling other backend endpoints
- Sending auth tokens for validation

**Security**:
- ✅ Safe to expose (just a URL)
- ✅ Authentication handled by tokens

**Do you need it?**: ✅ **YES**

---

## Complete Setup Example

### Mobile App `.env`:

```bash
# Supabase (for auth)
EXPO_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API
EXPO_PUBLIC_API_URL=https://rarefind.vercel.app

# ❌ DO NOT include these (handled by backend):
# EXPO_PUBLIC_OPENAI_API_KEY
# EXPO_PUBLIC_AMAZON_SECRET_KEY
```

### Backend (Vercel) Environment Variables:

```bash
# Supabase (server-side)
SUPABASE_URL=https://xyzabc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Service role!

# External APIs (server-side only)
OPENAI_API_KEY=sk-...
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
AMAZON_ASSOCIATE_TAG=...
EBAY_APP_ID=...
```

---

## Security Summary

| Variable | Location | Security | Purpose |
|----------|----------|----------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Mobile | ✅ Safe | Supabase connection |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Mobile | ✅ Safe | Supabase auth (public key) |
| `EXPO_PUBLIC_API_URL` | Mobile | ✅ Safe | Backend API endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend | ⚠️ Secret | Server-side Supabase ops |
| `OPENAI_API_KEY` | Backend | ⚠️ Secret | OpenAI API calls |
| `AMAZON_SECRET_KEY` | Backend | ⚠️ Secret | Amazon API calls |

---

## Answer to Your Question

**Q: Do I need EXPO_PUBLIC_SUPABASE_URL if using backend from Vercel?**

**A: YES**, if you're using client-side authentication (which you are).

**Why:**
- Mobile app handles login/signup with Supabase
- Mobile app needs to connect to Supabase for auth
- Backend only validates tokens (doesn't handle login)

**The backend proxy is for:**
- ✅ External API calls (OpenAI, Amazon, eBay)
- ✅ Business logic execution
- ✅ API key protection

**The client-side Supabase is for:**
- ✅ User authentication (login/signup)
- ✅ Session management
- ✅ Auth state tracking

**They serve different purposes!**

---

## If You Want to Remove Client-Side Supabase

You could switch to **Option 2 (Backend-Only Auth)**:

1. Create `/api/auth/login` endpoint in backend
2. Create `/api/auth/signup` endpoint in backend
3. Remove Supabase client from mobile app
4. Mobile app only calls backend API

**Then you wouldn't need:**
- ❌ `EXPO_PUBLIC_SUPABASE_URL`
- ❌ `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**But you'd need to:**
- Implement custom auth endpoints
- Handle session management yourself
- More backend code

**Recommendation**: Keep current setup (Option 1) - it's simpler and standard.

---

## Summary

**With backend proxy (Vercel), you still need:**

✅ `EXPO_PUBLIC_SUPABASE_URL` - For client-side auth
✅ `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - For client-side auth
✅ `EXPO_PUBLIC_API_URL` - For backend API calls

**You DON'T need:**
❌ `EXPO_PUBLIC_OPENAI_API_KEY` - Handled by backend
❌ `EXPO_PUBLIC_AMAZON_SECRET_KEY` - Handled by backend
❌ `EXPO_PUBLIC_RAPIDAPI_KEY` - Handled by backend

**Backend needs (on Vercel):**
- `SUPABASE_URL` (for token validation)
- `SUPABASE_SERVICE_ROLE_KEY` (for server-side ops)
- `OPENAI_API_KEY`, `AMAZON_*`, etc. (for external APIs)

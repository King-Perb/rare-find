# ⚠️ Security Warning: API Keys in Mobile Apps

## Critical Security Issue

The example files in this directory (`marketplace-usage.ts`, `evaluation-usage.ts`) demonstrate how to use shared services with environment variables prefixed with `EXPO_PUBLIC_`.

**⚠️ THESE EXAMPLES ARE FOR DEVELOPMENT/TESTING ONLY!**

## Why This Is Dangerous

1. **API Keys Are Exposed**: Variables with `EXPO_PUBLIC_` prefix are bundled into your app
2. **Easy to Extract**: Anyone can extract API keys by inspecting the app bundle
3. **Unauthorized Usage**: Extracted keys can be used to:
   - Make API calls on your behalf
   - Consume your API quota
   - Rack up charges on your account
   - Access your data

## What Should NOT Use EXPO_PUBLIC_

❌ **OpenAI API Key** - Can be extracted and used to make expensive API calls
❌ **RapidAPI Key** - Can be extracted and used to consume your quota
❌ **Amazon Secret Key** - Can be extracted and used for unauthorized API access
❌ **Any paid API credentials** - Will result in unauthorized usage

## Safe Alternatives

### ✅ Option 1: Backend API Proxy (Recommended)

Create a backend API that proxies all requests. The mobile app never sees API keys.

**Example Architecture:**

```
Mobile App → Your Backend API → External APIs (OpenAI, Amazon, eBay)
```

**Benefits:**
- API keys never leave your server
- Can implement rate limiting
- Can add authentication
- Can cache responses
- Can monitor usage

**Implementation:**

```typescript
// Instead of calling OpenAI directly:
const response = await fetch('https://your-api.com/evaluate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ listing }),
});

const result = await response.json();
```

### ✅ Option 2: User-Provided Keys (If Applicable)

If users provide their own API keys, use Expo SecureStore:

```typescript
import * as SecureStore from 'expo-secure-store';

// User provides their own OpenAI key
await SecureStore.setItemAsync('user_openai_key', userProvidedKey);
const apiKey = await SecureStore.getItemAsync('user_openai_key');
```

**Note**: Only appropriate if users provide their own keys.

### ✅ Option 3: Development Only

Use `EXPO_PUBLIC_` variables **only** for:
- Local development
- Testing
- Internal builds (never distributed)

## What IS Safe to Use EXPO_PUBLIC_

✅ **Public identifiers** (Amazon Associate Tag, eBay App ID)
✅ **Public configuration** (API endpoints, feature flags)
✅ **Non-sensitive data** (region codes, default values)

## Recommended Production Setup

1. **Create a Backend API** (Next.js, Express, etc.)
2. **Store API keys on the server** (environment variables, secrets manager)
3. **Mobile app calls your backend** (not external APIs directly)
4. **Backend proxies requests** to external APIs
5. **Add authentication** to your backend API

## Example: Secure Backend API

```typescript
// Backend API route (Next.js example)
// app/api/evaluate/route.ts
export async function POST(request: Request) {
  // Verify user authentication
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Get API key from server environment (never exposed to client)
  const openaiKey = process.env.OPENAI_API_KEY; // No EXPO_PUBLIC_ prefix!

  // Make API call from server
  const openai = new OpenAI({ apiKey: openaiKey });
  const result = await evaluateListing(listing, openai);

  return Response.json(result);
}
```

```typescript
// Mobile app calls your backend
const response = await fetch('https://your-api.com/api/evaluate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userToken}`,
  },
  body: JSON.stringify({ listing }),
});
```

## Migration Path

1. **Development**: Use `EXPO_PUBLIC_` variables for local testing
2. **Staging**: Set up backend API proxy
3. **Production**: Only use backend API proxy (no `EXPO_PUBLIC_` for sensitive keys)

## See Also

- `doc/ENV_SETUP.md` - Detailed environment variable setup guide
- Backend API documentation (when available)

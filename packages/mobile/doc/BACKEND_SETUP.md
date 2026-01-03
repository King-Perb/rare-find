# Backend API Setup for Mobile App

This guide explains how to use your existing Next.js API routes as a secure backend for the mobile app.

## ✅ Yes, Expo Fully Supports This!

Expo apps can call any HTTP API, including your Next.js backend. This is the **recommended and secure** approach.

## Architecture

```
Mobile App (Expo/React Native)
    ↓ HTTP requests (authenticated)
Your Next.js API (packages/web)
    ↓ (API keys on server)
External APIs (OpenAI, Amazon, eBay)
```

## Benefits

✅ **Secure**: API keys never leave your server
✅ **Reuses Existing Code**: Your web package already has API routes
✅ **Single Source of Truth**: Same backend for web and mobile
✅ **Easy to Deploy**: Next.js deploys to many platforms
✅ **Industry Standard**: Most production apps use this approach

## Your Existing API Routes

Your web package already has:

- ✅ `POST /api/marketplace/evaluate` - Evaluate listings (already implemented!)

You can add more endpoints as needed:
- `POST /api/marketplace/search` - Search listings
- `GET /api/marketplace/listing/:id` - Get listing by ID
- etc.

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Best for**: Quick deployment, automatic scaling, great Next.js support

1. **Deploy your web package to Vercel**:
   ```bash
   cd packages/web
   vercel deploy
   ```

2. **Get your API URL**: `https://your-app.vercel.app`

3. **Configure mobile app**:
   ```typescript
   const client = createBackendClient('https://your-app.vercel.app');
   ```

**Benefits**:
- Free tier available
- Automatic HTTPS
- Global CDN
- Easy environment variable management
- Automatic deployments from Git

### Option 2: AWS (Amplify, Lambda, or EC2)

**Best for**: AWS ecosystem, more control

- **Amplify**: Managed Next.js hosting
- **Lambda**: Serverless functions
- **EC2**: Full server control

### Option 3: Railway, Render, Fly.io

**Best for**: Simple deployment, good free tiers

All support Next.js and are easy to set up.

### Option 4: Self-Hosted

**Best for**: Full control, existing infrastructure

Deploy to your own servers (VPS, dedicated server, etc.)

## Setup Steps

### 1. Deploy Your Web Package

Choose a deployment platform (Vercel recommended):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web package
cd packages/web
vercel
```

### 2. Configure Environment Variables on Server

Set these on your deployment platform (NOT in mobile app):

```bash
# On Vercel/Railway/etc. dashboard:
OPENAI_API_KEY=sk-...
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
AMAZON_ASSOCIATE_TAG=...
EBAY_APP_ID=...
```

**Important**: These are server-side only (no `EXPO_PUBLIC_` prefix!)

### 3. Configure Mobile App

In your mobile app, only set the API URL:

```bash
# packages/mobile/.env
EXPO_PUBLIC_API_URL=https://your-api.rarefind.com
```

**That's it!** No API keys in the mobile app.

### 4. Use Backend Client

```typescript
import { createBackendClient } from '@/lib/api/backend-client';

const client = createBackendClient(
  process.env.EXPO_PUBLIC_API_URL!,
  authToken // Optional: if you add authentication
);

const result = await client.evaluateListing({
  listingUrl: 'https://amazon.com/dp/B08XYZ1234',
});
```

## Security: Is This Safe?

### ✅ Yes, This Is Safe Because:

1. **API Keys on Server**: All sensitive keys stay on your server
2. **HTTPS Required**: All communication is encrypted
3. **Authentication**: You can add user authentication to your API
4. **Rate Limiting**: You can implement rate limiting on your backend
5. **Monitoring**: You can monitor API usage and detect abuse

### 🔒 Additional Security Measures:

1. **Add Authentication** (Recommended):
   ```typescript
   // In your API route
   const user = await requireAuth(req);
   // Only authenticated users can use the API
   ```

2. **Rate Limiting**:
   ```typescript
   // Limit requests per user/IP
   // Prevent abuse and control costs
   ```

3. **CORS Configuration**:
   ```typescript
   // In next.config.ts
   headers: [
     {
       source: '/api/:path*',
       headers: [
         { key: 'Access-Control-Allow-Origin', value: 'https://your-mobile-app.com' },
       ],
     },
   ],
   ```

4. **Environment Variables**:
   - Store API keys in deployment platform's secret management
   - Never commit keys to Git
   - Rotate keys regularly

## Example: Complete Setup

### 1. Deploy Web Package to Vercel

```bash
cd packages/web
vercel
# Follow prompts, get URL: https://rarefind.vercel.app
```

### 2. Set Environment Variables on Vercel

In Vercel dashboard → Project → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-...
AMAZON_ACCESS_KEY=...
AMAZON_SECRET_KEY=...
# etc.
```

### 3. Update Mobile App

```typescript
// packages/mobile/src/lib/api/config.ts
export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://rarefind.vercel.app',
};
```

### 4. Use in Mobile App

```typescript
import { createBackendClient } from '@/lib/api/backend-client';
import { API_CONFIG } from '@/lib/api/config';

const client = createBackendClient(API_CONFIG.baseUrl);
const result = await client.evaluateListing({ listingUrl });
```

## Cost Considerations

### Backend Hosting Costs:

- **Vercel**: Free tier (100GB bandwidth), then $20/month
- **Railway**: $5/month starter
- **Render**: Free tier available
- **AWS**: Pay-as-you-go (can be very cheap)

### API Usage Costs:

- **OpenAI**: You pay for API calls (same as web app)
- **Amazon/eBay**: Same as web app
- **Benefit**: You can implement caching to reduce costs

## Comparison: Backend Proxy vs SecureStore

| Feature | Backend Proxy ✅ | SecureStore ❌ |
|---------|------------------|----------------|
| **Security** | Keys never exposed | Keys on device (extractable) |
| **Control** | Full control, rate limiting | No control |
| **Cost Management** | Can monitor/limit usage | Can't prevent abuse |
| **Key Rotation** | Easy (server-side) | Requires app update |
| **Industry Standard** | Yes, widely used | Not for service keys |
| **Setup Complexity** | Medium (deploy backend) | Low (just store) |

**Verdict**: Backend proxy is better and more popular for service API keys.

## Troubleshooting

### CORS Errors

If you get CORS errors, configure CORS in `next.config.ts`:

```typescript
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' }, // Or specific domain
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
    ],
  },
],
```

### Authentication

If you add authentication, update the backend client:

```typescript
// Get token from SecureStore (user login)
const token = await SecureStore.getItemAsync('auth_token');
const client = createBackendClient(apiUrl, token);
```

## Next Steps

1. ✅ Deploy web package to Vercel (or your preferred platform)
2. ✅ Set environment variables on deployment platform
3. ✅ Update mobile app to use `BackendClient`
4. ✅ Test API calls from mobile app
5. ✅ Add authentication if needed
6. ✅ Monitor API usage and costs

## See Also

- `src/lib/api/backend-client.ts` - Backend client implementation
- `src/lib/examples/backend-usage.ts` - Usage examples
- `doc/ENV_SETUP.md` - Environment variable setup (development only)
- `doc/SECURITY_WARNING.md` - Security considerations

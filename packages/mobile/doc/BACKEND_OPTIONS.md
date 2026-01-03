# Backend Deployment Options for Expo Apps

If you don't have a web app, here are the best options for deploying a backend API for your Expo mobile app.

## 🏆 Top Recommendations

### 1. Supabase Edge Functions (Recommended if using Supabase)

**Best for**: Projects already using Supabase (like yours!)

**Why it's great**:
- ✅ You're already using Supabase
- ✅ Serverless functions (Deno runtime)
- ✅ Built-in authentication
- ✅ Free tier: 500K invocations/month
- ✅ Easy deployment: `supabase functions deploy`
- ✅ TypeScript support

**Deployment**:
```bash
# Install Supabase CLI
npm install -g supabase

# Deploy function
supabase functions deploy evaluate-listing
```

**Example Function** (`supabase/functions/evaluate-listing/index.ts`):
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // Your shared services logic here
  // API keys stored in Supabase secrets
  const result = await evaluateListing(listing);
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Cost**: Free tier (500K invocations/month), then $0.0000002 per invocation

---

### 2. Vercel Serverless Functions

**Best for**: Quick setup, great developer experience

**Why it's great**:
- ✅ Free tier: 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Easy deployment: `vercel deploy`
- ✅ Great Next.js support (if you add Next.js later)
- ✅ Global CDN

**Deployment**:
```bash
# Create api/ directory
mkdir api
# Create api/evaluate.ts
vercel deploy
```

**Example Function** (`api/evaluate.ts`):
```typescript
export default async function handler(req, res) {
  // Your shared services logic
  const result = await evaluateListing(req.body);
  res.json(result);
}
```

**Cost**: Free tier, then $20/month (Pro)

---

### 3. AWS Lambda + API Gateway

**Best for**: Enterprise scale, AWS ecosystem

**Why it's great**:
- ✅ Pay-per-use (very cheap for low traffic)
- ✅ Automatic scaling
- ✅ Integrates with other AWS services
- ✅ Free tier: 1M requests/month

**Deployment**: Use AWS SAM, Serverless Framework, or CDK

**Cost**: Free tier (1M requests/month), then $0.20 per 1M requests

---

### 4. Railway

**Best for**: Simple deployment, good free tier

**Why it's great**:
- ✅ $5/month starter (very affordable)
- ✅ Easy deployment from Git
- ✅ Automatic HTTPS
- ✅ Environment variable management
- ✅ Supports any Node.js/Python/etc. backend

**Deployment**:
```bash
# Connect GitHub repo
# Railway auto-detects and deploys
```

**Cost**: $5/month starter, $20/month (Pro)

---

### 5. Render

**Best for**: Free tier, simple setup

**Why it's great**:
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Easy environment variables
- ✅ Supports Express, FastAPI, etc.

**Deployment**: Connect GitHub, auto-deploys

**Cost**: Free tier (with limitations), $7/month (Starter)

---

### 6. Firebase Cloud Functions

**Best for**: Firebase ecosystem, Google Cloud

**Why it's great**:
- ✅ Free tier: 2M invocations/month
- ✅ Integrates with Firebase Auth
- ✅ Easy deployment: `firebase deploy`
- ✅ Automatic scaling

**Deployment**:
```bash
firebase init functions
firebase deploy --only functions
```

**Cost**: Free tier (2M invocations/month), then pay-per-use

---

### 7. Express.js on Fly.io / Render / Railway

**Best for**: Traditional backend, more control

**Why it's great**:
- ✅ Full control over server
- ✅ Can use any Node.js framework
- ✅ Easy to migrate existing code
- ✅ Good for complex backends

**Example** (`server.js`):
```javascript
const express = require('express');
const app = express();

app.post('/api/evaluate', async (req, res) => {
  const result = await evaluateListing(req.body);
  res.json(result);
});

app.listen(3000);
```

**Deployment**: Deploy to Fly.io, Render, or Railway

**Cost**: Varies by platform ($5-20/month)

---

## Comparison Table

| Platform | Free Tier | Ease of Setup | Best For | Cost After Free |
|----------|-----------|---------------|----------|-----------------|
| **Supabase Functions** | 500K/month | ⭐⭐⭐⭐⭐ | Supabase users | $0.0000002/invocation |
| **Vercel** | 100GB bandwidth | ⭐⭐⭐⭐⭐ | Quick setup | $20/month |
| **AWS Lambda** | 1M requests | ⭐⭐⭐ | Enterprise | $0.20/1M requests |
| **Railway** | None | ⭐⭐⭐⭐ | Simple deployment | $5/month |
| **Render** | Limited | ⭐⭐⭐⭐ | Free tier | $7/month |
| **Firebase Functions** | 2M/month | ⭐⭐⭐⭐ | Firebase users | Pay-per-use |
| **Fly.io** | 3 VMs | ⭐⭐⭐ | Full control | $5-20/month |

---

## Recommendation for Your Project

### Option 1: Supabase Edge Functions (Best Match)

Since you're already using Supabase:

1. **Create Edge Functions**:
   ```bash
   supabase functions new evaluate-listing
   ```

2. **Use Shared Services**:
   - Import shared package services
   - Use Supabase secrets for API keys
   - Deploy: `supabase functions deploy`

3. **Call from Mobile**:
   ```typescript
   const { data } = await supabase.functions.invoke('evaluate-listing', {
     body: { listingUrl },
   });
   ```

**Benefits**:
- ✅ Already using Supabase
- ✅ No additional infrastructure
- ✅ Serverless (scales automatically)
- ✅ Free tier is generous

### Option 2: Vercel Serverless Functions (Easiest)

If you want the simplest setup:

1. **Create `api/` directory** in a new repo or monorepo
2. **Deploy**: `vercel deploy`
3. **Get URL**: `https://your-api.vercel.app`

**Benefits**:
- ✅ Easiest to set up
- ✅ Great free tier
- ✅ Automatic HTTPS
- ✅ Easy to add Next.js later

---

## Quick Start: Supabase Edge Functions

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Functions

```bash
cd packages/mobile  # or create separate backend
supabase init
supabase functions new evaluate-listing
```

### 3. Create Function

```typescript
// supabase/functions/evaluate-listing/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { listingUrl } = await req.json();

  // Get API keys from Supabase secrets (set in dashboard)
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  const amazonKey = Deno.env.get('AMAZON_ACCESS_KEY');

  // Use shared services (import from shared package)
  // ... your evaluation logic ...

  return new Response(
    JSON.stringify({ success: true, result }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
```

### 4. Set Secrets

```bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set AMAZON_ACCESS_KEY=...
```

### 5. Deploy

```bash
supabase functions deploy evaluate-listing
```

### 6. Call from Mobile

```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.functions.invoke('evaluate-listing', {
  body: { listingUrl: 'https://amazon.com/dp/...' },
});
```

---

## Quick Start: Vercel Serverless Functions

### 1. Create API Directory

```bash
mkdir backend-api
cd backend-api
mkdir api
```

### 2. Create Function

```typescript
// api/evaluate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Your shared services logic
  const result = await evaluateListing(req.body);
  res.json(result);
}
```

### 3. Deploy

```bash
vercel
```

### 4. Call from Mobile

```typescript
const response = await fetch('https://your-api.vercel.app/api/evaluate', {
  method: 'POST',
  body: JSON.stringify({ listingUrl }),
});
```

---

## Security Best Practices

Regardless of platform:

1. **Store API keys as secrets** (never in code)
2. **Use HTTPS** (all platforms provide this)
3. **Add authentication** (require user tokens)
4. **Implement rate limiting** (prevent abuse)
5. **Monitor usage** (track costs and abuse)

---

## Cost Comparison (Estimated Monthly)

For 10,000 API calls/month:

- **Supabase Functions**: Free (within 500K limit)
- **Vercel**: Free (within bandwidth limit)
- **AWS Lambda**: Free (within 1M limit)
- **Railway**: $5/month
- **Render**: Free tier or $7/month
- **Firebase Functions**: Free (within 2M limit)

For 100,000 API calls/month:

- **Supabase Functions**: ~$0.02
- **Vercel**: Free or $20/month (Pro)
- **AWS Lambda**: ~$0.02
- **Railway**: $5/month
- **Render**: $7/month
- **Firebase Functions**: ~$0.40

---

## My Recommendation

**For your project**: Use **Supabase Edge Functions** because:

1. ✅ You're already using Supabase
2. ✅ No additional infrastructure needed
3. ✅ Free tier is generous (500K/month)
4. ✅ Easy to deploy and manage
5. ✅ Integrates with your existing Supabase setup

**Alternative**: Use **Vercel** if you want the simplest setup and might add Next.js later.

---

## See Also

- `doc/BACKEND_SETUP.md` - Using your existing Next.js backend
- `doc/ENV_SETUP.md` - Environment variable setup (development only)
- `doc/SECURITY_WARNING.md` - Security considerations

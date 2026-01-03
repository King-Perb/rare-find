# Environment Variables Setup for Mobile App

This document explains how to configure environment variables for the mobile app.

## ⚠️ CRITICAL SECURITY WARNING

**DO NOT use `EXPO_PUBLIC_` prefix for sensitive API keys in production!**

Variables prefixed with `EXPO_PUBLIC_` are **bundled into your app** and can be easily extracted by anyone. This means:

- ❌ **OpenAI API Keys** - Can be extracted and used to rack up charges on your account
- ❌ **RapidAPI Keys** - Can be extracted and used to consume your API quota
- ❌ **Amazon Secret Keys** - Can be extracted and used for unauthorized API access

**For production, use a backend API proxy instead.** See [Security Considerations](#security-considerations) below.

## Overview

The mobile app uses Expo, which requires environment variables to be prefixed with `EXPO_PUBLIC_` to be accessible in the app bundle.

**⚠️ Important**: Variables with `EXPO_PUBLIC_` prefix are included in the app bundle and are visible to users. **For sensitive credentials, you MUST use a backend API proxy in production.**

## Required Environment Variables

> **⚠️ Development Only**: The examples below use `EXPO_PUBLIC_` prefix for demonstration. In production, use a backend API proxy to keep credentials secure.

### Amazon PA-API 5.0 Credentials

Required for Amazon marketplace integration (fetching listings, searching products).

| Variable | Description | Required | Security | Default |
|----------|-------------|----------|----------|---------|
| `EXPO_PUBLIC_AMAZON_ACCESS_KEY` | Amazon PA-API access key | ✅ Yes | ⚠️ Use backend proxy in production | - |
| `EXPO_PUBLIC_AMAZON_SECRET_KEY` | Amazon PA-API secret key | ✅ Yes | ❌ **NEVER use EXPO_PUBLIC_ in production** | - |
| `EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG` | Amazon Associate tag | ✅ Yes | ✅ Safe (public identifier) | - |
| `EXPO_PUBLIC_AMAZON_REGION` | AWS region | ❌ No | ✅ Safe (public config) | `us-east-1` |

**How to get**: Sign up at https://affiliate-program.amazon.com/ and create PA-API credentials.

**⚠️ Security**: `AMAZON_SECRET_KEY` should **never** use `EXPO_PUBLIC_` prefix in production. Use a backend API proxy instead.

### eBay API Credentials

Required for eBay marketplace integration.

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `EXPO_PUBLIC_EBAY_APP_ID` | eBay Application ID | ✅ Yes | - |
| `EXPO_PUBLIC_EBAY_AUTH_TOKEN` | eBay Auth Token (optional for Finding API) | ❌ No | `''` |
| `EXPO_PUBLIC_EBAY_SITE_ID` | eBay site ID | ❌ No | `EBAY-US` |

**How to get**: Sign up at https://developer.ebay.com/ and create an application.

### OpenAI API Credentials

Required for AI evaluation features (evaluating listings, determining market value).

| Variable | Description | Required | Security | Default |
|----------|-------------|----------|----------|---------|
| `EXPO_PUBLIC_OPENAI_API_KEY` | OpenAI API key | ✅ Yes | ❌ **NEVER use EXPO_PUBLIC_ in production** | - |
| `EXPO_PUBLIC_OPENAI_MODEL` | OpenAI model to use | ❌ No | ✅ Safe (public config) | `gpt-4o` |

**How to get**: Sign up at https://platform.openai.com/ and create an API key.

**⚠️ Security**: `OPENAI_API_KEY` should **never** use `EXPO_PUBLIC_` prefix in production. Use a backend API proxy instead. Exposed keys can be used to make expensive API calls on your account.

## Optional Environment Variables

### RapidAPI Amazon Data (Alternative to PA-API)

If you prefer to use RapidAPI instead of Amazon PA-API:

| Variable | Description | Required | Security | Default |
|----------|-------------|----------|----------|---------|
| `EXPO_PUBLIC_RAPIDAPI_KEY` | RapidAPI key | ❌ No | ❌ **NEVER use EXPO_PUBLIC_ in production** | - |
| `EXPO_PUBLIC_AMAZON_API_SOURCE` | Set to `rapidapi` to use RapidAPI | ❌ No | ✅ Safe (public config) | `pa-api` |

**How to get**: Sign up at https://rapidapi.com/letscrape-6bRBa3QguO5/api/real-time-amazon-data

**⚠️ Security**: `RAPIDAPI_KEY` should **never** use `EXPO_PUBLIC_` prefix in production. Use a backend API proxy instead. Exposed keys can be used to consume your API quota.

## Setup Instructions

> **⚠️ Development Only**: These instructions are for local development and testing. For production, see [Security Considerations](#security-considerations) below and use a backend API proxy instead.

### 1. Create `.env` File

Copy the example file:

```bash
cp .env.example .env
```

### 2. Fill in Your Credentials (Development Only)

Edit `.env` and replace placeholder values with your actual credentials:

```bash
# ⚠️ WARNING: These will be exposed in the app bundle!
# Only use for local development/testing
EXPO_PUBLIC_AMAZON_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
EXPO_PUBLIC_AMAZON_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG=yourstore-20
EXPO_PUBLIC_OPENAI_API_KEY=sk-...
# ... etc
```

**⚠️ Remember**: These credentials will be visible in your app bundle. Never use this approach in production!

### 3. Load Environment Variables

Expo automatically loads `.env` files. Make sure to:

1. **Restart Expo**: After changing `.env`, restart your Expo development server:
   ```bash
   npm start
   ```

2. **Clear Cache** (if needed):
   ```bash
   npm start -- --clear
   ```

### 4. Verify Setup

Check that environment variables are loaded:

```typescript
console.log('Amazon Access Key:', process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('OpenAI API Key:', process.env.EXPO_PUBLIC_OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
```

## Security Considerations

⚠️ **CRITICAL SECURITY WARNING**:

**DO NOT use `EXPO_PUBLIC_` prefix for sensitive API keys in production!**

Variables prefixed with `EXPO_PUBLIC_` are:
- **Bundled into your app** and included in the final build
- **Visible to anyone** who inspects the app bundle (easy to extract)
- **Can be extracted** using simple tools or by inspecting the JavaScript bundle
- **Will be exposed** if your app is reverse-engineered

### ❌ NEVER Use EXPO_PUBLIC_ For:

- **OpenAI API Keys** - Can be extracted and used to rack up charges on your account
- **RapidAPI Keys** - Can be extracted and used to consume your API quota
- **Amazon Secret Keys** - Can be extracted and used to make unauthorized API calls
- **Any paid API keys** - Will result in unauthorized usage and billing issues

### ✅ Secure Alternatives for Production:

#### Option 1: Backend API Proxy (Recommended)

**Best practice**: Create a backend API that proxies all requests. Credentials stay on the server.

```typescript
// Instead of calling OpenAI directly from mobile:
const response = await fetch('https://your-backend.com/api/evaluate', {
  method: 'POST',
  body: JSON.stringify({ listing }),
  headers: { 'Authorization': `Bearer ${userToken}` }
});
```

**Benefits**:
- API keys never leave your server
- Can implement rate limiting per user
- Can add authentication/authorization
- Can cache responses
- Can monitor usage

#### Option 2: Expo SecureStore (For User-Specific Data)

For user-specific credentials that users provide themselves:

```typescript
import * as SecureStore from 'expo-secure-store';

// Store user's own API key (if they provide it)
await SecureStore.setItemAsync('user_openai_key', apiKey);

// Retrieve
const apiKey = await SecureStore.getItemAsync('user_openai_key');
```

**Note**: This is only appropriate if users provide their own API keys.

#### Option 3: Environment-Specific Configuration

- **Development**: Use `EXPO_PUBLIC_` for local testing only
- **Production**: Use backend API proxy or EAS Build secrets

### ✅ Safe to Use EXPO_PUBLIC_ For:

- Public configuration (API endpoints, feature flags)
- Non-sensitive identifiers (Amazon Associate Tag, eBay App ID)
- Public keys that are meant to be visible

### Recommended Architecture

```
Mobile App
    ↓
Backend API (Next.js/Express/etc.)
    ↓
External APIs (OpenAI, Amazon, eBay)
```

The mobile app only communicates with your backend, which holds all API keys securely.

### Git Security

- **Never commit `.env` files** to version control
- The `.env.example` file is safe to commit (no real credentials)
- Add `.env` to `.gitignore`

## Environment-Specific Configuration

### Development

Use `.env` for local development.

### Production

For production builds, you can:

1. **Use EAS Build Secrets**: Store secrets in Expo's EAS Build service
2. **Use app.json extra**: Configure in `app.json` under `extra` field
3. **Use Backend API**: Proxy all API calls through your backend

Example `app.json` configuration:

```json
{
  "expo": {
    "extra": {
      "amazonAccessKey": process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY,
      "openaiApiKey": process.env.EXPO_PUBLIC_OPENAI_API_KEY
    }
  }
}
```

## Troubleshooting

### Variables Not Loading

1. **Check prefix**: Must start with `EXPO_PUBLIC_`
2. **Restart Expo**: Restart the development server after changing `.env`
3. **Check file location**: `.env` must be in `packages/mobile/` directory
4. **Clear cache**: Run `npm start -- --clear`

### TypeScript Errors

If TypeScript complains about `process.env.EXPO_PUBLIC_*`, you may need to add type definitions:

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_AMAZON_ACCESS_KEY?: string;
    EXPO_PUBLIC_AMAZON_SECRET_KEY?: string;
    // ... etc
  }
}
```

## Example Usage

See the example files for how to use these environment variables:

- `src/lib/examples/marketplace-usage.ts` - MarketplaceService examples
- `src/lib/examples/evaluation-usage.ts` - EvaluationService examples

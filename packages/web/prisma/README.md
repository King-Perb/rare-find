# Prisma 7 Setup for Supabase

This directory contains Prisma schema and migrations for managing the database schema.

**Prisma 7 Changes:**
- Database connection URL is configured in `prisma.config.ts` (not in `schema.prisma`)
- Requires explicit database adapter (`@prisma/adapter-pg`)
- Generator uses `prisma-client` (not `prisma-client-js`)

## Setup

### 1. Configure DATABASE_URL

Add to `.env.local`:

```env
# For Prisma migrations (use connection pooling URL)
DATABASE_URL="postgresql://postgres.xabpmvuubgfjuroenxuq:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Or use direct connection (for migrations only)
# DATABASE_URL="postgresql://postgres.xabpmvuubgfjuroenxuq:[YOUR-PASSWORD]@db.xabpmvuubgfjuroenxuq.supabase.co:5432/postgres"
```

**Important**:
- Get your database password from Supabase Dashboard → Settings → Database
- Use connection pooling URL (`pooler.supabase.com:6543`) for Prisma migrations
- The direct connection URL is for one-off operations
- The URL is configured in `prisma.config.ts` (Prisma 7 requirement)

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma client in `src/generated/prisma/client`.

**Note**: Prisma 7 generates the client in a `client` subdirectory.

### 3. Push Schema to Database

```bash
npm run db:push
```

This creates/updates tables in Supabase without creating migration files.

**OR** create a migration:

```bash
npm run db:migrate
```

This creates a migration file and applies it.

## Workflow

### Schema Management (Admin)

1. **Edit schema**: Update `schema.prisma`
2. **Generate client**: `npm run db:generate`
3. **Push changes**: `npm run db:push` (dev) or `npm run db:migrate` (production)

### Data Access

- **Client-side**: Use `src/lib/supabase/client.ts` (respects RLS)
- **Server-side**: Use `src/lib/supabase/server.ts` (bypasses RLS, use carefully)
- **Schema operations**: Use `src/lib/db/prisma.ts` (admin only)

## Prisma 7 Architecture

- **Database URL**: Configured in `prisma.config.ts` (not in `schema.prisma`)
- **Adapter Required**: Prisma 7 uses `@prisma/adapter-pg` for PostgreSQL connections
- **Client Path**: Generated client is at `src/generated/prisma/client`
- **Environment Variables**: Must be loaded manually with `dotenv/config`

## Important Notes

- **Prisma is for schema management only** - Use Supabase client for data access
- **RLS policies** must be set up in Supabase Dashboard (not in Prisma)
- **Migrations** are version-controlled in `prisma/migrations/`
- **Never commit** `.env.local` with real passwords
- **Prisma 7** requires explicit adapters - see `src/lib/db/prisma.ts` for setup

## Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Create and apply migration
- `npm run db:push` - Push schema changes (dev only)
- `npm run db:pull` - Pull schema from database
- `npm run db:studio` - Open Prisma Studio (database GUI)

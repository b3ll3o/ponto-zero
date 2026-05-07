# Supabase Production Guide

## Creating a Production Project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Choose a region closest to your users (e.g., `South America - São Paulo (gru)`).
3. Set a strong database password — save it securely, you won't be able to retrieve it.
4. Wait for the project to be provisioned (~2 minutes).

## Getting Your Credentials

After setup, find your credentials in **Settings → API**:

- **Project URL**: `https://<ref>.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (safe to expose in client)
- **service_role key**: Keep this secret — only for server-side admin operations

## Environment Variables

Add these to Vercel (Settings → Environment Variables):

| Variable | Value Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` key from Supabase Settings → API |

## Running Migrations on Production

### Option A: Supabase SQL Editor (Recommended for small changes)

1. Open [Supabase Dashboard](https://app.supabase.com) → your project → **SQL Editor**.
2. Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it.
3. Repeat for `002_api_functions.sql`.

### Option B: Supabase CLI (Recommended for automated deployments)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Push migrations
supabase db push
```

To find your project ref: look at your Project URL — `https://xyzabc.supabase.co` → ref is `xyzabc`.

## Setting Up Auth

1. In Supabase Dashboard → **Authentication → Settings**:
   - Set **Site URL**: `https://your-domain.vercel.app` (or your production URL)
   - Add **Redirect URLs** for your domains
   - Configure email templates if using email auth

2. For local development, set **Site URL** to `http://localhost:3000`.

## Row Level Security (RLS)

The app uses RLS policies on all tables. The migrations already include policies restricting data access to the owning user. Always verify in **Database → Tables → Policies** that policies are active before going live.

## Production Checklist

- [ ] Supabase project created and linked
- [ ] Migrations applied (`001_initial_schema.sql`, `002_api_functions.sql`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set in Vercel env vars
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel env vars
- [ ] Site URL configured in Supabase Authentication settings
- [ ] Redirect URLs configured for production domain
- [ ] RLS policies verified active
- [ ] Email templates configured (if using email auth)

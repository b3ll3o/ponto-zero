# Environment Variables

## Required Variables

| Variable | Description | Where to Get |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous (public) key | Supabase Dashboard → Settings → API → `anon` key |

## Setup

### Local Development

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

### Vercel Deployment

1. Go to your Vercel project → **Settings → Environment Variables**.
2. Add each variable from the table above.
3. Redeploy or enable **Automatically inject system environment variables**.

For Git-integrated projects, use **Environment Variables → From .env**, which auto-detects `.env.local`.

## Security Notes

- `NEXT_PUBLIC_` prefix makes the variable available in the browser — only use for non-sensitive, public-safe values.
- The Supabase `anon` key is safe to expose in the browser because Row Level Security (RLS) protects your data.
- Never expose the `service_role` key in `NEXT_PUBLIC_` variables. Use server-side Supabase clients only.
- `.env.local` is gitignored and will not be committed.

## Environment-Specific Values

The app uses a single Supabase project for both development and production. To use separate projects:

1. Create separate Supabase projects for dev and production.
2. Use `.env.local` for local development.
3. Use Vercel Environment Variables for production with the production project credentials.

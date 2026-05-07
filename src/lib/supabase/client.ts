import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

// Guard: prevent Supabase client creation when credentials are placeholder/missing.
// This must be checked BEFORE calling createBrowserClient/createServerClient,
// otherwise @supabase/ssr throws "URL and API key are required" at build time.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const configured = isSupabaseConfigured();

export function createClient() {
  // E2E mode always uses the mock, regardless of whether Supabase is configured.
  // This ensures tests don't depend on network interception, which can be flaky in CI.
  const isE2E = process.env.NEXT_PUBLIC_E2E_TESTING === 'true'
  if (!configured || isE2E) {
    const e2eMockError = { message: 'E-mail ou senha incorretos', status: 400 }
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: isE2E
          ? async () => ({ data: { session: null, user: null }, error: e2eMockError })
          : async () => ({ data: { session: null, user: null }, error: null }),
        signUp: async () => ({ data: { session: null, user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    } as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
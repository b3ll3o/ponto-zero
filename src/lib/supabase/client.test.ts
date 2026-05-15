import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for the Supabase browser client.
 *
 * The client has two paths:
 * 1. Mock path — when NEXT_PUBLIC_SUPABASE_URL/ANON_KEY are placeholder/missing
 * 2. Real path — when valid Supabase credentials are configured
 *
 * The guard runs at module evaluation time (before any Supabase client is created),
 * which prevents "URL and API key are required" errors at build time.
 */

describe('Supabase client factory', () => {
  // Save original env
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    // Explicitly clear E2E flag for unit tests — it only belongs in E2E test runs
    process.env.NEXT_PUBLIC_E2E_TESTING = undefined;
    vi.resetModules();
  });

  describe('mock fallback — placeholder credentials', () => {
    it('returns a mock client with no-op auth methods when URL is placeholder', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder_anon_key';

      const { createClient } = await import('./client');
      const client = createClient();

      const session = await client.auth.getSession();
      expect(session.data.session).toBeNull();

      const user = await client.auth.getUser();
      expect(user.data.user).toBeNull();

      const signOut = await client.auth.signOut();
      expect(signOut.error).toBeNull();
    });

    it('returns a mock client when URL is missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid_key';

      const { createClient } = await import('./client');
      const client = createClient();

      const session = await client.auth.getSession();
      expect(session.data.session).toBeNull();
    });

    it('returns a mock client when key is missing', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co';
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const { createClient } = await import('./client');
      const client = createClient();

      const session = await client.auth.getSession();
      expect(session.data.session).toBeNull();
    });

    it('signInWithPassword returns no session on mock client', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder_anon_key';

      const { createClient } = await import('./client');
      const client = createClient();

      const result = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.data.session).toBeNull();
      expect(result.data.user).toBeNull();
    });

    it('onAuthStateChange returns an unsubscribe function', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder_anon_key';

      const { createClient } = await import('./client');
      const client = createClient();

      const subscription = client.auth.onAuthStateChange(() => {});
      expect(typeof subscription.data.subscription.unsubscribe).toBe('function');
    });

    it('signInWithPassword returns error in E2E mode', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder_anon_key';
      process.env.NEXT_PUBLIC_E2E_TESTING = 'true';

      const { createClient } = await import('./client');
      const client = createClient();

      const result = await client.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.data.session).toBeNull();
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toBe('E-mail ou senha incorretos');
    });
  });
});

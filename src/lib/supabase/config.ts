/**
 * Validates that Supabase credentials are configured (not placeholders).
 * Prevents build-time crashes when env vars are placeholder values.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes('placeholder') || key.includes('placeholder')) return false;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('supabase')) return false;
  } catch {
    return false;
  }

  return true;
}

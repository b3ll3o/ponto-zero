import { describe, it, expect } from 'vitest'
import { isSupabaseConfigured } from './config'

describe('isSupabaseConfigured', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })

  it('returns false when URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid_key'
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when key is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co'
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when URL contains placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid_key'
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when key contains placeholder', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://valid.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'placeholder_anon_key'
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when URL hostname does not include supabase', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid_key'
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns false when URL is invalid', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'not-a-valid-url'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'valid_key'
    expect(isSupabaseConfigured()).toBe(false)
  })

  it('returns true when URL and key are valid Supabase credentials', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://xyzabc.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
    expect(isSupabaseConfigured()).toBe(true)
  })

  it('returns true for real Supabase project URL with valid structure', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://myproject-ref.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.test'
    expect(isSupabaseConfigured()).toBe(true)
  })

  it('returns false when both URL and key are missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    expect(isSupabaseConfigured()).toBe(false)
  })
})

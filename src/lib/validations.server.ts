/**
 * Server-side validation functions for API routes.
 * Uses createServerClient (server-to-server Supabase calls).
 */

import { createClient } from '@/lib/supabase/server';
import {
  validateTimestamp,
  VALIDATION_ERRORS,
  type ValidationResult,
  type ValidationErrorCode,
} from './validations';

export { validateTimestamp, VALIDATION_ERRORS };
export type { ValidationResult, ValidationErrorCode };

export async function canRegisterEntryServer(userId: string): Promise<ValidationResult> {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('time_entries')
    .select('id, timestamp')
    .eq('user_id', userId)
    .eq('type', 'start')
    .gte('timestamp', `${today}T00:00:00`)
    .lt('timestamp', `${today}T23:59:59`)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    const startEntry = data[0];

    const { data: endEntry } = await supabase
      .from('time_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('type', 'end')
      .gt('timestamp', startEntry.timestamp)
      .limit(1);

    if (!endEntry || endEntry.length === 0) {
      return {
        valid: false,
        error: VALIDATION_ERRORS.ENTRY_ALREADY_EXISTS.message,
        code: 'ENTRY_ALREADY_EXISTS',
      };
    }
  }

  return { valid: true };
}

export async function canRegisterExitServer(userId: string): Promise<ValidationResult> {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('time_entries')
    .select('id, timestamp')
    .eq('user_id', userId)
    .eq('type', 'start')
    .gte('timestamp', `${today}T00:00:00`)
    .lt('timestamp', `${today}T23:59:59`)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.NO_ENTRY_TODAY.message,
      code: 'NO_ENTRY_TODAY',
    };
  }

  const startEntry = data[0];

  const { data: endEntry } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'end')
    .gt('timestamp', startEntry.timestamp)
    .limit(1);

  if (endEntry && endEntry.length > 0) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.NO_ENTRY_TODAY.message,
      code: 'NO_ENTRY_TODAY',
    };
  }

  return { valid: true };
}

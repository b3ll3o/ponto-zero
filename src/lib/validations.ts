import { createClient } from './supabase/client';

export type ValidationErrorCode = 'NO_ENTRY_TODAY' | 'ENTRY_ALREADY_EXISTS' | 'FUTURE_TIMESTAMP' | 'EXIT_WITHOUT_ENTRY';

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: ValidationErrorCode;
}

const VALIDATION_ERRORS: Record<ValidationErrorCode, { message: string; httpStatus: number }> = {
  NO_ENTRY_TODAY: {
    message: 'Não há entrada registrada para hoje',
    httpStatus: 400,
  },
  ENTRY_ALREADY_EXISTS: {
    message: 'Você já registrou entrada hoje',
    httpStatus: 400,
  },
  FUTURE_TIMESTAMP: {
    message: 'Não é permitido registrar ponto no futuro',
    httpStatus: 400,
  },
  EXIT_WITHOUT_ENTRY: {
    message: 'Não é permitido registrar saída sem entrada',
    httpStatus: 400,
  },
};

export function validateTimestamp(timestamp: Date): ValidationResult {
  const now = new Date();
  if (timestamp > now) {
    return {
      valid: false,
      error: VALIDATION_ERRORS.FUTURE_TIMESTAMP.message,
      code: 'FUTURE_TIMESTAMP',
    };
  }
  return { valid: true };
}

export async function hasOpenEntry(userId: string): Promise<boolean> {
  const supabase = createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('time_entries')
    .select('timestamp')
    .eq('user_id', userId)
    .eq('type', 'start')
    .gte('timestamp', `${today}T00:00:00`)
    .lt('timestamp', `${today}T23:59:59`)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    return false;
  }

  const startEntry = data[0];

  const { data: endEntry } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'end')
    .gt('timestamp', startEntry.timestamp)
    .limit(1);

  return endEntry === null || endEntry.length === 0;
}

export async function hasOpenEntryFromYesterday(userId: string): Promise<{ hasOpen: boolean; lastEntryTimestamp?: string }> {
  const supabase = createClient();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const { data } = await supabase
    .from('time_entries')
    .select('timestamp')
    .eq('user_id', userId)
    .eq('type', 'start')
    .gte('timestamp', `${yesterdayStr}T00:00:00`)
    .lt('timestamp', `${yesterdayStr}T23:59:59`)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (!data || data.length === 0) {
    return { hasOpen: false };
  }

  const startEntry = data[0];

  const { data: endEntry } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', userId)
    .eq('type', 'end')
    .gt('timestamp', startEntry.timestamp)
    .limit(1);

  return {
    hasOpen: !endEntry || endEntry.length === 0,
    lastEntryTimestamp: startEntry.timestamp,
  };
}

export async function canRegisterEntry(userId: string): Promise<ValidationResult> {
  const supabase = createClient();

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

export async function canRegisterExit(userId: string): Promise<ValidationResult> {
  const supabase = createClient();

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

export { VALIDATION_ERRORS };

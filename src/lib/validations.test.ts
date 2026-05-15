import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateTimestamp,
  canRegisterEntry,
  canRegisterExit,
  hasOpenEntry,
  hasOpenEntryFromYesterday,
  VALIDATION_ERRORS,
} from './validations';

const createQueryBuilderMock = (resolvedData: unknown) => {
  const queryMethods = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue({ data: resolvedData, error: null }),
  };
  return queryMethods;
};

const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

describe('validations — validateTimestamp', () => {
  it('returns valid for past timestamp', () => {
    const past = new Date(Date.now() - 1000 * 60 * 5);
    const result = validateTimestamp(past);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.code).toBeUndefined();
  });

  it('returns valid for current timestamp', () => {
    const now = new Date();
    const result = validateTimestamp(now);
    expect(result.valid).toBe(true);
  });

  it('returns error for future timestamp', () => {
    const future = new Date(Date.now() + 1000 * 60 * 60);
    const result = validateTimestamp(future);
    expect(result.valid).toBe(false);
    expect(result.error).toBe(VALIDATION_ERRORS.FUTURE_TIMESTAMP.message);
    expect(result.code).toBe('FUTURE_TIMESTAMP');
  });
});

describe('validations — hasOpenEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true when there is an open entry (start without end)', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await hasOpenEntry('user-1');
    expect(result).toBe(true);
  });

  it('returns false when entry is closed (has end)', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '2' }]));

    const result = await hasOpenEntry('user-1');
    expect(result).toBe(false);
  });

  it('returns false when no entry exists today', async () => {
    mockFrom.mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await hasOpenEntry('user-1');
    expect(result).toBe(false);
  });
});

describe('validations — canRegisterEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns valid when no entry exists today', async () => {
    mockFrom.mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await canRegisterEntry('user-1');
    expect(result.valid).toBe(true);
  });

  it('returns ENTRY_ALREADY_EXISTS when open entry exists', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await canRegisterEntry('user-1');
    expect(result.valid).toBe(false);
    expect(result.code).toBe('ENTRY_ALREADY_EXISTS');
    expect(result.error).toBe(VALIDATION_ERRORS.ENTRY_ALREADY_EXISTS.message);
  });

  it('returns valid when entry exists but has end (new shift allowed)', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '2' }]));

    const result = await canRegisterEntry('user-1');
    expect(result.valid).toBe(true);
  });
});

describe('validations — canRegisterExit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns valid when open entry exists', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await canRegisterExit('user-1');
    expect(result.valid).toBe(true);
  });

  it('returns NO_ENTRY_TODAY when no entry exists', async () => {
    mockFrom.mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await canRegisterExit('user-1');
    expect(result.valid).toBe(false);
    expect(result.code).toBe('NO_ENTRY_TODAY');
    expect(result.error).toBe(VALIDATION_ERRORS.NO_ENTRY_TODAY.message);
  });

  it('returns NO_ENTRY_TODAY when entry already has end', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '1', timestamp: '2026-05-12T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '2' }]));

    const result = await canRegisterExit('user-1');
    expect(result.valid).toBe(false);
    expect(result.code).toBe('NO_ENTRY_TODAY');
  });
});

describe('validations — hasOpenEntryFromYesterday', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns hasOpen true when yesterday has start without end', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ timestamp: '2026-05-14T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await hasOpenEntryFromYesterday('user-1');
    expect(result.hasOpen).toBe(true);
    expect(result.lastEntryTimestamp).toBe('2026-05-14T09:00:00Z');
  });

  it('returns hasOpen false when yesterday has start and end', async () => {
    mockFrom
      .mockReturnValueOnce(createQueryBuilderMock([{ timestamp: '2026-05-14T09:00:00Z' }]))
      .mockReturnValueOnce(createQueryBuilderMock([{ id: '2' }]));

    const result = await hasOpenEntryFromYesterday('user-1');
    expect(result.hasOpen).toBe(false);
  });

  it('returns hasOpen false when no yesterday entry exists', async () => {
    mockFrom.mockReturnValueOnce(createQueryBuilderMock([]));

    const result = await hasOpenEntryFromYesterday('user-1');
    expect(result.hasOpen).toBe(false);
    expect(result.lastEntryTimestamp).toBeUndefined();
  });
});

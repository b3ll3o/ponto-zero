import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockFetch = vi.fn();
const mockPush = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } }, error: null }),
    },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ token: 'test-token-123' }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'employee@test.com' },
    isLoading: false,
    companyRole: null,
    companyId: null,
    signOut: vi.fn(),
    refreshMembership: vi.fn(),
  }),
}));

global.fetch = mockFetch;

import InvitePage from '@/app/invite/[token]/page';

describe('Invite Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('displays company name when invite is valid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        company_id: 'company-1',
        email: 'admin@test.com',
        expires_at: '2026-12-31T23:59:59Z',
        company_name: 'Empresa Teste',
      }),
    });

    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByText('Empresa Teste')).toBeInTheDocument();
    });
  });

  it('shows error when invite is invalid', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invite not found' }),
    });

    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /convite inválido/i })).toBeInTheDocument();
    });
  });

  it('renders accept button for valid invite', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        company_id: 'company-1',
        email: 'admin@test.com',
        expires_at: '2026-12-31T23:59:59Z',
        company_name: 'Empresa Teste',
      }),
    });

    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /aceitar convite/i })).toBeInTheDocument();
    });
  });

  it('accepts invite successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        company_id: 'company-1',
        email: 'admin@test.com',
        expires_at: '2026-12-31T23:59:59Z',
        company_name: 'Empresa Teste',
      }),
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success', company_id: 'company-1' }),
    });

    render(<InvitePage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /aceitar convite/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /aceitar convite/i }));

    await waitFor(() => {
      expect(screen.getByText(/bem-vindo à equipe/i)).toBeInTheDocument();
    });
  });
});
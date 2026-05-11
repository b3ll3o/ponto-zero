import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockFetch = vi.fn();
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } }, error: null }),
    },
  }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'admin@test.com' },
    isLoading: false,
    companyRole: null,
    companyId: null,
    signOut: vi.fn(),
    refreshMembership: vi.fn(),
  }),
}));

global.fetch = mockFetch;

import CompanyOnboardingPage from '@/app/onboarding/company/page';

describe('Company Onboarding Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('renders company registration form', () => {
    render(<CompanyOnboardingPage />);
    expect(screen.getByLabelText(/razão social/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome fantasia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cnpj/i)).toBeInTheDocument();
  });

  it('renders plan selection options', () => {
    render(<CompanyOnboardingPage />);
    expect(screen.getByText('Grátis')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Empresarial')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<CompanyOnboardingPage />);
    expect(screen.getByRole('button', { name: /criar empresa/i })).toBeInTheDocument();
  });

  it('formats CNPJ input correctly', () => {
    render(<CompanyOnboardingPage />);

    const cnpjInput = screen.getByLabelText(/cnpj/i);
    fireEvent.change(cnpjInput, { target: { value: '12345678000199' } });

    expect(cnpjInput).toHaveValue('12.345.678/0001-99');
  });

  it('creates company successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'company-1', name: 'Empresa Teste' }),
    });

    render(<CompanyOnboardingPage />);

    fireEvent.change(screen.getByLabelText(/razão social/i), {
      target: { value: 'Empresa Teste' },
    });

    fireEvent.change(screen.getByLabelText(/cnpj/i), {
      target: { value: '12345678000199' },
    });

    fireEvent.click(screen.getByRole('button', { name: /criar empresa/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard/admin');
    });
  });

  it('shows error on company creation failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'CNPJ já cadastrado' }),
    });

    render(<CompanyOnboardingPage />);

    fireEvent.change(screen.getByLabelText(/razão social/i), {
      target: { value: 'Empresa Teste' },
    });

    fireEvent.change(screen.getByLabelText(/cnpj/i), {
      target: { value: '12345678000199' },
    });

    fireEvent.click(screen.getByRole('button', { name: /criar empresa/i }));

    await waitFor(() => {
      expect(screen.getByText(/cnpj já cadastrado/i)).toBeInTheDocument();
    });
  });

  it('allows plan selection', () => {
    render(<CompanyOnboardingPage />);

    const proPlanButton = screen.getByText('Pro').closest('button');
    fireEvent.click(proPlanButton!);

    expect(screen.getByText('Pro').closest('button')).toHaveClass(/ring-2/);
  });
});
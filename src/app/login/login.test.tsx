import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';

/**
 * Integration tests for the Login page component.
 * Uses jsdom + React Testing Library with mocked Supabase and Next.js router.
 */

// --- Shared mock state across test scopes ---
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockGetSession = vi.fn();
const mockResend = vi.fn();
const mockSubscribe = vi.fn(() => ({
  data: { subscription: { unsubscribe: () => {} } },
}));

const mockSupabaseClient = {
  auth: {
    signInWithPassword: mockSignInWithPassword,
    signUp: mockSignUp,
    resend: mockResend,
    getSession: mockGetSession,
    onAuthStateChange: mockSubscribe,
  },
};

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

// Import the component directly (mocks are registered before this runs)
import LoginPage from '@/app/login/page';

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  it('renders email and password inputs', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });

  it('renders both submit buttons', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('login button is disabled when form is empty', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled();
  });

  it('enables login button when email and password are filled', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' },
    });
    expect(screen.getByRole('button', { name: /entrar/i })).toBeEnabled();
  });

  it('shows error message on failed login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'E-mail ou senha incorretos' },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'bad@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'badpassword' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    });

    expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument();
  });

  it('redirects to dashboard on successful login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-1' } }, user: { id: 'user-1' } },
      error: null,
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'good@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'goodpassword' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    });

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('sign up button is disabled when form is empty', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeDisabled();
  });

  it('does not call signUp when clicking sign up button with empty form', () => {
    render(<LoginPage />);
    // Button is disabled, but let's double-click to be extra safe
    const signUpButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(signUpButton);
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('enables sign up button when email and password are filled', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'newpassword123' },
    });
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeEnabled();
  });

  it('shows success message on successful sign up', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: null,
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'newpassword123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    expect(screen.getByText(/conta criada! verifique seu e-mail/i)).toBeInTheDocument();
  });

  it('shows resend confirmation button after successful sign up', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: null,
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'newpassword123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    expect(screen.getByRole('button', { name: /reenviar e-mail/i })).toBeInTheDocument();
  });

  it('resend confirmation button calls resend API', async () => {
    mockSignUp.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: null,
    });
    mockResend.mockResolvedValueOnce({ error: null });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'newpassword123' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /criar conta/i }));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /reenviar e-mail/i }));
    });

    expect(mockResend).toHaveBeenCalledWith({ type: 'signup', email: 'new@example.com' });
  });

  it('redirects to dashboard when user is already confirmed on mount', async () => {
    mockGetSession.mockResolvedValueOnce({
      data: { session: { user: { id: 'user-1' } }, error: null },
    });

    render(<LoginPage />);
    // Wait for the useEffect to run
    await act(async () => {});

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('renders back to home link pointing to /', () => {
    render(<LoginPage />);
    const link = screen.getByRole('link', { name: /voltar para home/i });
    expect(link).toHaveAttribute('href', '/');
  });

  it('password field masks input', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/senha/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('email input accepts email type', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('error persists after user types without submitting', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { session: null, user: null },
      error: { message: 'E-mail ou senha incorretos' },
    });

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'bad@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'badpassword' },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    });

    expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument();

    // Error should still show even after typing new email (no auto-clear)
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'good@example.com' },
    });

    expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument();
  });
});

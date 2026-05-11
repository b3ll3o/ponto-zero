'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { type AuthChangeEvent, type User, type Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type CompanyRole = 'admin' | 'employee' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  companyRole: CompanyRole;
  companyId: string | null;
  signOut: () => Promise<void>;
  refreshMembership: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companyRole, setCompanyRole] = useState<CompanyRole>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMembership = useCallback(async (userId: string) => {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, role')
      .eq('user_id', userId)
      .single();

    if (membership) {
      setCompanyRole(membership.role as CompanyRole);
      setCompanyId(membership.company_id);
    } else {
      setCompanyRole(null);
      setCompanyId(null);
    }
  }, [supabase]);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchMembership(session.user.id);
      } else {
        setCompanyRole(null);
        setCompanyId(null);
      }
      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchMembership(session.user.id);
      } else {
        setCompanyRole(null);
        setCompanyId(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setCompanyRole(null);
    setCompanyId(null);
  };

  const refreshMembership = useCallback(async () => {
    if (user) {
      await fetchMembership(user.id);
    }
  }, [user, fetchMembership]);

  return (
    <AuthContext.Provider value={{ session, user, isLoading, companyRole, companyId, signOut, refreshMembership }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
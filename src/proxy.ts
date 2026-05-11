import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user && pathname !== '/login' && pathname !== '/' && !pathname.startsWith('/invite/')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    const { data: membership } = await supabase
      .from('company_members')
      .select('company_id, role')
      .eq('user_id', user.id)
      .single();

    const isAuthPage = pathname === '/login' || pathname === '/';
    const isInvitePage = pathname.startsWith('/invite/');

    if (isAuthPage || isInvitePage) {
      return supabaseResponse;
    }

    if (!membership) {
      if (pathname !== '/onboarding/company') {
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding/company';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (membership.role === 'admin') {
      if (pathname === '/onboarding/company') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/admin';
        return NextResponse.redirect(url);
      }
      if (!pathname.startsWith('/dashboard/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/admin';
        return NextResponse.redirect(url);
      }
    } else if (membership.role === 'employee') {
      if (pathname.startsWith('/dashboard/admin') || pathname === '/onboarding/company') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/employee';
        return NextResponse.redirect(url);
      }
      if (!pathname.startsWith('/dashboard/employee') && pathname !== '/dashboard') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard/employee';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('🔥 MIDDLEWARE TRIGGERED for path:', req.nextUrl.pathname);

  // Get all possible Supabase auth cookies
  const authCookies = [
    req.cookies.get('sb-bdakwjapkiuovjeghdkv-auth-token'),
    req.cookies.get('sb-access-token'),
    req.cookies.get('supabase-auth-token'),
    req.cookies.get('supabase.auth.token')
  ];

  // Check if any auth cookie exists and has a value
  const isAuthenticated = authCookies.some(cookie => cookie?.value);

  // Debug logging
  console.log('🔍 Middleware check:', {
    path: req.nextUrl.pathname,
    isAuthenticated,
    allCookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    authCookies: authCookies.map(c => ({ name: c?.name, hasValue: !!c?.value }))
  });

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/tasks', '/profile', '/settings'];

  // Public routes that should redirect to dashboard if authenticated
  const publicRoutes = ['/login', '/register'];

  // Home page should redirect authenticated users to dashboard
  const isHomePage = req.nextUrl.pathname === '/';

  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !isAuthenticated) {
    console.log('Redirecting unauthenticated user to login from:', req.nextUrl.pathname);
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access public auth routes or home page
  if ((isPublicRoute || isHomePage) && isAuthenticated) {
    console.log('Redirecting authenticated user to dashboard from:', req.nextUrl.pathname);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/'
  ],
};

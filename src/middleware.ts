import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySiteToken } from './lib/site-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths to ignore (admin panel, unlock page, api routes, and static assets)
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/unlock') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionCookie = request.cookies.get('site_session');
  let isUnlocked = false;

  if (sessionCookie?.value) {
    const payload = await verifySiteToken(sessionCookie.value);
    if (payload && payload.unlocked) {
      isUnlocked = true;
    }
  }

  // If not unlocked, redirect to /unlock page
  if (!isUnlocked) {
    const url = request.nextUrl.clone();
    url.pathname = '/unlock';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - assets (public folder assets)
  // - favicon.ico, icon.svg, etc.
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg).*)'],
};

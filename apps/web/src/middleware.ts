import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection.
 * Redirects unauthenticated users to the sign-in page.
 * Public routes are explicitly whitelisted.
 *
 * When DATABASE_URL is not set (local dev without a DB),
 * all routes are allowed through without auth checks.
 */

const publicPaths = ['/auth/sign-in', '/auth/sign-up', '/auth/error', '/api/auth'];

function isPublicRoute(pathname: string) {
  return publicPaths.some((path) => pathname.startsWith(path));
}

// If there's no DATABASE_URL, skip auth entirely so the app works without a DB
const hasDatabase = !!process.env.DATABASE_URL;

export default hasDatabase
  ? auth((req) => {
      const { nextUrl } = req;
      const isAuthenticated = !!req.auth;

      if (isPublicRoute(nextUrl.pathname)) {
        if (isAuthenticated && nextUrl.pathname.startsWith('/auth/')) {
          return NextResponse.redirect(new URL('/', nextUrl));
        }
        return NextResponse.next();
      }

      if (!isAuthenticated) {
        const signInUrl = new URL('/auth/sign-in', nextUrl);
        signInUrl.searchParams.set('callbackUrl', nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }

      return NextResponse.next();
    })
  : function middleware(_req: NextRequest) {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};


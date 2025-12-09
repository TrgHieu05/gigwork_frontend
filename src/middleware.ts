import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const protectedPaths = ['/employee', '/employer', '/users'];

// Paths that should redirect to dashboard if already logged in
const authPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get token from cookies (Next.js middleware can't access localStorage)
    const token = request.cookies.get('token')?.value;

    // Redirect root path to login or dashboard based on auth status
    if (pathname === '/') {
        if (token) {
            return NextResponse.redirect(new URL('/employee/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if the current path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // Check if the current path is an auth path
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));

    // If trying to access protected route without token, redirect to login
    if (isProtectedPath && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If trying to access auth pages while logged in, redirect to dashboard
    // Note: We can't easily determine role in middleware, so redirect to a generic path
    // The actual role-based redirect should happen on the client side
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/employee/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};

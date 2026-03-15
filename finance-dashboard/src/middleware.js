import { NextResponse } from 'next/server';

export function middleware(request) {
    const token = request.cookies.get('sb-token')?.value;
    const { pathname } = request.nextUrl;

    // Redirect to login if accessing protected route without token
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirect to dashboard if accessing login with token
    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - *.html (static html pages like privacy and terms)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.html$).*)',
    ],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(request: NextRequest) {
    // console.log('Middleware running for:', request.nextUrl.pathname);

    // Define public routes that don't require authentication
    const publicRoutes = ['/signin', '/signup'];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Get token from authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') ||
        request.cookies.get('token')?.value;



    // If accessing a public route (signin/signup)
    if (isPublicRoute) {
        // If user is already authenticated, redirect to dashboard
        if (token) {
            try {
                const secret = new TextEncoder().encode(JWT_SECRET);
                await jwtVerify(token, secret);
                console.log('User already authenticated, redirecting to dashboard');
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch (error) {
                console.log('Invalid token on public route, continuing to auth page');
                // Token invalid, continue to auth page
            }
        }
        return NextResponse.next();
    }

    // For all other routes (protected routes), require authentication
    if (!token) {
        //redirect to signin
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
        // Verify JWT token using Web Crypto API (Edge Runtime compatible)
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jwtVerify(token, secret);
        //authentication successful
        return NextResponse.next();
    } catch (error) {
        console.log('Invalid token, redirecting to signin', error);
        return NextResponse.redirect(new URL('/signin', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
    ],
};

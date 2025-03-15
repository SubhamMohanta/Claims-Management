import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Get the token value safely
    const role = request.cookies.get('role')?.value; // Get the role value safely
    const pathname = request.nextUrl.pathname;

    // If user is not authenticated, redirect to login page
    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based route protection
    if (role === 'patient' && pathname.startsWith('/insurer')) {
        return NextResponse.redirect(new URL('/patient/dashboard', request.url));
    }
    if (role === 'insurer' && pathname.startsWith('/patient')) {
        return NextResponse.redirect(new URL('/insurer/dashboard', request.url));
    }

    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: ['/patient/:path*', '/insurer/:path*'], 
};

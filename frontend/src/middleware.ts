import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const authUrl = process.env.AUTH_INTERNAL_URL || 'http://localhost:3001';
    const res = await fetch(`${authUrl}/auth/me`, {
      headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminRoute) {
      const data = await res.json();
      if (!data.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/library/:path*', '/playlist/:path*'],
};

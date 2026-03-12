import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const res = await fetch('http://localhost:3001/auth/me', {
      headers: { Cookie: `token=${token}` },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await res.json();
    if (!data.isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};

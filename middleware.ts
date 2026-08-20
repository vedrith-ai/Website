import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/api/', '/_next/', '/icons/', '/manifest.json', '/sw.js', '/favicon'];
const DEFAULT_LANG = 'en';
const SUPPORTED_LANGS = ['en', 'kn'];

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Skip static and API paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Detect language from cookie or Accept-Language
  const langCookie = req.cookies.get('vedrith:lang')?.value;
  const acceptLang = req.headers.get('accept-language')?.split(',')[0].split('-')[0];
  const lang = SUPPORTED_LANGS.includes(langCookie ?? '')
    ? langCookie
    : SUPPORTED_LANGS.includes(acceptLang ?? '')
    ? acceptLang
    : DEFAULT_LANG;

  const response = NextResponse.next();

  // Set lang header for server components
  response.headers.set('x-vedrith-lang', lang ?? DEFAULT_LANG);

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

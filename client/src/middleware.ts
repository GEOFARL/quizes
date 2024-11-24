import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'uk'];

export const middleware = (request: NextRequest): NextResponse | void => {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/en/${pathname}`;
  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: ['/((?!_next).*)'],
};

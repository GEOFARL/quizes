import { NextRequest, NextResponse } from "next/server";
import { LOCALES } from "./lib/constants/locales";

export const middleware = (request: NextRequest): NextResponse | void => {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/en${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

export const config = {
  matcher: ["/((?!_next).*)"],
};

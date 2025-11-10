import {NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const i18nMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const response = i18nMiddleware(request);

  const pathname = request.nextUrl.pathname
  response.headers.set('x-pathname', pathname);

  const locale = routing.locales.find((loc) => pathname.startsWith(`/${loc}`)) || routing.defaultLocale;



  return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

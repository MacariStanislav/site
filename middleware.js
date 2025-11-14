import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const firstSegment = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(firstSegment);

  if (!isValidLocale) {

    url.pathname = `/${routing.defaultLocale}`;
    return Response.redirect(url);
  }

  return createMiddleware(routing)(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

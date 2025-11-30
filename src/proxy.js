import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

export function proxy(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const segments = pathname.split('/');
  const firstSegment = segments[1];


  if (routing.locales.includes(firstSegment)) {
  
    if (segments.length === 2 || isValidRoute(segments.slice(2).join('/'))) {
      const response = NextResponse.next();
      response.cookies.set('lastPath', pathname, { path: '/' });
      return response;
    }
    
   
    return NextResponse.redirect(new URL(`/${firstSegment}`, req.url));
  }

  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/ru', req.url));
  }

  return NextResponse.redirect(new URL('/ru', req.url));
}

function isValidRoute(route) {
 
  
  const validRoutes = ['admin', 'cars','about']; 
  return validRoutes.includes(route.split('/')[0])
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
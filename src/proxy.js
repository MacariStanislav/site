import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Конфигурация безопасности
const SECURITY_CONFIG = {
  // Заблокированные пути
  blockedPaths: [
    '/.env', '/config', '/backup', '/wp-admin', '/phpmyadmin', 
    '/.git', '/.svn', '/.htaccess', '/.htpasswd', '/web.config'
  ],
  // Допустимые пути (белый список)
  allowedPaths: ['admin', 'cars', 'about', 'contact', 'services', 'auth'],
  // Допустимые методы
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Максимальная длина пути
  maxPathLength: 200
};

/**
 * Проверка безопасности запроса
 */
function securityCheck(req, pathname) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  
  // 1. Проверка длины пути
  if (pathname.length > SECURITY_CONFIG.maxPathLength) {
    console.warn(`[SECURITY] Path too long: ${pathname} from IP: ${ip}`);
    return false;
  }
  
  // 2. Проверка на заблокированные пути
  for (const blockedPath of SECURITY_CONFIG.blockedPaths) {
    if (pathname.includes(blockedPath)) {
      console.warn(`[SECURITY] Blocked path: ${pathname} from IP: ${ip}`);
      return false;
    }
  }
  
  // 3. Проверка User-Agent
  if (!userAgent || userAgent.length < 10) {
    console.warn(`[SECURITY] Suspicious User-Agent from IP: ${ip}`);
    return false;
  }
  
  // 4. Проверка на SQL инъекции (базовая)
  const sqlKeywords = ['SELECT ', 'INSERT ', 'UPDATE ', 'DELETE ', 'DROP ', 'UNION ', 'OR ', 'AND '];
  const upperPath = pathname.toUpperCase();
  for (const keyword of sqlKeywords) {
    if (upperPath.includes(keyword)) {
      console.warn(`[SECURITY] Possible SQL injection: ${pathname} from IP: ${ip}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Добавление security headers к ответу
 */
function addSecurityHeaders(response, isApi = false) {
  // Удаляем информативные заголовки
  response.headers.delete('x-powered-by');
  response.headers.delete('server');
  response.headers.delete('via');
  response.headers.delete('x-backend-url');
  response.headers.delete('x-response-time');
  
  // Основные security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Маскируем информацию о бэкенде
  response.headers.set('Server', 'NextJS');
  response.headers.set('X-Backend-Info', 'hidden');
  response.headers.set('X-API-Source', 'proxy');
  
  // Cache control
  if (isApi) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  } else {
    response.headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
  }
  
  return response;
}

export function proxy(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  
  // Проверка безопасности
  if (!securityCheck(req, pathname)) {
    const response = new NextResponse('Access Denied', {
      status: 403,
      statusText: 'Forbidden'
    });
    return addSecurityHeaders(response);
  }
  
  // Пропускаем статические файлы и API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/manifest.json') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml')
  ) {
    const response = NextResponse.next();
    return addSecurityHeaders(response, pathname.startsWith('/api'));
  }
  
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  
  // Обработка локалей
  if (routing.locales.includes(firstSegment)) {
    if (segments.length === 2 || isValidRoute(segments.slice(2).join('/'))) {
      const response = NextResponse.next();
      
      // Безопасные куки
      response.cookies.set('lastPath', pathname, { 
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 неделя
      });
      
      return addSecurityHeaders(response);
    }
    
    const redirectResponse = NextResponse.redirect(new URL(`/${firstSegment}`, req.url));
    return addSecurityHeaders(redirectResponse);
  }
  
  // Корневой путь
  if (pathname === '/' || pathname === '') {
    const redirectResponse = NextResponse.redirect(new URL('/ru', req.url));
    return addSecurityHeaders(redirectResponse);
  }
  
  // Все остальные пути
  const redirectResponse = NextResponse.redirect(new URL('/ru', req.url));
  return addSecurityHeaders(redirectResponse);
}

function isValidRoute(route) {
  // Проверка на path traversal
  if (route.includes('..') || route.includes('~') || route.includes('//')) {
    return false;
  }
  
  const firstPart = route.split('/')[0];
  return SECURITY_CONFIG.allowedPaths.includes(firstPart);
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};  
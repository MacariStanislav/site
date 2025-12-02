import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL;

export async function GET(request, { params }) {
  try {
    const { proxy } = await params;
    const path = proxy.join('/');
    
    // Проверяем допустимость пути
    if (!isPathAllowed(path)) {
      return NextResponse.json(
        { error: 'Path not allowed' },
        { status: 403 }
      );
    }
    
    // Делаем запрос к реальному бэкенду
    const backendResponse = await fetch(`${BACKEND_URL}/${path}${request.nextUrl.search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-Proxy/1.0',
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10000) // Таймаут 10 секунд
    });
    
    const data = await backendResponse.json();
    
    // Создаем маскированный ответ
    const response = NextResponse.json({
      success: true,
      data: data
    });
    
    // Очищаем заголовки
    response.headers.delete('server');
    response.headers.delete('x-powered-by');
    response.headers.delete('x-backend-url');
    
    // Добавляем наши заголовки
    response.headers.set('X-Proxy', 'Next.js');
    response.headers.set('X-API-Masked', 'true');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    
    return response;
    
  } catch (error) {
    console.error('Proxy error:', error.name);
    
    // Возвращаем общую ошибку
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

// Проверка допустимости пути
function isPathAllowed(path) {
  const allowedPaths = [
    'cars',
    'cars/paginated',
    'cars/', // Для cars/:slug
    'auth',
    'users'
  ];
  
  return allowedPaths.some(allowed => 
    path === allowed || (allowed.endsWith('/') && path.startsWith(allowed))
  );
}

export const runtime = 'nodejs';
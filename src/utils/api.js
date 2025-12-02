import axios from 'axios';

// Базовый URL через прокси (все запросы идут через Next.js API)
const API_PREFIX = '/api/proxy';

// Генератор ID запроса
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const api = axios.create({
  baseURL: API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
    'X-Client': 'nextjs-web',
    'X-Masked': 'true'
  },
  timeout: 15000,
});

// Маскировка URL в логах
const maskUrlForLogs = (url) => {
  if (!url) return '[hidden]';
  // Оставляем только путь, удаляем домен и параметры
  const path = url.split('?')[0];
  const parts = path.split('/');
  if (parts.length > 3) {
    return `/${parts.slice(1, 4).join('/')}...`;
  }
  return path;
};

// Интерсептор для запросов
api.interceptors.request.use(
  (config) => {
    const requestId = generateRequestId();
    
    // Добавляем заголовки безопасности
    config.headers['X-Request-ID'] = requestId;
    config.headers['X-Timestamp'] = Date.now().toString();
    config.headers['X-Client-Version'] = '1.0';
    
    // Добавляем случайную задержку (50-150ms)
    const delay = 50 + Math.floor(Math.random() * 100);
    config.delay = delay;
    
    // Маскируем URL для внутреннего использования
    config._maskedUrl = maskUrlForLogs(config.url);
    
    // Логируем только маскированную информацию
    console.log(`[API Request ${requestId}] ${config.method?.toUpperCase()} ${config._maskedUrl}`);
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', 'Network error');
    return Promise.reject(new Error('Network error'));
  }
);

// Интерсептор для ответов
api.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers['X-Request-ID'] || 'unknown';
    
    // Удаляем чувствительные заголовки
    const safeHeaders = {};
    const allowedHeaders = ['content-type', 'cache-control'];
    
    Object.keys(response.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (allowedHeaders.includes(lowerKey)) {
        safeHeaders[key] = response.headers[key];
      }
    });
    
    response.headers = safeHeaders;
    
    // Добавляем заголовки маскировки
    response.headers['X-API-Masked'] = 'true';
    response.headers['X-Proxy'] = 'NextJS';
    
    // Маскируем конфиг
    response.config.url = response.config._maskedUrl || '[hidden]';
    delete response.config._maskedUrl;
    
    // Логируем успешный ответ
    console.log(`[API Response ${requestId}] Success`);
    
    return response;
  },
  (error) => {
    const requestId = error.config?.headers?.['X-Request-ID'] || 'unknown';
    
    // Маскируем ошибку
    const maskedError = new Error('Service temporarily unavailable');
    maskedError.code = 'SERVICE_ERROR';
    
    if (error.response) {
      // Маскируем статусы ошибок
      const status = error.response.status;
      if (status === 401) maskedError.message = 'Authentication required';
      else if (status === 403) maskedError.message = 'Access denied';
      else if (status === 404) maskedError.message = 'Resource not found';
      else if (status === 429) maskedError.message = 'Too many requests';
      else if (status >= 500) maskedError.message = 'Server error';
      
      // Маскируем данные ошибки
      error.response.data = {
        error: true,
        message: maskedError.message,
        code: 'API_ERROR'
      };
    }
    
    // Логируем маскированную ошибку
    console.log(`[API Response ${requestId}] Error: ${maskedError.message}`);
    
    return Promise.reject(maskedError);
  }
);

// Скрываем методы от интроспекции
Object.defineProperty(api, 'generateRequestId', {
  value: generateRequestId,
  writable: false,
  configurable: false,
  enumerable: false
});

export default api;
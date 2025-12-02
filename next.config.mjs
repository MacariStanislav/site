import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  
  // Отключаем source maps в production
  productionBrowserSourceMaps: false,
  
  // Включить сжатие
  compress: true,
  
  // Заголовки безопасности
  async headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Маскируем информацию
          {
            key: 'Server',
            value: 'NextJS-App'
          },
          {
            key: 'X-Powered-By',
            value: 'Next.js'
          }
        ],
      },
    ];
    
    // Добавляем CORS заголовки для API
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    headers.push({
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: appUrl
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET, POST, PUT, DELETE, OPTIONS'
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Content-Type, Authorization, X-Request-ID, X-Timestamp'
        },
        {
          key: 'Access-Control-Max-Age',
          value: '86400'
        }
      ],
    });
    
    return headers;
  },
  
  // Rewrites для маскировки API (с проверкой)
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL;
    
    // Если URL не указан, не добавляем rewrites
    if (!backendUrl || backendUrl === 'undefined') {
      console.warn('BACKEND_API_URL не установлен, отключаем rewrites');
      return {};
    }
    
    // Проверяем что URL валидный
    if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      console.error('BACKEND_API_URL должен начинаться с http:// или https://');
      return {};
    }
    
    return {
      beforeFiles: [
        {
          source: '/api/proxy/:path*',
          destination: `${backendUrl}/:path*`
        }
      ],
    };
  },
  
  // Оптимизация изображений
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Базовые webpack настройки (без terser-webpack-plugin)
  webpack: (config, { isServer, dev }) => {
    // Только для клиентской production сборки
    if (!isServer && !dev) {
      // Простая оптимизация без внешних плагинов
      config.optimization.minimize = true;
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      
      // Базовая конфигурация минификации через встроенный минификатор
      if (config.optimization.minimizer && Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer.forEach((minimizer) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            // Настройки для встроенного Terser
            minimizer.options = {
              ...minimizer.options,
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                },
                output: {
                  comments: false
                }
              }
            };
          }
        });
      }
    }
    
    return config;
  },
};

export default withNextIntl(nextConfig);
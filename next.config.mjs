import createNextIntlPlugin from 'next-intl/plugin';
import TerserPlugin from 'terser-webpack-plugin';

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
  
  // Rewrites для маскировки API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/proxy/:path*',
          destination: `${process.env.BACKEND_API_URL}/:path*`
        }
      ],
      afterFiles: [],
      fallback: [],
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
  
  // Webpack конфигурация для обфускации
  webpack: (config, { isServer, dev }) => {
    // Только для клиентской production сборки
    if (!isServer && !dev) {
      // Минификация с обфускацией
 
      
      if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }
      
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Убираем console.log в production
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info', 'console.debug']
            },
            mangle: {
              properties: {
                regex: /^_/ // Манглям приватные свойства
              }
            },
            output: {
              comments: false // Убираем комментарии
            }
          }
        })
      );
      
      // Обфускация имен модулей
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    
    return config;
  },
  
 
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
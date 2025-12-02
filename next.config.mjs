import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем проблемные функции
  reactCompiler: false,
  
  // Базовые настройки
  productionBrowserSourceMaps: false,
  compress: true,
  swcMinify: true,
  
  // Заголовки безопасности
  async headers() {
    return [
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
          }
        ]
      }
    ];
  },
  
  // Rewrites для API прокси
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL;
    
    if (!backendUrl || backendUrl === 'undefined') {
      return {};
    }
    
    return {
      beforeFiles: [
        {
          source: '/api/proxy/:path*',
          destination: `${backendUrl}/:path*`
        }
      ]
    };
  },
  
  // Изображения
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  
  // Убираем console.log в production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

export default withNextIntl(nextConfig);
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
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          { key: 'Server', value: 'NextJS-App' },
          { key: 'X-Powered-By', value: 'Next.js' }
        ]
      }
    ];

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    headers.push({
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: appUrl },
        { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Request-ID, X-Timestamp' },
        { key: 'Access-Control-Max-Age', value: '86400' }
      ]
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
      ]
    };
  },

  // Оптимизация изображений
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },

  // Webpack без TerserPlugin (потому что ломал билд)
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Минимальные безопасные оптимизации
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }
    return config;
  },

  // Разрешаем игнор ошибок TS
  typescript: {
    ignoreBuildErrors: true
  }
};

export default withNextIntl(nextConfig);

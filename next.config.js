/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    // Allow local images to be optimized
    unoptimized: false,
  },
  // Enable experimental features for better preview support
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Headers for preview mode
  async headers() {
    return [
      {
        source: '/preview/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
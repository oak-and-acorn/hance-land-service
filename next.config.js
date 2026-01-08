/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    // Disable image optimization for static exports and simpler deployment
    unoptimized: true,
  },
  // Ensure static files are properly handled
  trailingSlash: false,
  output: 'standalone', // Better for production deployments
  // Enable experimental features for better preview support
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  // Headers for preview mode and static assets
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
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
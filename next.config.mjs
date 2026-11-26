/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .mdx files to be used as pages if needed in future
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'opengraph.githubassets.com',
      },
    ],
  },
  // Tree-shake large libraries for smaller client bundles
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Compress responses
  compress: true,
  // Strict mode for better debugging in development
  reactStrictMode: true,
  // Disable x-powered-by header for security
  poweredByHeader: false,
}

export default nextConfig

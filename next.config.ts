import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',  // Static export for Vercel
  images: {
    unoptimized: true  // For static export
  },
  trailingSlash: true,
}

export default nextConfig
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'content/posts/drafts/**',
        'node_modules/@img/sharp-libvips-linuxmusl-x64/**',
      ],
    },
  },
}

export default nextConfig
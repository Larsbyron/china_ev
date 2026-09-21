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
        // public/images is served statically by the CDN; it never needs to be
        // traced into a serverless function. Because articles/[slug]/page.tsx
        // imports @/lib/images (which references path.join(cwd,'public/images')),
        // the tracer was copying all ~147 MB / ~2800 files into 9 of 20 function
        // bundles, inflating Functions Storage per deployment (and risking the
        // 250 MB unzipped cap). Excluding it here does NOT remove the images from
        // the deployment — only from the function bundles.
        'public/images/**',
        'public/pagefind/**',
        'public/posts/**',
        'public/*.xml',
      ],
    },
  },
}

export default nextConfig
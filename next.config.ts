import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true,
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        // Production media host: R2 bucket behind a Cloudflare custom domain
        // (CDN-cached, no r2.dev rate limit). Set NEXT_PUBLIC_S3_URL to this.
        protocol: 'https',
        hostname: 'media.bielanoc.sk',
      },
      {
        // Legacy/fallback: R2 public development URL (rate-limited, uncached).
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default withPayload(nextConfig)

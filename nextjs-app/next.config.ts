import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Pin file tracing to this directory so Next doesn't pick up an unrelated lockfile higher in E:\temp
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' }
    ]
  }
};

export default nextConfig;

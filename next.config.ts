import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
    },
  },
};

module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // bwip-js i qrcode su Node.js-only paketi — ne smiju se bundlati
  serverExternalPackages: ['bwip-js', 'qrcode'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

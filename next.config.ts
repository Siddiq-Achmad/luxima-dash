import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: 'https',
        hostname: 'r2.luxima.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.luxima.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.luxima.id',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'supa.luxima.id',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;

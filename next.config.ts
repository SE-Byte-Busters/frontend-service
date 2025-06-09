import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shahriar.thetechverse.ir',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

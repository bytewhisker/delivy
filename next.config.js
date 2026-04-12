/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  devIndicators: {
    appIsrStatus: false,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
    ],
  },
};

module.exports = nextConfig;

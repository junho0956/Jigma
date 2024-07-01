/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liveblocks.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.multiavatar.com',
        port: ''
      }
    ]
  }
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ปิดเพื่อลดการ reload
  swcMinify: true,
  // ปิด Fast Refresh เพื่อแก้ปัญหา reload ตลอด
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // ลบ appDir config ที่ไม่จำเป็น
  },
}

module.exports = nextConfig 
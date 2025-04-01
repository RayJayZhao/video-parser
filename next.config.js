/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['p26-sign.douyinpic.com', 'v11-coldf.douyinvod.com'],
  },
}

module.exports = nextConfig 
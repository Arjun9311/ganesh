/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Helps Three.js canvas lifecycles avoid double initialization in dev
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;

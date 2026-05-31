/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@modules': require('path').resolve(__dirname, '../../modules'),
      '@pulse-r24': require('path').resolve(__dirname, '../../packages'),
    }
    return config
  }
}

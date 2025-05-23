const checkEnvVariables = require('./check-env-variables')

checkEnvVariables()

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SPACE_DOMAIN || 'localhost',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_CDN_SPACE_DOMAIN || 'localhost',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SPACE_ENDPOINT || 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'strapi-medusa-thermal.52669d4eba90673678564ee72a1bc437.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-830142e539d846c68f37629e1b2bcfdc.r2.dev',
      },
    ],
  },
}

module.exports = nextConfig

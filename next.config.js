/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgo: false,
          svgoConfig: {
            prefixIds: false,
          },
        },
      }],
    });
    return config;
  },
}

module.exports = nextConfig

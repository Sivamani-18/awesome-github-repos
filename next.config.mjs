/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/awesome-github-repos' : '', // Use an empty string for development
  assetPrefix: isProd
    ? 'https://sivamani-18.github.io/awesome-github-repos/'
    : undefined,
  trailingSlash: true,
  publicRuntimeConfig: {
    basePath: isProd ? '/awesome-github-repos' : '',
  },
};

export default nextConfig;

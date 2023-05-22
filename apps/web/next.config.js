/** @type {import('next').NextConfig} */
module.exports = {
  // it will cause re-rendering twice it working only in development
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  typescript: { ignoreBuildErrors: true }
};

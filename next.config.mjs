/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // The source site serves AVIF/PNG through the Next.js image optimizer
    // (/_next/image?url=...&w=...&q=75). Keeping the default loader reproduces
    // the exact same srcSet widths and `q=75` query string.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The lander moved to the site root. Anything already pointing at the old
  // path — live ads, shared links — keeps working.
  async redirects() {
    return [{ source: '/workshop-v-test', destination: '/', permanent: true }];
  },
  images: {
    // The source site serves AVIF/PNG through the Next.js image optimizer
    // (/_next/image?url=...&w=...&q=75). Keeping the default loader reproduces
    // the exact same srcSet widths and `q=75` query string.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

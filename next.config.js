/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/freshstart-uk/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  async redirects() {
    return [
      // Canonical tool slugs — redirect old/alternative slugs
      {
        source: "/tools/bank-comparison",
        destination: "/tools/bank-compare",
        permanent: true,
      },
      {
        source: "/tools/sim-comparison",
        destination: "/tools/sim-guide",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

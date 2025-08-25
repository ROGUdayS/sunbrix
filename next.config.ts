import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 300, // 5 minutes for dynamic routes (increased from 30s)
      static: 3600, // 1 hour for static routes (increased from 5m)
    },
  },
  images: {
    domains: ["rzkmikgqpkblsjbrmnkw.supabase.co"], // Add domains for external images if needed
    formats: ["image/webp", "image/avif"],
  },
  // Enable compression
  compress: true,
  // Generate static pages for better performance
  output: "standalone",
  // Enable better caching headers for API routes
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

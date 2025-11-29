import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 300, // 5 minutes for static routes
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rzkmikgqpkblsjbrmnkw.supabase.co",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 604800, // Cache optimized images for 1 week
  },
  // Enable compression
  compress: true,
  // Generate static pages for better performance
  output: "standalone",
};

export default nextConfig;
